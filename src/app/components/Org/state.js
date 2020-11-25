import React, {
  createContext,
  useContext,
  useMemo,
} from 'react';
import { PropTypes } from 'prop-types';

import useReducerAsync from '../../hooks/useReducerAsync';
import { usePersistenceState } from '../../state/PersistenceContext';

import Graph from '../../../lib/graph';

const ActionStateContext = createContext();
const ActionDispatchContext = createContext();

export const beginActionAction = dispatch => (action, subject) => dispatch({
  type: 'begin',
  payload: {
    action,
    subject,
  },
});

export const cancelActionAction = dispatch => () => dispatch({
  type: 'cancel',
});

export const commitAction = dispatch => () => dispatch({
  type: 'commit',
});

export const setClipboardAction = dispatch => subjectId => dispatch({
  type: 'set_clipboard',
  payload: {
    subjectId,
  },
});

export const resetClipboardAction = dispatch => () => dispatch({
  type: 'reset_clipboard',
});

const defaultState = {
  action: undefined,
  subject: undefined,
  values: {},
};

const actionReducer = (state, action) => {
  let nextState = state;
  console.log('dispatch[Actions]', action);
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
    case 'set_clipboard': {
      nextState = {
        ...state,
        clipboard: action.payload.subjectId,
      };
      break;
    }
    case 'reset_clipboard': {
      nextState = {
        ...state,
        clipboard: null,
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
        isCommitting: false,
      };
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState[Actions]', nextState);
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

const ActionProvider = ({ children }) => {
  const [state, dispatch] = useReducerAsync(actionReducer, defaultState);

  return (
    <ActionStateContext.Provider value={state}>
      <ActionDispatchContext.Provider value={dispatch}>
        {children}
      </ActionDispatchContext.Provider>
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

const GraphContext = createContext();

const useGraph = () => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error(
      'useGraph must be used within a GraphProvider',
    );
  }
  return context;
};

const GraphProvider = ({ children }) => {
  const { cache: { entities } } = usePersistenceState();

  const graph = useMemo(() => Graph(Object.values(entities).map(({ id, parent }) => ({ id, parent }))), [entities]);

  return (
    <GraphContext.Provider value={graph}>
      {children}
    </GraphContext.Provider>
  );
};

GraphProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

export {
  ActionProvider,
  useActionState,
  useActionDispatch,
  GraphProvider,
  useGraph,
};
