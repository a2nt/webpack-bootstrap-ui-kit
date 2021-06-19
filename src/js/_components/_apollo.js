import Events from '../_events';

import {
  cache,
} from './_apollo.cache';
import {
  from,
  ApolloClient,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';

import {
  onError,
} from '@apollo/client/link/error';
const NAME = '_appolo';

const API_META = document.querySelector('meta[name="api_url"]');
const API_URL = API_META ?
  API_META.getAttribute('content') :
  `${window.location.protocol  }//${  window.location.host  }/graphql`;

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      apikey: `${GRAPHQL_API_KEY}`,
    },
  });

  return forward(operation);
});

console.info(`%cAPI: ${API_URL}`, 'color:green;font-size:10px');

const link = from([
  authMiddleware,
  new ApolloLink((operation, forward) => {
    operation.setContext({
      start: new Date(),
    });
    return forward(operation);
  }),
  onError(({
    operation,
    response,
    graphQLErrors,
    networkError,
    forward,
  }) => {
    if (operation.operationName === 'IgnoreErrorsQuery') {
      console.error(`${NAME}: IgnoreErrorsQuery`);
      response.errors = null;
      return;
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({
        message,
        locations,
        path,
      }) =>
        console.error(
          `${NAME}: [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }

    if (networkError) {
      /*let msg = '';
                  switch (networkError.statusCode) {
                    case 404:
                      msg = 'Not Found.';
                      break;
                    case 500:
                      msg = 'Server issue, please try again latter.';
                      break;
                    default:
                      msg = 'Something went wrong.';
                      break;
                  }*/
      console.error(`${NAME}: [Network error] ${networkError.statusCode}`);
    }

    console.error(`${NAME}: [APOLLO_ERROR]`);
    window.dispatchEvent(new Event(Events.APOLLO_ERROR));
  }),
  new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      // data from a previous link
      const time = new Date() - operation.getContext().start;
      console.log(
        `${NAME}: operation ${operation.operationName} took ${time} ms to complete`,
      );

      window.dispatchEvent(new Event(Events.ONLINE));
      return data;
    });
  }),
  new HttpLink({
    uri: API_URL,

    // Use explicit `window.fetch` so tha outgoing requests
    // are captured and deferred until the Service Worker is ready.
    fetch: (...args) => fetch(...args),
    credentials: 'same-origin', //'include',
    connectToDevTools: process.env.NODE_ENV === 'development' ? true : false,
  }),
]);

// Isolate Apollo client so it could be reused
// in both application runtime and tests.

const client = new ApolloClient({
  cache,
  link,
});

export {
  client,
};
