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

// ---- App Code ----
// This is code a user would implement to define changes to the
// state based on actions.

// Reducer function for Todos
// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.todo]);
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    case 'TOGGLE_TODO':
      return state.map(
          todo =>
              (todo.id !== action.id ?
                   todo :
                   Object.assign({}, todo, {complete: !todo.complete})));
    default:
      return state;
  }
};

// Reducer function for Goals
// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function goals(state = [], action) {
  switch (action.type) {
    case 'ADD_GOAL':
      return state.concat([action.goal]);
    case 'REMOVE_GOAL':
      return state.filter(goal => goal.id !== action.id);
    default:
      return state;
  }
};

// Root reducer for the entire App
// Initialize state to an empty object, because the first time the
// function is called, the state is undefined.
function app(state = {}, action) {
  return {todos: todos(state.todos, action), goals: goals(state.goals, action)};
};

// Use the store
const store = createStore(app);

const unsubscribe = store.subscribe(() => {
  console.log('The state changed to: ', store.getState());
})

// Add todos
store.dispatch(
    {type: 'ADD_TODO', todo: {id: 0, name: 'Learn Redux', complete: false}})
store.dispatch(
    {type: 'ADD_TODO', todo: {id: 1, name: 'Read Book', complete: true}})
store.dispatch(
    {type: 'ADD_TODO', todo: {id: 2, name: 'Learn C++', complete: false}})

// Add goals
store.dispatch(
    {type: 'ADD_GOAL', goal: {id: 0, name: 'Finish React Nanodegree'}})
store.dispatch({type: 'ADD_GOAL', goal: {id: 1, name: 'Finish C++ Nanodegree'}})
store.dispatch({type: 'ADD_GOAL', goal: {id: 2, name: 'Heal injury'}})

// Remove a todo
store.dispatch({type: 'REMOVE_TODO', id: 0})

// Toggle a todo
store.dispatch({type: 'TOGGLE_TODO', id: 1})

// Remove a goal
store.dispatch({type: 'REMOVE_GOAL', id: 0})