// ---- Library Code (State Management Library) ----
// This is code that you'd download from NPM.

// A function that mimics the Redux store behavior.
// Implemented to
function createStore(reducer) {
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
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  return {getState, subscribe, dispatch};
}

const store = createStore(todos);

const unsubscribe = store.subscribe(() => {
  console.log('The state changed to: ', state);
})

const unsubscribe = store.subscribe(() => {console.log('The store changed.')})


// ---- App Code ----
// This is code a user would implement to define changes to the
// state based on actions.

// Reducer function
// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([action.todo]);
  }

  return state;
}