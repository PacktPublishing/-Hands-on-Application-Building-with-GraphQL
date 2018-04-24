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

class Board extends React.Component {
  render() {
    const {
      boardQuery = {},
      addListMutation,
      deleteCardList,
      addCard,
      deleteAllLists,
      moveCard,
      boardId,
    } = this.props;
    const { loading, error, board } = boardQuery;

    if (loading) {
      return <div>Loading Board</div>;
    }

    if (error) {
      return false;
    }

    if (board) {
      const { name, lists = [] } = board;

      const onMoveCardToList = (
        cardId,
        oldCardListId,
        newCardListId
      ) => {
        console.log(
          `triggered moving card with id: ${cardId} to list with id: ${oldCardListId} -> id: ${newCardListId}`
        );

        moveCard({
          variables: {
            oldCardListId,
            cardListId: newCardListId,
            cardId,
          },
        });
      };

      const onCardListAddItem = cardListId => {
        console.log(
          `triggered adding item to list with id: ${cardListId}`
        );

        addCard({
          boardId,
          cardListId,
          name: 'Card',
        });
      };
      const onDeleteCardList = cardListId => {
        deleteCardList({
          variables: {
            cardListId,
          },
        });
      };

      const onBoardAddItem = () => {
        console.log(
          `triggered adding list to the board`
        );

        addListMutation({
          variables: {
            boardId,
            name: 'Section 5',
          },
        });
      };

      return (
        <BoardContainer boardName={name}>
          <DelListButton
            action={() =>
              deleteAllLists(boardId, lists)
            }>
            Delete All
          </DelListButton>
          {lists.map(list => (
            <CardList
              key={list.id}
              name={list.name}
              id={list.id}
              moveCardToList={onMoveCardToList}
              deleteListWithId={onDeleteCardList}
              addCardWithName={onCardListAddItem}
            />
          ))}
          <AddListButton
            onAddNewList={onBoardAddItem}
          />
        </BoardContainer>
      );
    }

    return <div>Board does not exist.</div>;
  }

  componentWillMount() {
    const { boardId, boardQuery } = this.props;

    // for edit-board or  add-cardlist = board update
    boardQuery.subscribeToMore({
      document: BoardSubscription,
      variables: {
        boardId: boardId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(
          'updating board:',
          subscriptionData.data.board
        );
      },
    });

    // for add-card = list update
    boardQuery.subscribeToMore({
      document: ListsSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const { list } = subscriptionData.data;
        console.log('updating list:', list);

        /* Deleting "leaf" without any board-change-update
         * Update local cache, by updating board locally
         */
        if ('DELETED' === list.mutation) {
          const oldList = prev.board.lists;
          const lists = [];

          // filter-out specific cardList
          oldList.forEach(cardList => {
            if (cardList.id !== list.previousValues.id)
              lists.push(cardList);
          });

          const newBoard = {
            ...prev.board,
            lists,
          };

          return {
            ...prev,
            board: newBoard,
          };
        }

        return prev;
      },
    });

    // for edit-card = card update
    boardQuery.subscribeToMore({
      document: CardsSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (subscriptionData.data)
          console.log(
            'updating card:',
            subscriptionData.data.card
          );
      },
    });
  }
}

Board.fragments = {
  board: gql`
    fragment Board_board on Board {
      name
      id
      lists {
        name
        id
      }
    }
  `,
};

/*
 Workaround:
 We need to replace the fragments in subscriptions
 until this bug will be fixed
 https://github.com/graphcool/prisma/issues/2026
*/
const CardsSubscription = gql`
  subscription {
    card(where: {}) {
      mutation
      node {
        id
        name
        description
        createdAt
        updatedAt
        updatedBy {
          avatarUrl
          name
          id
        }
      }
      previousValues {
        id
        name
      }
      updatedFields
    }
  }
  # {Card.fragments.card}
`;

const ListsSubscription = gql`
  subscription {
    list(where: {}) {
      mutation
      previousValues {
        id
        name
      }
      node {
        name
        id
        cards {
          id
          name
          description
        }
      }
    }
  }
  # {CardList.fragments.list}
`;

const BoardSubscription = gql`
  subscription($boardId: ID) {
    board(where: { node: { id: $boardId } }) {
      mutation
      node {
        name
        id
        lists {
          name
          id
        }
      }
      previousValues {
        id
        name
      }
      updatedFields
    }
  }
  # {Board.fragments.board}
`;

const BoardQuery = gql`
  query board($boardId: ID) {
    board(where: { id: $boardId }) {
      ...Board_board
    }
  }
  ${Board.fragments.board}
`;

const boardQueryConfig = {
  options: ({ boardId }) => ({
    variables: {
      boardId,
    },
  }),
  name: 'boardQuery',
};

let addCard = graphql(
  gql`
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
  `,
  {
    name: 'addCardMutation',
    props: ({ addCardMutation }) => ({
      addCard: ({ name, cardListId }) => {
        return addCardMutation({
          variables: {
            cardListId,
            name,
          },
        });
      },
    }),
  }
);

let moveCard = graphql(
  gql`
    mutation moveCard(
      $cardId: ID!
      $oldCardListId: ID!
      $cardListId: ID!
    ) {
      newList: updateList(
        data: { cards: { connect: { id: $cardId } } }
        where: { id: $cardListId }
      ) {
        ...CardList_list
      }
      oldList: updateList(
        data: {
          cards: { disconnect: { id: $cardId } }
        }
        where: { id: $oldCardListId }
      ) {
        ...CardList_list
      }
    }
    ${CardList.fragments.list}
  `,
  {
    name: 'moveCard',
  }
);

const addListMutation = graphql(
  gql`
    mutation($boardId: ID!, $name: String!) {
      updateBoard(
        data: { lists: { create: { name: $name } } }
        where: { id: $boardId }
      ) {
        ...Board_board
      }
    }
    ${Board.fragments.board}
  `,
  {
    name: 'addListMutation',
  }
);

let deleteAllLists = graphql(
  gql`
    mutation deletelistsOfBoard(
      $boardId: ID!
      $listIds: [ListWhereUniqueInput!]!
    ) {
      updateBoard(
        data: { lists: { delete: $listIds } }
        where: { id: $boardId }
      ) {
        id
      }
    }
  `,
  {
    name: 'deleteManyLists',
    props: ({ deleteManyLists }) => ({
      deleteAllLists: (boardId, listIds) => {
        deleteManyLists({
          variables: {
            boardId: boardId,
            listIds:
              listIds.map(li => ({ id: li.id })) || [],
          },
        });
      },
    }),
  }
);

let deleteCardList = graphql(
  gql`
    mutation deletelist($cardListId: ID!) {
      # minimum data transfer:
      deleteList(where: { id: $cardListId }) {
        id
      }
    }
  `,
  {
    name: 'deleteCardList',
  }
);

export const CoolBoard = compose(
  deleteAllLists,
  addListMutation,
  deleteCardList,
  addCard,
  moveCard,
  graphql(BoardQuery, boardQueryConfig)
)(Board);
