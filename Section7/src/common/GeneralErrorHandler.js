import React from 'react';

import { Link } from 'react-router-dom';

import { Message } from 'semantic-ui-react';

// Error name, used on the server side, too
const NotAuthorizedError = 'NotAuthorizedError';

export const GeneralErrorHandler = ({
  NetworkStatusNotifier,
}) => (
  <NetworkStatusNotifier
    render={({ error }) => {
      if (error) {
        const { graphQLErrors, networkError } = error;
        if (graphQLErrors) {
          const notAuthErr = graphQLErrors.find(
            err => err.name === NotAuthorizedError
          );

          if (notAuthErr) {
            return (
              <Message error>
                <strong>
                  You need to be authenticated to see
                  or change items.
                </strong>
                <p>Please click
                  <Link to="/login">
                    <span> this link </span>
                  </Link> to log-in!
                </p>
              </Message>
            );
          }
          return (
            <Message error>
              {graphQLErrors
                .filter(error => error.message)
                .map(error => error.message)
                .map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
            </Message>
          );
        } else if (networkError) {
          return (
            <Message error>
              <p>
                <strong>Network Error:</strong>{' '}
                {networkError.message}
              </p>
            </Message>
          );
        } else {
          console.log('unknown error!', error);
          return (
            <Message error>
              <strong>Unknown error!</strong>
              <p>
                You could find more details in the
                browser console.
              </p>
            </Message>
          );
        }
      }
      // do not render anything, when there is no error above
      return false;
    }}
  />
);
