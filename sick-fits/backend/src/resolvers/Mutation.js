const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO! Checked if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // title: args.title
          // desc: args.desc
          // same as...
          ...args,
        },
      },
      info,
    )

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
    const item = await ctx.db.query.item({ where }, `{ id title}`)
    // 2. check if they own that item or have permissions
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
}

module.exports = Mutation
