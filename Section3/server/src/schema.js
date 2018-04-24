import {
  makeExecutableSchema
} from 'graphql-tools';
import casual from 'casual';
import fetch from 'node-fetch'

// Our schema for Trello
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
  type Member {
    id: ID!
    username: String!
    url: String!
    boards(first:Int): [Board!]!
  }
  type Query {
    Board(id: String): Board
    Member(username: String!): Member
  }`;

let fetchBoardsListCardsById =
  async(listId) => {
    const response = await fetch(
      `https://api.trello.com/1/lists/${listId}/cards`);
    return response.json();
  };

let fetchBoardsListsById =
  async(id) => {
    const response = await fetch(
      `https://api.trello.com/1/boards/${id}/lists`);
    const data = await response.json();
    return data.map(list => ({
      ...list,
      cards: () => fetchBoardsListCardsById(
          list.id)
    }));
  };

let fetchBoardsById = async(id) => {
  const response = await fetch(`https://api.trello.com/1/boards/${id}`);
  const data = await response.json();
  return {
    ...data,
    lists: () => fetchBoardsListsById(id)
  };
};

let fetchMemberByName =
  async(username) => {
    const response = await
      fetch(`https://api.trello.com/1/members/${username}`, {});
    if(response.status !== 200) {
      throw new Error(response.statusText);
    }
    const data = await
      response.json();

    return {
      ...data,
      username: data.username + " per REST",
      boards: () => {
        return (data.idBoards || [])
          .map(boardId =>
            fetchBoardsById(
              boardId))
      }
    };
  };

const resolvers = {
  Query: {
    Member(parent, args) {
      return fetchMemberByName(
        args.username);
    },
    Board(parent, args) {
      return fetchBoardsById(
        args.id);
    }
  }
};

// Export the GraphQL.js schema object as "schema"
export const schema =
  makeExecutableSchema({
    resolvers,
    typeDefs
  });

// Add mocking
import {addMockFunctionsToSchema} from 'graphql-tools';

const mocks = {
  String: () => casual.color_name
};
addMockFunctionsToSchema({
  schema, mocks,
  preserveResolvers: true
});
