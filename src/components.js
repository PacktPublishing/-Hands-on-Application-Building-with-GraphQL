/* eslint-disable react/prop-types,react/jsx-key */
import React from 'react';
import styled from 'styled-components';

const ListContainer = ({ children }) => (
  <div
    style={{
      backgroundColor: 'lightgrey',
      width: '20em',
      color: 'black',
      marginRight: '1em',
      flex: '0 0 270px',
      flexDirection: 'column',
      display: 'flex',
    }}>
    {children}
  </div>
);
const CardsContainer = ({ children }) => (
  <div
    style={{
      padding: '0.4em',
      border: '1em',
      display: 'flex',
      flexDirection: 'column',
    }}>
    {children}
  </div>
);

export const Card = ({ children = 'CARD' }) => {
  let CardDiv = styled.div`
    border-radius: 3px;
    margin: 8px 0 0 0;
    background-color: #fff;
    padding: 0.4em;
    flex: 1;
  `;
  return <CardDiv>{children}</CardDiv>;
};

export const List = ({
  cards = [],
  name = 'LIST',
  children,
}) => (
  <ListContainer>
    <h3
      style={{
        padding: '0 1em',
        flex: 0,
      }}>
      {name}
    </h3>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CardsContainer>
        {cards.map(({ name }) => <Card>{name}</Card>)}
        {children}
      </CardsContainer>
    </div>
  </ListContainer>
);

export const BoardContainer = ({
  boardName = 'BOARD TITLE',
  children,
}) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
    <h3>{boardName}</h3>
    <div
      style={{
        textAlign: 'left',
        backgroundColor: 'blue',
        padding: '1em',
        display: 'flex',
        flex: '1 1 100%',
        overflow: 'auto',
      }}>
      {children}
    </div>
  </div>
);
