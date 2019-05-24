import {
  addMockFunctionsToSchema,
  makeExecutableSchema,
} from 'graphql-tools';

// eslint-disable-next-line no-unused-vars
import { MockList } from 'graphql-tools';

// a schema
const typeDefs = `
  type Board {
    id: ID!
    lists: [List!]!
    name: String!
  }
  type List {
    cards: [Card!]!
    id: ID!
    name: String!
  }
  type Card {
    id: ID!
    name: String!
  }
  type Query {
    hello: String
    Board(id: String): Board
  }`;
const resolvers = {
  Board: () => ({
    name: 'old resolvers',
  }),
};
// Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Add mocking
const mocks = {
  //Board: (parent, args) => ({
  //name: () => 'heeh',
  // id: args.id || uuid.v4(),
  // lists: () => new MockList(1)
  //}),
};

addMockFunctionsToSchema({ schema, mocks });
