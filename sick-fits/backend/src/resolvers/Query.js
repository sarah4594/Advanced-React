const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check if there is a curretn user ID
    if (!ctx.request.userId) {
      return null
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info,
    )
  },
  async users(parent, args, ctx, info) {
    // 1. Check if user has permissions to query all users
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    // 2. If they do, query all users
    return ctx.db.query.users({}, info)
  },
  async order(parent, args, ctx, info) {
    // 1. MAke sure they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    // 2. Query teh current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info,
    )
    // 3. Check if they have the permissisons to see order
    const ownsOrder = order.user.id === ctx.request.userId
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN',
    )
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('You cant see this')
    }
    // 4. Return order
    return order
  },
}

module.exports = Query
