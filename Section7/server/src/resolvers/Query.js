const { getUserId } = require('../utils');

const Query = {
  board(parent, { where }, ctx, info) {
    getUserId(ctx);
    return ctx.db.query.board({ where }, info);
  },

  list(parent, { where }, ctx, info) {
    getUserId(ctx);
      return ctx.db.query.list({ where }, info);
    },

  me(parent, { where }, ctx, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },
};

module.exports = { Query };
