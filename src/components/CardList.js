import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { Card } from './Card';

export class CardList extends React.Component {
  render() {
    const { cards, name = 'unknown' } = this.props;
    return (
      <ListContainer>
        <h3
          style={{
            padding: '0 1em',
            flex: 0,
          }}>
          {name}
        </h3>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {<CardsContainer>{renderCards(cards)}</CardsContainer>}
        </div>
      </ListContainer>
    );
  }
}

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

let renderCards = (cards = []) => cards.map(c => <Card {...c} />);

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

CardList.propTypes = {
  name: PropTypes.string.isRequired,
  cards: PropTypes.array,
};

CardList.fragments = {
  list: gql`
    fragment CardList_list on List {
      name
      cards {
        name
      }
      #cards {
      #  ...Card_card
      #}
    }
  `,
};
