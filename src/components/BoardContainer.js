/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';

export const BoardContainer = ({
  boardName,
  children,
}) => (
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

AddListButton.propTypes = {
  onAddNewList: PropTypes.func,
};
