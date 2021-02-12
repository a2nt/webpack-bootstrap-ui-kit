import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client';

//import { IonicStorageModule } from '@ionic/storage';
//import { persistCache, IonicStorageWrapper } from 'apollo3-cache-persist';
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache();

// await before instantiating ApolloClient, else queries might run before the cache is persisted
//await persistCache({
persistCacheSync({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  key: 'web-persist',
  maxSize: 1048576, // 1Mb
  //new IonicStorageWrapper(IonicStorageModule),
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      apikey: `${GRAPHQL_API_KEY}`,
    },
  });

  return forward(operation);
});

const link = new HttpLink({
  uri: 'http://127.0.0.1/graphql',

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
  credentials: 'same-origin', //'include',
});

// Isolate Apollo client so it could be reused
// in both application runtime and tests.
export const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, link),
});
