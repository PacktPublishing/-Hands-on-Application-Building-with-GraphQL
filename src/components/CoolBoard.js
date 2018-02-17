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
      addCard,
      deleteAllLists,
      moveCard = () => {},
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
              moveCardToList={onMoveCardToList}
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

  componentWillMount(nextProps, other) {
    const { boardId, boardQuery } = this.props;

    subscribeToBoardUpdates(
      { boardId: boardId },
      this.props
    );
  }
}

const subscribeToBoardUpdates = (params, props) => {
  props.boardQuery.subscribeToMore({
    document: BoardSubscription,
    variables: {
      boardId: params.boardId,
    },
  });
};

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

const BoardSubscription = gql`
  subscription boardChanges($boardId: ID) {
    board(where: { node: {id: $boardId} }) {
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

const queryConfig = {
  options: props => ({
    variables: {
      boardId: props.boardId,
    },
  }),
  name: 'boardQuery',
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

let addCard = graphql(AddCardMutation, {
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
      ...Board_board
    }
  }
  ${Board.fragments.board}
`;
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
        });
      },
      name: 'deleteManyLists',
    }),
  }
);

export const CoolBoard = compose(
  deleteAllLists,
  graphql(AddListMutation, {
    name: 'addListMutation',
  }),
  addCard,
  moveCard,
  graphql(BoardQuery, queryConfig)
)(Board);
