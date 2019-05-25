const { getUserId } = require('../utils');

const Query = {
  board(parent, { where }, ctx, info) {
    getUserId(ctx);
    return ctx.db.query.board({ where }, info);
  },

  me(parent, { where }, ctx, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },
};

module.exports = { Query };
