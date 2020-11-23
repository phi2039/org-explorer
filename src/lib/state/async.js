// eslint-disable-next-line import/prefer-default-export
export const wrapAsync = (dispatch, getState, extraArg) => (actionOrThunk) => {
  if (typeof actionOrThunk === 'function') {
    const thunk = actionOrThunk;
    return thunk(dispatch, getState, extraArg);
  }

  if (actionOrThunk instanceof Promise) {
    const promise = actionOrThunk;
    return promise.then(dispatch, getState, extraArg);
  }

  const action = actionOrThunk;
  return dispatch(action);
};
