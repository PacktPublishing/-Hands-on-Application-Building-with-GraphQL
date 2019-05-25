import express from 'express';

const {ApolloServer, gql} = require('apollo-server-express');

import {schema} from './schema';

const PORT = 3000;

const server = express();

const apolloServer = new ApolloServer({ schema,
  debug: true,
  tracing: true,
  playground: true
});

apolloServer.applyMiddleware({
  path: '/graphql',
  app: server });

server.listen({ port: PORT }, () =>  console.log(`GraphQL Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`)
)
