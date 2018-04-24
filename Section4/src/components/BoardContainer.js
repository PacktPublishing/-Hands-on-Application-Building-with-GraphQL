/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class BoardContainerInner extends React.Component {
  render() {
    const { boardName, children } = this.props;

    return (
    <Container
      fluid
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
      <Header textAlign="center" as="h1">
        Board: {boardName}
      </Header>
      <div
        style={{
          textAlign: 'left',
          backgroundColor: 'blue',
          padding: '1em',
          display: 'flex',
          flex: 1,
          overflow: 'auto',
        }}>
        {children}
      </div>
    </Container>
    );
  }
}

export const BoardContainer = DragDropContext(
  HTML5Backend
)(BoardContainerInner);

BoardContainer.propTypes = {
  boardName: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export const AddListButton = ({ onAddNewList }) => (
  <Button
    onClick={onAddNewList}
    style={{
      flexShrink: 0,
      flexGrow: 0,
      alignSelf: 'flex-start',
    }}>
    <Icon name="plus" />
    Add a list
  </Button>
);
export const DelListButton = ({ action, children }) => (
  <Button
    onClick={() => action()}
    style={{
      flexShrink: 0,
      flexGrow: 0,
      alignSelf: 'flex-start',
    }}>
    <Icon name="delete" />
    {children && children}
    {!children && 'Delete'}
  </Button>
);

DelListButton.propTypes = {
  onAddNewList: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};
AddListButton.propTypes = {
  onAddNewList: PropTypes.func,
};
