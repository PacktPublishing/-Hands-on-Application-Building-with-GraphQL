const { Query } = require('./Query');
const { Subscription } = require('./Subscription');
const { auth } = require('./Mutation/auth');
const { board } = require('./Mutation/board');
const { list } = require('./Mutation/list');
const { card } = require('./Mutation/card');
const { AuthPayload } = require('./AuthPayload');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...board,
    ...list,
    ...card,
  },
  Subscription,
  AuthPayload,
  // https://github.com/prisma/prisma/issues/2225#issuecomment-413265367
  Node: {
    __resolveType(obj, ctx, info) {
      return obj.__typename;
    },
  },
};
