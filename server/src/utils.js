const jwt = require('jsonwebtoken');

const { createError } = require('apollo-errors');

const NotAuthorizedError = 'NotAuthorizedError';

const AuthError = createError(NotAuthorizedError, {
  message: NotAuthorizedError,
});

function getUserId(ctx) {
  const Authorization = ctx.request
    ? ctx.request.get('Authorization')
    : ctx.connection.context.Authorization;

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(
      token,
      process.env.APP_SECRET
    );
    return userId;
  }

  throw new AuthError({
    message: 'Not authorized',
  });
}

module.exports = {
  getUserId,
  AuthError,
  NotAuthorizedError,
};
