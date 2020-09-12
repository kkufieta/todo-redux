// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([action.todo]);
  }

  return state;
}
// A function that mimics the Redux store behavior.
// Implemented to
function createStore() {
  // The store should have 4 parts:
  // 1. The state
  // 2. Get the state
  // 3. Listen to changes on the state.
  // 4. Update the state
  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  };

  const dispatch = (action) => {
    state = todos(state, action);
    listeners.forEach(listener => listener());
  };

  return {getState, subscribe, dispatch};
}

const store = createStore();

const unsubscribe = store.subscribe(() => {
  console.log('The state changed to: ', state);
})

const unsubscribe = store.subscribe(() => {console.log('The store changed.')})
