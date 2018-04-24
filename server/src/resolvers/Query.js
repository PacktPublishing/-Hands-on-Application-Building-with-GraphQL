const { getUserId } = require('../utils');

const Query = {
  board(parent, { id }, ctx, info) {
    getUserId(ctx);
    return ctx.db.query.board({ where: { id } }, info);
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },
};

module.exports = { Query };
