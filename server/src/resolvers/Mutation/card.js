const { getUserId } = require('../../utils');

const card = {
  async updateManyCards(parent, args, ctx, info) {
    getUserId(ctx);


    return await ctx.db.mutation.updateManyCards(
      args,
      info
    );
  },
};

module.exports = { card };
