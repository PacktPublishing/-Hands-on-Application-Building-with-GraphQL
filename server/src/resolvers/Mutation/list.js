const { getUserId } = require('../../utils');

const list = {
  async updateList(parent, args, ctx, info) {
    getUserId(ctx);
    const list = await ctx.db.mutation.updateList(
      args,
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
