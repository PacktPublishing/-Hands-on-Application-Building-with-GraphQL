import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import AuthForm from './AuthForm';

class LoginForm extends Component {
  state = { errors: [] };

  onSubmit(formData) {
    const { mutate, successfulLogin } = this.props;

    try {
      mutate({
        variables: formData,
      })
        .then(({ data }) => {
          const { login: { token } } = data;

          successfulLogin(token);
        })

        .catch(res => {
          const errors = res.graphQLErrors.map(
            error => error.message
          );

          this.setState({ errors });
        });
    } catch (ex) {
      const errors = [
        `Login unsuccessful! Details: ${ex.message}`,
      ];

      this.setState({ errors });
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <AuthForm
          onSubmit={formData =>
            this.onSubmit(formData)
          }
          errors={this.state.errors}
        />
      </div>
    );
  }
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      token
      user {
        email
        name
        avatarUrl
      }
    }
  }
`;

export default graphql(LOGIN_MUTATION)(LoginForm);
