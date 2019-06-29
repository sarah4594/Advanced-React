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
}

module.exports = Mutation
