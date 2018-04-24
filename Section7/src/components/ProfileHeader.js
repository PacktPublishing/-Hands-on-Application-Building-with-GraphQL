import React from 'react';

import { graphql } from 'react-apollo/index';
import gql from 'graphql-tag';
import {
  Container,
  Icon,
  Image,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const ProfileHeaderContainer = ({ children }) => (
  <Container
    fluid
    textAlign="right"
    style={{
      color: 'white',
      padding: '1em',
      background: 'lightgrey',
    }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <div style={{ flexGrow: 1, textAlign: 'start' }}>
        <Link to="/">
          <span>Home</span>
        </Link>
      </div>

      {children}
    </div>
  </Container>
);

const ProfileHeaderComponent = ({ data }) => {
  const { loading, error, me = {} } = data;

  if (loading) {
    return (
      <ProfileHeaderContainer>
      </ProfileHeaderContainer>
    );
  }

  if (error) {
    return (
      <ProfileHeaderContainer>
        <Link to="/login">Log in</Link>
      </ProfileHeaderContainer>
    );
  }

  let { avatarUrl, name } = me;

  return (
    <ProfileHeaderContainer>
      <span>{name} </span>
      {avatarUrl && (
        <Image
          src={avatarUrl}
          avatar
          style={{ margin: '0 4px' }}
        />
      )}

      <Link to="/logout">
        <Icon name="log out" />Logout
      </Link>
    </ProfileHeaderContainer>
  );
};

export const ProfileHeader = graphql(
  gql`
    query Profile {
      me {
        email
        id
        name
        avatarUrl
      }
    }
  `,
  { options: { fetchPolicy: 'network-only' } }
)(ProfileHeaderComponent);
