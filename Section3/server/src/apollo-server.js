import express from 'express';
import bodyParser from 'body-parser';

import {
  graphqlExpress,
  graphiqlExpress} from 'apollo-server-express';

import {schema} from './schema';

const PORT = 3000;

const server = express();

server.use('/graphql',
  bodyParser.json(),
  graphqlExpress({
      schema,
      tracing: false,
    }
  ));

server.use('/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    query: ``,
  }));

server.listen(PORT, () => {
  console.log(
    `GraphQL Server is now running on 
     http://localhost:${PORT}/graphql`);

  console.log(
    `View GraphiQL at 
     http://localhost:${PORT}/graphiql`);
});
