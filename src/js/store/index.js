import configure from './configure'
const store = configure()

/* import {
    PageControls
} from './components' */

// const pageControls = new PageControls(store)

store.subscribe(() => console.log(store.getState()))
store.dispatch({
  type: 'counter/incremented',
})
store.dispatch({
  type: 'counter/incremented',
})
store.dispatch({
  type: 'counter/decremented',
})
