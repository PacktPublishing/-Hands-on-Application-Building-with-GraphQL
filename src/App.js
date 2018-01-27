/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SchemaLink } from 'apollo-link-schema';
import { createHttpLink } from 'apollo-link-http';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';

import { schema } from './schema';

import './App.css';

import { BoardContainer } from './components';
import { CardList } from './components/CardList';

const Board = ({ board }) => {
  const { name, lists = [] } = board;
  return (
    <BoardContainer boardName={name}>
      {lists.map(list => (
        <CardList key={list.id} cards={list.cards} name={list.name} />
      ))}
    </BoardContainer>
  );
};

const BoardAdapter = ({ data }) => {
  const { loading, error, board } = data;

  if (loading) {
    return <div>Loading Board</div>;
  }
  if (error) {
    return (
      <h2>
        sorry, some error... <span>{error}</span>
      </h2>
    );
  }
  if (board) {
    return <Board board={board} />;
  }

  return <div>Board does not exist.</div>;
};

const BoardQuery = gql`
  query board($boardId: ID) {
    board: Board(id: $boardId) {
      name
      lists {
        id
        ...CardList_list
      }
    }
  }
  ${CardList.fragments.list}
`;

const config = {
  options: props => ({
    variables: {
      boardId: props.boardId,
    },
  }),
};
const CoolBoard = graphql(BoardQuery, config)(BoardAdapter);

function createClient() {
  return new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.graph.cool/simple/v1/cjc10hp730o6u01143mnnalq4',
    }),
    cache: new InMemoryCache(),
  });
}

function createClientMock() {
  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={createClient()}>
          <CoolBoard boardId="cjc10rgoj721s0147ui3wzapk" />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
