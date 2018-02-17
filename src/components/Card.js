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
      name: this.props.name,
      description: this.props.description,
    });
  }

  componentWillReceiveProps(newProps, a, b) {
    console.log('componentWillReceiveProps()', newProps,a,b);
    if( !this.state.showModal) {
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

    const { name, description } = this.state;

    this.setLoading();

    storeCard({
      id,
      name,
      description,
    })
      .then(() => {
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
              loading={loading}>
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
              <Form.TextArea
                label="Task Description"
                placeholder="Add some more details about this task ..."
                value={description}
                name="description"
                onChange={this.handleChange}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              onClick={() => {
                this.saveAndHide();
              }}
              inverted>
              <Icon name="save" /> Save
            </Button>
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
          {name}
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
  ) {
    updateCard(
      data: { name: $name, description: $description }
      where: { id: $id }
    ) {
      ...Card_card
    }
  }
  ${CardComponent.fragments.card}
`;

export const Card = compose(
  graphql(EditCardMutation, {
    props: ({ mutate }) => ({
      storeCard: ({ id, name, description }) => {
        return mutate({
          variables: {
            id,
            name,
            description,
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
