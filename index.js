// Helper function to create an id
function generateId() {
  return Math.random().toString(36).substring(2) +
      (new Date()).getTime().toString(36);
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

const checker =
    (store) => (next) => (action) => {
      if ((action.type === ADD_TODO &&
           action.todo.name.toLowerCase().includes('bitcoin')) ||
          (action.type === ADD_GOAL &&
           action.goal.name.toLowerCase().includes('bitcoin'))) {
        return alert('Nope. That\'s a bad idea.');
      }

      return next(action);
    }

const logger =
    (store) => (next) => (action) => {
      console.group(action.type);
      console.log('Action: ', action);
      const result = next(action);
      console.log('New state: ', store.getState());
      console.groupEnd();
      return result;
    }

// Use the store
const store = Redux.createStore(
    Redux.combineReducers({todos, goals}),
    Redux.applyMiddleware(checker, logger));

const unsubscribe = store.subscribe(() => {
  const {todos, goals} = store.getState();

  document.getElementById('todos').innerHTML = '';
  document.getElementById('goals').innerHTML = '';

  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
})

// Add functions for the UI to interact with
function addTodo(event) {
  event.preventDefault();
  const input = document.getElementById('todo');
  const name = input.value;
  if (name != '') {
    input.value = '';
    store.dispatch(addTodoAction({id: generateId(), name, complete: false}));
  }
}

function addGoal(event) {
  event.preventDefault();
  const input = document.getElementById('goal');
  const name = input.value;
  if (name != '') {
    input.value = '';
    store.dispatch(addGoalAction({id: generateId(), name}));
  }
}

document.getElementById('todoForm').addEventListener('submit', addTodo)
document.getElementById('goalForm').addEventListener('submit', addGoal)

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