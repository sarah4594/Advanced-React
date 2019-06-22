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
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || []
  //   // create a dog
  //   const newDog = { name: args.name }
  //   global.dogs.push(newDog)
  //   return newDog
  // },
}

module.exports = Mutation
