const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const { formatError } = require('apollo-errors');
const resolvers = require('./resolvers');

const options = {
  formatError: (...args) => {
    return formatError(...args);
  },
};

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: req => ({
    ...req,
    db: new Prisma({
      // the Prisma DB schema
      typeDefs: 'src/generated/prisma.graphql',
      // the endpoint of the Prisma DB service (value is set in .env)
      endpoint: process.env.PRISMA_ENDPOINT,
      // taken from database/prisma.yml (value is set in .env)
      secret: process.env.PRISMA_SECRET,
      // log all GraphQL queries & mutations
      debug: true,
    }),
  }),
});

server.start(options, () =>
  console.log(
    'Server is running on http://localhost:4000'
  )
);
