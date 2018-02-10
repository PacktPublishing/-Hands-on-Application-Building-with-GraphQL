/* eslint-disable react/prop-types */
import React from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';

import {
  BoardContainer,
  AddListButton,
  DelListButton,
} from './BoardContainer';
import { CardList } from './CardList';

const Board = ({
  data,
  addListMutation,
  addCard,
  deleteAllLists,
  boardId,
}) => {
  const { loading, error, board } = data;

  if (loading) {
    return <div>Loading Board</div>;
  }
  if (error) {
    return (
      <h2>
        Sorry, some error:
        <span>{error.message}</span>
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
          console.log(
            'there was an error sending the query',
            error
          );
        });
    };

    const onBoardAddItem = () => {
      console.log(
        `triggered adding list to the board`
      );

      addListMutation({
        // refetchQueries: [{ query: BoardQuery, variables: { boardId } }],
        variables: {
          boardId,
          name: 'Section 4',
        },
      })
        .then(({ data }) => {
          console.log('got data', data);
        })
        .catch(error => {
          console.log(
            'there was an error sending the query',
            error
          );
        });
    };

    return (
      <BoardContainer boardName={name}>
        <DelListButton action={deleteAllLists}>
          Delete All
        </DelListButton>
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
  mutation AddCardMutation(
    $cardListId: ID!
    $name: String!
  ) {
    updateList(
      data: { cards: { create: { name: $name } } }
      where: { id: $cardListId }
    ) {
      ...CardList_list
    }
  }
  ${CardList.fragments.list}
`;

let optimisticResponse = {
  __typename: 'Mutation',
  updateList: {
    id: 'update-with-real-id',
    name: 'optimistic',
    cards: [
      {
        id: 'cjd7corei01980176im02xvpf',
        name: 'optimistic',
        __typename: 'Card',
      },
      {
        id: 'cjd7ct108019i0176jbd4dznp',
        name: 'optimistic',
        __typename: 'Card',
      },
      {
        id: 'cjd7ct108019i0176jbd4dzn1',
        name: 'optimistic',
        __typename: 'Card',
      },
      {
        id: 'cjd7ct108019i0176jbd4dzn2',
        name: 'optimistic',
        __typename: 'Card',
      },
      {
        id: 'cjd7ct108019i0176jbd4dzn3',
        name: 'optimistic',
        __typename: 'Card',
      },
    ],
    __typename: 'List',
  },
};

let addCard = graphql(AddCardMutation, {
  name: 'addCardMutation',
  props: ({ addCardMutation }) => ({
    addCard: ({ name, cardListId }) => {
      optimisticResponse.updateList.id = cardListId;
      return addCardMutation({
        optimisticResponse: optimisticResponse,
        variables: {
          cardListId,
          name,
        },
      });
    },
  }),
});

let AddListMutation = gql`
  mutation AddListMutation(
    $boardId: ID!
    $name: String!
  ) {
    updateBoard(
      data: { lists: { create: { name: $name } } }
      where: { id: $boardId }
    ) {
      # used as a result in the mutation-action promise ...
      id
      name
      lists {
        ...CardList_list
      }
    }
  }
  ${CardList.fragments.list}
`;

export const CoolBoard = compose(
  deleteAllLists,
  graphql(AddListMutation, {
    name: 'addListMutation',
  }),
  addCard,
  graphql(BoardQuery, queryConfig)
)(Board);

let deleteAllLists = graphql(
  gql`
    mutation {
      deleteManyLists(where: {}) {
        count
      }
    }
  `,
  {
    name: 'deleteManyLists',
    props: ({
              deleteManyLists,
              ownProps: { boardId },
            }) => ({
      deleteAllLists: () => {
        deleteManyLists({
          update: (cache, obj) => {
            /* const { data: { deleteManyLists: { count } }, } = obj; */
            const data = cache.readQuery({
              query: BoardQuery,
              variables: {
                boardId: boardId,
              },
            });
            data.board.lists = [];
            cache.writeQuery({
              query: BoardQuery,
              variables: {
                boardId: boardId,
              },
              data,
            });
          },
          XrefetchQueries: [
            {
              query: BoardQuery,
              variables: {
                boardId,
              },
            },
          ],
        });
      },
      name: 'deleteManyLists',
    }),
  }
);
