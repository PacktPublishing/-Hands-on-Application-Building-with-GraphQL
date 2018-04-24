const { Query } = require('./Query');
const { auth } = require('./Mutation/auth');
const { AuthPayload } = require('./AuthPayload');

module.exports = {
  Query,
  Mutation: {
    ...auth,
  },
  AuthPayload,
};
