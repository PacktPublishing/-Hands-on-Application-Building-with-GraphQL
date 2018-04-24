import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import {
  Segment,
  Loader,
  Button,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

import { FullVerticalContainer } from './FullVerticalContainer';
import { CreateBoardModal } from './CreateBoardModal';

const BoardListItem = ({ name, id, deleteBoard }) => {
  return (
    <div>
      <Link to={`/board/${id}`}>{name}</Link>
      <Button
        onClick={() => deleteBoard(id)}
        size={'mini'}
        icon="trash"
      />
    </div>
  );
};

const BoardList = ({ boards, deleteBoard }) =>
  boards.map(({ id, ...info }) => (
    <BoardListItem
      key={id}
      id={id}
      {...info}
      deleteBoard={deleteBoard}
    />
  ));

export default class Boards extends Component {
  state = { showModal: false };

  showCreateBoardDialog = () => {
    this.setState({ showModal: true });
  };

  hideCreateBoardDialog = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { showModal } = this.state;

    const createBoardMutation = gql`
      mutation createBoard($name: String!) {
        createBoard(name: $name) {
          name
          id
          boards {
            name
            id
          }
        }
      }
    `;
    const deleteBoardMutation = gql`
      mutation delBoard($id: ID!) {
        deleteBoard(id: $id) {
          id
        }
      }
    `;

    const userWithBoardsQuery = gql`
      {
        me {
          name
          id
          boards {
            name
            id
          }
        }
      }
    `;

    return (
      <FullVerticalContainer>
        <h1>List of Boards </h1>

        <Query query={userWithBoardsQuery}>
          {({ loading, error, data, refetch }) => {
            if (loading) return <Loader />;
            if (error) return false;

            return (
              <Mutation
                onCompleted={refetch}
                mutation={deleteBoardMutation}>
                {deleteBoard => (
                  <BoardList
                    boards={data.me.boards}
                    deleteBoard={id => {
                      return deleteBoard({
                        variables: { id },
                      });
                    }}
                  />
                )}
              </Mutation>
            );
          }}
        </Query>
        <Mutation mutation={createBoardMutation}>
          {(createBoard, { loading, error }) => {
            const { message } = error || {};
            return (
              <Segment basic>
                <CreateBoardModal
                  loading={loading}
                  error={message}
                  open={showModal}
                  onOpen={this.showCreateBoardDialog}
                  onHide={this.hideCreateBoardDialog}
                  createBoard={({ name }) => {
                    return createBoard({
                      variables: { name },
                    });
                  }}
                />
              </Segment>
            );
          }}
        </Mutation>
      </FullVerticalContainer>
    );
  }
}
