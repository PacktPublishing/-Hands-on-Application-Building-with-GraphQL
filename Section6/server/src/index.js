const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const resolvers = require('./resolvers');


const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
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
server.start(() =>
  console.log(
    'Server is running on http://localhost:4000'
  )
);
