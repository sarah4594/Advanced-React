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
}

module.exports = Query
