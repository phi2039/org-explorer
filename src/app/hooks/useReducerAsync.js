import {
  useState,
  useReducer,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';

const wrapAsync = (dispatch, getState, extraArg) => (actionOrThunk) => {
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

const useReducerAsync = (reducer, initialState, extra) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [extraArg] = useState(extra);

  const lastState = useRef(state);
  useLayoutEffect(() => {
    lastState.current = state;
  }, [state]);

  const getState = useCallback((() => lastState.current), []);

  const asyncDispatch = useCallback(wrapAsync(dispatch, getState, extraArg), [dispatch, getState]);

  return [state, asyncDispatch];
};

export default useReducerAsync;
