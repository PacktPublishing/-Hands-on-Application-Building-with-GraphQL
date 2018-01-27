/* eslint-disable react/prop-types */
import React from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import {
  BoardContainer,
  AddListButton,
} from './BoardContainer';
import { CardList } from './CardList';

const Board = ({ data }) => {
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
    const { name, lists = [] } = board;
    const onCardListAddItem = cardListId => {
      console.log(
        `triggered adding item to list with id: ${cardListId}`
      );
    };

    const onBoardAddItem = () => {
      console.log(
        `triggered adding list to the board`
      );
    };

    return (
      <BoardContainer boardName={name}>
        {lists.map(list => (
          <CardList
            key={list.id}
            cards={list.cards}
            name={list.name}
            id={list.id}
            addCardWithName={onCardListAddItem}
          />
        ))}
        <AddListButton onAddNewList={onBoardAddItem} />
      </BoardContainer>
    );
  }

  return <div>Board does not exist.</div>;
};

const BoardQuery = gql`
  query board($boardId: ID) {
    board(where: { id: $boardId }) {
      name
      lists {
        id
        ...CardList_list
      }
    }
  }
  ${CardList.fragments.list}
`;

const queryConfig = {
  options: props => ({
    variables: {
      boardId: props.boardId,
    },
  }),
};

export const CoolBoard = graphql(
  BoardQuery,
  queryConfig
)(Board);
