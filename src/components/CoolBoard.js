/* eslint-disable react/prop-types */
import React from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';

import {
  BoardContainer,
  AddListButton,
} from './BoardContainer';
import { CardList } from './CardList';

const Board = ({
  data,
  addList,
  addCard,
  boardId,
}) => {
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

      addCard({
        boardId,
        cardListId,
        name: 'New-Card',
      })
        .then(({ data }) => {
          console.log('got data', data);
        })
        .catch(error => {
          console.log('there was an error sending the query', error);
        });
    };

    const onBoardAddItem = () => {
      console.log(
        `triggered adding list to the board`
      );

      addList({
        boardId,
        name: 'New-List',
      })
        .then(({ data }) => {
          console.log('got data', data);
        })
        .catch(error => {
          console.log('there was an error sending the query', error);
        });
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
      id
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

let AddCardMutation = gql`
  mutation AddCardMutation($cardListId: ID!, $name: String!) {
    updateList(
      data: { cards: { create: { name: $name } } }
      where: { id: $cardListId }
    ) {
      name
      id
    }
  }
`;
let AddListMutation = gql`
  mutation($boardId: ID!, $name: String!) {
    updateBoard(
      data: { lists: { create: { name: $name } } }
      where: { id: $boardId }
    ) {
      id
    }
  }
`;

export const CoolBoard = compose(
  graphql(AddListMutation, {
    name: 'addListMutation',
    props: ({ addListMutation }) => ({
      addList: ({ name, boardId }) =>
        addListMutation({
          variables: {
            boardId,
            name,
          },
        }),
    }),
  }),
  graphql(AddCardMutation, {
    name: 'addCardMutation',
    props: ({ addCardMutation }) => ({
      addCard: ({ name, cardListId }) =>
        addCardMutation({
          variables: {
            cardListId,
            name,
          },
        }),
    }),
  }),
  graphql(BoardQuery, queryConfig)
)(Board);
