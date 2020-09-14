// ---- HELPER FUNCIONS ----
// Helper function to create an id
function generateId() {
  return Math.random().toString(36).substring(2) +
      (new Date()).getTime().toString(36);
};

// ---- ACTION TYPES ----
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const RECEIVE_DATA = 'RECEIVE_DATA';

// ---- ACTION CREATOR FUNCTIONS ----
function addTodoAction(todo) {
  return {type: ADD_TODO, todo};
};

function removeTodoAction(id) {
  return {type: REMOVE_TODO, id};
};

function toggleTodoAction(id) {
  return {type: TOGGLE_TODO, id};
};

function addGoalAction(goal) {
  return {type: ADD_GOAL, goal};
};

function removeGoalAction(id) {
  return {type: REMOVE_GOAL, id};
};

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA, todos, goals
  }
};

// Thunk action creator handlers
// These functions make asynchronous API calls and
// are handled using redux-thunk, which is middleware that
// checks whether or not we return an object or function
// and handles it appropriately.
// For an example for a thunk function, see the middleware portion
// below.
function handleAddTodo(name) {
  return (dispatch) => {
    API.saveTodo(name)
        .then((todo) => {
          dispatch(addTodoAction(todo));
        })
        .catch(() => {
          alert('An error occurred. Try again.');
        })
  };
};


// ---- REDUCERS ----
// Reducer function for Todos
// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(
          todo =>
              (todo.id !== action.id ?
                   todo :
                   Object.assign({}, todo, {complete: !todo.complete})));
    case RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
};

// Reducer function for Goals
// Initialize state to an empty array, because the first time the
// function is called, the state is undefined.
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
};

// Reducer function for Loading Indicator
// Initialize state to true, because we're starting out
// with loading our data. Once finished loading, we return false.
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// ---- MIDDLEWARE ----
const checker = (store) => (next) => (action) => {
  if ((action.type === ADD_TODO &&
       action.todo.name.toLowerCase().includes('bitcoin')) ||
      (action.type === ADD_GOAL &&
       action.goal.name.toLowerCase().includes('bitcoin'))) {
    return alert('Nope. That\'s a bad idea.');
  }

  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Action: ', action);
  const result = next(action);
  console.log('New state: ', store.getState());
  console.groupEnd();
  return result;
};


// This function shows the idea of how a Thunk is implemented.
// Because this is such a common pattern, there is a library
// redux-thunk that implements this for us. That's what is used
// in the middleware, instead of this function.
/*
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch);
  }

  return next(action);
};
*/


// ---- STORE ----
const store = Redux.createStore(
    Redux.combineReducers({todos, goals, loading}),
    Redux.applyMiddleware(ReduxThunk.default, checker, logger));