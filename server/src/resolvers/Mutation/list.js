const { getUserId } = require('../../utils');

const list = {
  async updateList(parent, args, ctx, info) {
    const userId = getUserId(ctx);

    const list = await ctx.db.mutation.updateList(
      {
        where: args.where,
        data: {
          ...args.data,
          updatedBy: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
    return list;
  },
  async deleteList(parent, args, ctx, info) {
    getUserId(ctx);
    return await ctx.db.mutation.deleteList(
      args,
      info
    );
  },
};

module.exports = { list };
