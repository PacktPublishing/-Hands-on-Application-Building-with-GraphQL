import React, { Component } from 'react';

import {
  Button,
  Form,
  Icon,
  Container,
  Message,
  Segment,
} from 'semantic-ui-react';

import { Link } from 'react-router-dom';

class AuthForm extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
  };

  onSubmit = async event => {
    if (event) {
      event.preventDefault();
    }
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(this.state);
    }
  };

  render() {
    const { errors = [], signUp = false } = this.props;
    const {
      email,
      name,
      password,
      avatarUrl,
    } = this.state;

    return (
      <Container textAlign="left" text>
        <Form error={!!errors.length}>
          <Form.Input
            fluid
            autoComplete="email"
            placeholder="your email adress"
            icon="user"
            onChange={e =>
              this.setState({ email: e.target.value })
            }
            label="Email"
            value={email}
            name="email"
            autoFocus
            required
          />
          {signUp && (
            <Form.Input
              fluid
              autoComplete="name"
              placeholder="Your login id or short name"
              icon="user"
              onChange={e =>
                this.setState({
                  name: e.target.value,
                })
              }
              label="Login id or Short name"
              value={name}
              name="name"
            />
          )}

          <Form.Input
            label="Password"
            placeholder="choose a password"
            icon="lock"
            value={password}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            onChange={e =>
              this.setState({
                password: e.target.value,
              })
            }
          />
          {signUp && (
            <Form.Input
              label="AvatarUrl"
              icon="image"
              autoComplete="url"
              aria-label="AvatarUrl"
              placeholder="Optional: An URL of an icon representing your avatar"
              value={avatarUrl}
              name="avatarUrl"
              type="url"
              onChange={e =>
                this.setState({
                  avatarUrl: e.target.value,
                })
              }
            />
          )}
          <Message
            error
            header="Please check these errors:"
            list={errors}
          />
          <div>
            <Button
              onClick={this.onSubmit}
              positive
              color="green"
              size="big">
              <Icon name="sign in" />
              {signUp ? 'Sign Up' : 'Log in'}
            </Button>
          </div>
        </Form>

        {!signUp && (
          <Segment padded textAlign="center">
            <Link to="/signup">
              Sign up here, if you do not have already
              an account
            </Link>
          </Segment>
        )}
      </Container>
    );
  }
}

export default AuthForm;
