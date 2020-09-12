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

  const subscribe =
      (listener) => {
        listeners.push(listener);
        return () => {
          listeners = listeners.filter(l => l !== listener)
        }
      }

  return {getState, subscribe};
}

const store = createStore();

const unsubscribe = store.subscribe(() => {
  console.log('The state changed to: ', state);
})

const unsubscribe = store.subscribe(() => {console.log('The store changed.')})
