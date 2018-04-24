import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  Button,
  Header,
  Icon,
  Popup,
} from 'semantic-ui-react';

import Card from './Card';
import { ItemTypes } from './Constants';

class CardListWithoutDnd extends React.Component {
  render() {
    const {
      connectDropTarget,
      isOver,
      cards,
      name,
      id,
      addCardWithName = () => {},
      deleteListWithId = () => {},
    } = this.props;

    return (
      <div>
        {connectDropTarget(
          <div>
            <ListContainer
              style={{
                backgroundColor: isOver
                  ? 'yellow'
                  : 'lightgrey',
              }}>
              <CardListHeader name={name}>
                <CardListButton onButtonClick={() => deleteListWithId(id)}>
                  <Icon name="trash" />
                </CardListButton>
              </CardListHeader>

              <InnerScrollContainer>
                <CardsContainer>
                  {cards.map(c => (
                    <Card
                      key={c.id}
                      {...c}
                      cardListId={id}
                    />
                  ))}
                </CardsContainer>
              </InnerScrollContainer>
              <CardListButton onButtonClick={() => addCardWithName(id)}>
                <Icon name="plus" />
                Add a card
              </CardListButton>
            </ListContainer>
          </div>
        )}
      </div>
    );
  }
}

const dropTarget = {
  drop(props, monitor, component) {
    console.log(
      'dropped: ',
      props,
      monitor,
      component
    );
    let cardItem = monitor.getItem();
    const cardId = cardItem.id;
    const cardListId = props.id;
    const oldCardListId = cardItem.cardListId;
    props.moveCardToList(
      cardId,
      oldCardListId,
      cardListId
    );
  },
  hover(props, monitor) {},
  canDrop(props, monitor) {
    let item = monitor.getItem();
    let can = !(props.id === item.cardListId);
    return can;
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
});

export const CardList = DropTarget(
  ItemTypes.CARD,
  dropTarget,
  collect
)(CardListWithoutDnd);

const CardListHeader = ({ name, children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0.4em 0',
    }}>
    <Header
      textAlign="center"
      style={{
        flexGrow: 1,
        marginBottom: 0, // reduce semantic-ui's bottom border
      }}>
      {name}
    </Header>
    <Popup
      trigger={
        <Button
          style={{ flexGrow: 0 }}
          icon="ellipsis vertical"
          size="mini"
        />
      }
      on="click"
      basic>
      {children}
    </Popup>
  </div>
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

const ListContainer = ({ children, style }) => (
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
      ...style,
    }}>
    {children}
  </div>
);

const CardListButton = ({ onButtonClick, children }) => (
  <Button
    compact
    onClick={() => onButtonClick()}
    style={{
      margin: '0.1em 0 0 0',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#grey',
    }}>
    {children}
  </Button>
);

CardList.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  addCardWithName: PropTypes.func,
  deleteListWithId: PropTypes.func,
  moveCardToList: PropTypes.func,
  cards: PropTypes.array,
};

CardList.fragments = {
  list: gql`
    fragment CardList_list on List {
      name
      id
      cards {
        ...Card_card
      }
    }
    ${Card.fragments.card}
  `,
};
