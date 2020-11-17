import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { PropTypes } from 'prop-types';

const ActionStateContext = createContext();
const ActionDispatchContext = createContext();

const defaultState = {
  action: undefined,
  subject: undefined,
  values: {},
};

const actionReducer = (state, action) => {
  let nextState = state;
  console.log('dispatch', action);
  switch (action.type) {
    case 'begin': {
      nextState = {
        ...state,
        action: action.payload.action,
        subject: action.payload.subject,
        values: {},
      };
      break;
    }
    case 'cancel': {
      nextState = defaultState;
      break;
    }
    case 'reset': {
      nextState = {
        ...state,
        values: {},
      };
      break;
    }
    case 'commit': {
      nextState = {
        ...state,
        action: undefined,
        values: action.payload.values,
      };
      break;
    }
    case 'commit_begin': {
      nextState = {
        ...state,
        isCommitting: true,
      };
      break;
    }
    case 'commit_end': {
      nextState = {
        ...state,
        action: undefined,
        isCommitting: false,
        values: action.payload.values,
      };
      break;
    }
    case 'commit_error': {
      nextState = {
        ...state,
        action: undefined,
        isCommitting: false,
        values: action.payload.values,
        error: action.payload.error,
      };
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState', nextState);
  return nextState;
};

const useActionState = () => {
  const context = useContext(ActionStateContext);
  if (context === undefined) {
    throw new Error(
      'useActionState must be used within a ActionProvider',
    );
  }
  return context;
};

const useActionDispatch = () => {
  const context = useContext(ActionDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useActionDispatch must be used within a ActionProvider',
    );
  }
  return context;
};

const wrapAsyncAction = (dispatch, getState) => (actionOrThunk) => {
  if (typeof actionOrThunk === 'function') {
    const thunk = actionOrThunk;
    return thunk(dispatch, getState);
  }

  if (actionOrThunk instanceof Promise) {
    const promise = actionOrThunk;
    return promise.then(dispatch, getState);
  }

  const action = actionOrThunk;
  return dispatch(action);
};

const ActionDispatchProvider = ({ value: dispatch, children }) => {
  const state = useActionState();
  const getState = useCallback(() => state, [state]);

  // TODO: Performance issue? Forces re-render every time the action state changes
  const asyncDispatch = useCallback(wrapAsyncAction(dispatch, getState), [dispatch, getState]);

  return (
    <ActionDispatchContext.Provider value={asyncDispatch}>
      {children}
    </ActionDispatchContext.Provider>
  );
};

ActionDispatchProvider.propTypes = {
  value: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

const ActionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(actionReducer, defaultState);

  return (
    <ActionStateContext.Provider value={state}>
      <ActionDispatchProvider value={dispatch}>
        {children}
      </ActionDispatchProvider>
    </ActionStateContext.Provider>
  );
};

ActionProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

export { ActionProvider, useActionState, useActionDispatch };
