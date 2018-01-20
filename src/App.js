/* eslint-disable react/prop-types,react/jsx-key */
import React, { Component } from 'react';
import './App.css';

import { BoardContainer, List } from './components';

import boardData from './dummyData';

const renderLists = (lists = []) => {
  return lists.map(list => (
    <List
      name={list.name}
      cards={list.cards}
      key={list.id || list.name}
    />
  ));
};

class Board extends Component {
  render() {
    const { data = {} } = this.props;
    const { name, lists } = data;
    return (
      <BoardContainer boardName={name}>
        {renderLists(lists)}
      </BoardContainer>
    );
  }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <Board data={boardData} />
      </div>
    );
  }
}

export default App;
