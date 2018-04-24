import {GraphQLServer} from 'graphql-yoga'
import {schema} from './schema';

const server = new GraphQLServer({schema});

let config = {
  port: 4000
};
let logServerStarted = (options) =>
  console.log(
    `Server is running on localhost:${options.port}`);

server.start(
  config,
  (runOptions) => logServerStarted(runOptions)
);
