/* eslint-disable react/prop-types,react/jsx-key */
import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SchemaLink } from 'apollo-link-schema';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';

import { schema } from './schema';

import './App.css';

import { BoardContainer } from './components';
import { CardList } from './components/CardList';
// import { Card } from './components/Card';

const Board = ({ board }) => {
  const { name, lists = [] } = board;
  return (
    <BoardContainer boardName={name}>
      {lists.map(list => <CardList cards={list.cards} name={list.name}/>)}
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
  query {
    board: Board(id: "cjc10rgoj721s0147ui3wzapk") {
      name
      lists {
        name
        cards {
          name
          id
        }
      }
    }
  }
`;
/*
...CardList_list
${CardList.fragments.list}
*/

const CoolBoard = graphql(BoardQuery)(BoardAdapter);

function createClient() {
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
          <CoolBoard />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
