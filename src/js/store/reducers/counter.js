export default function counter (
  state = {
    value: 0,
  },
  action
) {
  switch (action.type) {
    case 'counter/incremented':
      return {
        value: state.value + 1,
      }
    case 'counter/decremented':
      return {
        value: state.value - 1,
      }
    default:
      return state
  }
}
