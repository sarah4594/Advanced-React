const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')
const stripe = require('../stripe')

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO! Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how to create a relationship between the Item and the User
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          // title: args.title
          // desc: args.desc
          // same as...
          ...args,
        },
      },
      info,
    )
    console.log(item)
    return item
  },

  updateItem(parent, args, ctx, info) {
    // first take copy of updates
    const updates = { ...args }
    //remove ID from updates because con't update IDs
    delete updates.id
    // run upadte method
    return ctx.db.mutation.updateItem(
      {
        // data = what data to actually update
        data: updates,
        // where = tells which item to update
        where: {
          id: args.id,
        },
        // info = how updateItem knows what to return
      },
      info,
    )
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. find item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`)
    // 2. check if they own that item or have permissions
    const isAdmin = ctx.request.user.permissions.includes('ADMIN')
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.includes('ITEMDELETE')
    if (!(isAdmin || (ownsItem && hasPermissions))) {
      throw new Error('You Do Not Have Permission To Do That')
    }
    // 3. delete it
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signup(parent, args, ctx, info) {
    // Problem with authenticating when case is involved
    args.email = args.email.toLowerCase()
    // hash their password, can't put passwords in db
    // SALT - makes your generation unique
    const password = await bcrypt.hash(args.password, 10)
    // Create user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    )
    // Create JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // We set the JWT as a cookie on the repsponse
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
    // Return user to the browser
    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }
    // 2. Check if password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid Password')
    }
    // 3. Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // 4. Set cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
    // 5. Return the user
    return user
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'Goodbye' }
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if real user
    const user = await ctx.db.query.user({ where: { email: args.email } })
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`)
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 //one hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    })
    console.log(res)
    //3. Email them the reset token
    const mailRes = await transport.sendMail({
      from: 'sarah4594@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${
        process.env.FRONTEND_URL
      }/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    })
    // 4. Return message
    return { message: 'Thanks' }
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Passwords do not match')
    }
    // 2. Check if it is a legit reset token
    // 3. Check if it is expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    })
    if (!user) {
      throw new Error('This token is either invalid or expired')
    }
    // 4. Hash new password
    const password = await bcrypt.hash(args.password, 10)
    // 5. Save the new password to the user
    // and remove old resetToken
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    // 7. Set JWT cokie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
    // 8. Return the new user
    return updatedUser
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    // 2. Query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info,
    )
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    // 4. Update permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: { id: args.userId },
      },
      info,
    )
  },

  async addToCart(parent, args, ctx, info) {
    // 1. Make sure they are signed in
    const { userId } = ctx.request
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    // 2. Query the users current cart
    // Want to query by user ID and ID of item they want to put in
    // cartItem"S" because sigular ones are usually just by id and plural has more filters
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    })
    // 3. Check if that item is already in their cart
    // 4A. If it is, increment by 1
    if (existingCartItem) {
      console.log('This item is alreay in their cart')
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info,
      )
    }
    // 4B. If it's not, create freesh cart item for user
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info,
    )
  },

  async removeFromCart(parent, args, ctx, info) {
    // 1. Find cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id,
        },
      },
      `{ id, user{ id }}`,
    )
    // 1.5. Make sure we found an item
    if (!cartItem) {
      throw new Error('No cart item found')
    }
    // 2. Make sure they own that cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error('You cannot do that')
    }
    // 3. Delete that cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: {
          id: args.id,
        },
      },
      info,
    )
  },

  async createOrder(parent, args, ctx, info) {
    // 1. Query current user and make sure they are signed in
    const { userId } = ctx.request
    if (!userId) throw new Error('You must be logged in to complete the order!')
    const user = await ctx.db.query.user(
      {
        where: {
          id: userId,
        },
      },
      `{id
        name
        email
        cart {
          id
          quantity
          item {
            title
            price
            id
            description
            image
            largeImage
          }}}
      `,
    )
    // 2. Recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0,
    )
    console.log(`charging for ${amount}`)
    // 3. Create the Stripe charge (turn token into money)
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    })
    // 4. Convert the cartItems to orderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      }
      delete orderItem.id
      return orderItem
    })
    // 5. Create the order
    // Creating one type here (order) then passing it an
    // array other other items and will create an array
    // of order items for us in one swoop
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    })
    // 6. Clean up - clear the user's cart, delete cartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id)
    // built in function
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    })
    // 7. Return the Order to the client
    return order
  },

  // async rating(parent, args, ctx, info) {
  // 1. Make sure they are signed in
  // const { userId } = ctx.request
  // if (!ctx.request.userId) {
  //   throw new Error('You must be logged in to do that!')
  // }
  // 2. query the item
  // const where = { id: args.id }
  // const item = await ctx.db.query.item({ where }, `{ id title user { id }}`)
  // 3. check to see if they've rated already
  // const rating = ctx.
  // 4. create new item rating
  // 5. sum existing rating
  // 6. calculate average
  // 7. return rating
  // },
}

module.exports = Mutation
