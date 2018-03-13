import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Form,
  Icon,
  Message,
  Modal,
} from 'semantic-ui-react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'react-apollo';

import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';

const CardDiv = styled.div`
  border-radius: 3px;
  margin: 0.1em 0 0 0;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  padding: 10px;
`;

const ShowDiffWarning = ({
  newValue,
  currentValue,
}) => (
  <Message
    warning
    size="mini"
    hidden={newValue === currentValue}>
    <b>New:</b> {newValue}
  </Message>
);

export class CardComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      name: props.name,
      description: props.description,
      showModal: false,
    };
  }

  resetForm() {
    this.setState({
      conflict: false,
      error: false,
      name: this.props.name,
      description: this.props.description,
      old_name: this.props.name,
      old_description: this.props.description,
    });
  }

  componentWillReceiveProps(newProps) {
    console.log(
      'componentWillReceiveProps()',
      newProps
    );
    if (this.state.showModal) {
      this.setState({
        conflict: { newProps },
      });
    } else {
      this.setState({
        name: newProps.name,
        description: newProps.description,
      });
    }
  }

  showAndReset = () => {
    this.setState({ showModal: true });
    this.resetForm();
  };

  saveAndHide = () => {
    const {
      id,
      storeCard = () =>
        Promise.reject({
          message: 'Sorry, not implemented yet.',
        }),
    } = this.props;

    const {
      name,
      description,
      old_name,
      old_description,
    } = this.state;

    this.setLoading();

    storeCard({
      id,
      name,
      description,
      old_name,
      old_description,
    })
      .then(({ data }) => {
        const { updateManyCards } = data;
        const { count = 0 } = updateManyCards;
        if (count == 0) {
          throw new Error(
            'No Card with old values found - may have been changed in the meantime!'
          );
        }
        this.setLoading(false);
        this.hide();
      })
      .catch(e => {
        this.setLoading(false);
        this.setState({
          error: e.message,
        });
      });
  };

  setLoading(loading = true) {
    this.setState({ loading });
  }

  hide = () => {
    this.setState({ showModal: false });
  };

  handleChange = (e, { name, value }) =>
    this.setState({ [name]: value });

  render() {
    const {
      loading = false,
      error = false,
      conflict = false,
      name,
      description,
      showModal = false,
    } = this.state;

    const whenDraggingStyle = {
      color: 'black',
      fontWeight: 'bold',
      fontStyle: 'italic',
    };
    const { isDragging } = this.props;

    return (
      <CardDiv onClick={() => this.showAndReset()}>
        <Modal open={showModal} onClose={this.hide}>
          <Modal.Header>Edit Card</Modal.Header>
          <Modal.Content>
            <Form
              onSubmit={() => this.saveAndHide()}
              error={!!error}
              loading={loading}
              warning={!!conflict}>
              <Message
                warning
                header="Warning! Card was concurrently modified on server."
              />
              <Message
                error
                header="Saving Card failed"
                content={error}
              />
              <Form.Input
                fluid
                label="Task Name"
                placeholder="Enter title"
                value={name}
                name="name"
                autoFocus
                onChange={this.handleChange}
                required
              />
              <ShowDiffWarning
                newValue={this.props.name}
                currentValue={name}
              />
              <Form.TextArea
                label="Task Description"
                placeholder="Add some more details about this task ..."
                value={description}
                name="description"
                onChange={this.handleChange}
              />
              <ShowDiffWarning
                newValue={this.props.description}
                currentValue={description}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {!!conflict && (
              <Button
                color="green"
                negative
                onClick={() => {
                  this.saveAndHide();
                }}
                inverted>
                <Icon name="save" /> Overwrite
              </Button>
            )}
            {!conflict && (
              <Button
                color="green"
                onClick={() => {
                  this.saveAndHide();
                }}
                inverted>
                <Icon name="save" /> Save
              </Button>
            )}
            <Button
              color="red"
              onClick={this.hide}
              inverted>
              <Icon name="cancel" /> Close/cancel
            </Button>
          </Modal.Actions>
        </Modal>
        <span
          style={isDragging ? whenDraggingStyle : {}}>
          {this.props.name}
        </span>
      </CardDiv>
    );
  }
}

CardComponent.propTypes = {
  id: PropTypes.string.isRequired,
  cardListId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  storeCard: PropTypes.func,
};

CardComponent.fragments = {
  card: gql`
    fragment Card_card on Card {
      id
      name
      description
    }
  `,
};

const EditCardMutation = gql`
  mutation updateCard(
    $id: ID!
    $name: String
    $description: String
    $old_name: String
    $old_description: String
  ) {
    updateManyCards(
      where: {
        AND: [ { id: $id } { name: $old_name }
          { description: $old_description } ]
      }
      data: { name: $name, description: $description }
    ) {
      count
    }
  }
`;

export const Card = compose(
  graphql(EditCardMutation, {
    props: ({ mutate }) => ({
      storeCard: ({
        id,
        name,
        description,
        old_name,
        old_description,
      }) => {
        return mutate({
          variables: {
            id,
            name,
            old_name,
            description,
            old_description,
          },
        });
      },
    }),
  })
)(CardComponent);

class CardForDragging extends Component {
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div>
        <Card {...this.props} />
      </div>
    );
  }
}

CardForDragging.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  ...CardComponent.propTypes,
};

CardForDragging.fragments = {
  ...CardComponent.fragments,
};

const cardSource = {
  // the only important info:
  beginDrag: (props, monitor, component) => ({
    id: props.id,
    cardListId: props.cardListId, // for canDrag
  }),
  // only can be dragged to a different list
  canDrag: (props, monitor) => !!props.cardListId,
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(
  ItemTypes.CARD,
  cardSource,
  collect
)(CardForDragging);
