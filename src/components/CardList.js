import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  Button,
  Header,
  Icon,
} from 'semantic-ui-react';

import { Card } from './Card';

export class CardList extends React.Component {
  render() {
    const {
      cards,
      name,
      id,
      addCardWithName = () => {},
    } = this.props;

    return (
      <ListContainer>
        <CardListHeader name={name} />

        <InnerScrollContainer>
          <CardsContainer>
            {cards.map(c => (
              <Card key={c.id} {...c} />
            ))}
          </CardsContainer>
        </InnerScrollContainer>

        <AddCardButton
          onAddCard={() => addCardWithName(id)}
        />
      </ListContainer>
    );
  }
}

const CardListHeader = ({ name }) => (
  <Header
    textAlign="center"
    style={{
      padding: '0.4em 1em',
      flex: 0,
      marginBottom: 0, // reduce semantic-ui's bottom border
    }}>
    {name}
  </Header>
);

const InnerScrollContainer = ({ children }) => {
  return (
    <div
      style={{
        flexShrink: 1,
        flexGrow: 0,
        overflow: 'auto',
      }}>
      {children}
    </div>
  );
};

const CardsContainer = ({ children }) => (
  <div
    style={{
      border: '1em',
      display: 'flex',
      flexDirection: 'column',
    }}>
    {children}
  </div>
);

const ListContainer = ({ children }) => (
  <div
    style={{
      backgroundColor: 'lightgrey',
      padding: '0.4em',
      width: '20em',
      color: 'black',
      marginRight: '1em',
      flexShrink: 0,
      flexGrow: 0,
      flexDirection: 'column',
      display: 'flex',
    }}>
    {children}
  </div>
);

const AddCardButton = ({ onAddCard }) => (
  <Button
    compact
    onClick={() => onAddCard()}
    style={{
      margin: '0.1em 0 0 0',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#grey',
    }}>
    <Icon name="plus" />
    Add a card
  </Button>
);

CardList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  addCardWithName: PropTypes.func,
  cards: PropTypes.array,
};

CardList.fragments = {
  list: gql`
    fragment CardList_list on List {
      name
      id
      cards {
        id
        ...Card_card
      }
    }
    ${Card.fragments.card}
  `,
};
