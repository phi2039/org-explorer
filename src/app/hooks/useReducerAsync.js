import {
  useState,
  useReducer,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';

import { wrapAsync } from '../../lib/state/async';

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
