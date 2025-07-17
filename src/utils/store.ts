export const generateSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as App.WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => void>)[k] = () =>
      store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const storeResetFns = new Set<() => void>();

export const createStore = (<T extends object>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = create(stateCreator);
    const initialState = store.getState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof create;

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};
