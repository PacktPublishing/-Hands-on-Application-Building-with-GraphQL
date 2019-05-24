/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createHttpLink } from 'apollo-link-http';

import { ApolloProvider } from 'react-apollo';

import './App.css';

import { CoolBoard } from './components/CoolBoard';

function createClient() {
  return new ApolloClient({
    link: createHttpLink({
      uri: 'http://localhost:4466',
    }),
    cache: new InMemoryCache(),
  });
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={createClient()}>
          <CoolBoard boardId="cjd90t1gw0019018143trudyk" />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
