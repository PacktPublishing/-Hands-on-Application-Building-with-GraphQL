import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';

export const CardComponent = styled.div`
  border-radius: 3px;
  margin: 0.1em 0 0 0;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  padding: 10px;
`;

export const Card = ({ name }) => (
  <CardComponent>{name}</CardComponent>
);

Card.propTypes = {
  name: PropTypes.string.isRequired,
};

Card.fragments = {
  card: gql`
    fragment Card_card on Card {
      name
    }
  `,
};
