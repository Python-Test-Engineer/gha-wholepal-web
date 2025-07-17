import initialState from './state';
import createAction from './actions';
import type { State, Actions } from './types';

export default generateSelectors(
  createStore<State & Actions>()((set) => ({
    ...initialState,
    ...createAction(set),
  })),
);
