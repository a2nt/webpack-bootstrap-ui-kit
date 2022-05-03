import { InMemoryCache } from '@apollo/client'

// import { IonicStorageModule } from '@ionic/storage';
// import { persistCache, IonicStorageWrapper } from 'apollo3-cache-persist';
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist'

const cache = new InMemoryCache()

// await before instantiating ApolloClient, else queries might run before the cache is persisted
// await persistCache({
persistCacheSync({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  key: 'web-persist',
  maxSize: 1048576, // 1Mb
  // new IonicStorageWrapper(IonicStorageModule),
})

export { cache }
