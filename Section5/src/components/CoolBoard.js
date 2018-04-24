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
import Card from './Card';

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
      if (error.graphQLErrors[0]) {
        return (
          <div>
            <h2>GraphQL server error:</h2>
            <p>
              <strong>Details: </strong>
              {error.graphQLErrors[0].message}
            </p>
          </div>
        );
      }

      return <h2>{`Sorry, ${error.message}`}</h2>;
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

      const onCardListAddItem = cardListId => {
        console.log(
          `triggered adding item to list with id: ${cardListId}`
        );

        addCard({
          boardId,
          cardListId,
          name: 'Card',
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
      const onDeleteCardList = cardListId => {
        deleteCardList({
          variables: {
            cardListId,
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

      const onBoardAddItem = () => {
        console.log(
          `triggered adding list to the board`
        );

        addListMutation({
          variables: {
            boardId,
            name: 'Section 5',
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
          <DelListButton
            action={() =>
              deleteAllLists(boardId, lists)
            }>
            Delete All
          </DelListButton>
          {lists.map(list => (
            <CardList
              key={list.id}
              cards={list.cards}
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
          'update:',
          subscriptionData.data.board
        );
      },
    });

    // for add-card = list update
    boardQuery.subscribeToMore({
      document: ListsSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(
          'update:',
          subscriptionData.data.list
        );
        if (!subscriptionData.data) {
          return prev;
        }
        const { list } = subscriptionData.data;

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
        console.log(
          'update:',
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
        ...CardList_list
      }
    }
    ${CardList.fragments.list}
  `,
};

const CardsSubscription = gql`
  subscription {
    card(where: {}) {
      mutation
      node {
        ...Card_card
      }
      previousValues {
        id
        name
      }
      updatedFields
    }
  }
  ${Card.fragments.card}
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
        ...CardList_list
      }
    }
  }
  ${CardList.fragments.list}
`;

const BoardSubscription = gql`
  subscription($boardId: ID) {
    board(where: { node: { id: $boardId } }) {
      mutation
      node {
        ...Board_board
      }
      previousValues {
        id
        name
      }
      updatedFields
    }
  }
  ${Board.fragments.board}
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
        # used as a result in the mutation-action promise ...
        id #...Board_board
      }
    }
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
        id #...Board_board
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
