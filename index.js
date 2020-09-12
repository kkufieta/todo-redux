// ---- Library Code (State Management Library) ----
// This is code that you'd download from NPM.


// Helper function to create an id
function generateId() {
  return Math.random().toString(36).substring(2) +
      (new Date()).getTime().toString(36);
}

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

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// Action creator functions
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
  const {todos, goals} = store.getState();

  document.getElementById('todos').innerHTML = '';
  document.getElementById('goals').innerHTML = '';

  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
})

/*
// Add todos
store.dispatch(addTodoAction({id: 0, name: 'Learn Redux', complete: false}));
store.dispatch(addTodoAction({id: 1, name: 'Read Book', complete: true}));
store.dispatch(addTodoAction({id: 2, name: 'Learn C++', complete: false}));

// Add goals
store.dispatch(addGoalAction({id: 0, name: 'Finish React Nanodegree'}));
store.dispatch(addGoalAction({id: 1, name: 'Finish C++ Nanodegree'}));
store.dispatch(addGoalAction({id: 2, name: 'Heal injury'}));

// Remove a todo
store.dispatch(removeTodoAction(0))

// Toggle a todo
store.dispatch(toggleTodoAction(1))

// Remove a goal
store.dispatch(removeGoalAction(0))
*/

// Add functions for the UI to interact with
function addTodo() {
  const input = document.getElementById('todo');
  const name = input.value;
  input.value = '';

  store.dispatch(addTodoAction({id: generateId(), name, complete: false}));
}

function addGoal() {
  const input = document.getElementById('goal');
  const name = input.value;
  input.value = '';

  store.dispatch(addGoalAction({id: generateId(), name}));
}

document.getElementById('todoBtn').addEventListener('click', addTodo)
document.getElementById('goalBtn').addEventListener('click', addGoal)

function createRemoveButton(onClick) {
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', onClick);

  return removeBtn;
}

function addTodoToDOM(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);
  const removeBtn =
      createRemoveButton(() => {store.dispatch(removeTodoAction(todo.id))})

  node.appendChild(text);
  node.appendChild(removeBtn);

  node.style.textDecoration = todo.complete ? 'line-through' : 'none';
  node.addEventListener(
      'click', () => {store.dispatch(toggleTodoAction(todo.id))});

  document.getElementById('todos').appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);
  const removeBtn =
      createRemoveButton(() => {store.dispatch(removeGoalAction(goal.id))})

  node.appendChild(text);
  node.appendChild(removeBtn);

  document.getElementById('goals').appendChild(node);
}

function toggleTodo() {}