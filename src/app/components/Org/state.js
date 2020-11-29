import React, {
  createContext,
  useContext,
  useMemo,
} from 'react';
import { PropTypes } from 'prop-types';
import produce from 'immer';

import isDev from 'electron-is-dev';
import logDispatch from '../../../lib/logging/log-dispatch';

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

const defaultState = {
  action: undefined,
  subject: undefined,
  values: {},
};

/* eslint-disable no-param-reassign */
const actionReducer = produce((draft, action) => {
  switch (action.type) {
    case 'begin': {
      draft.action = action.payload.action;
      draft.subject = action.payload.subject;
      draft.values = {};
      break;
    }
    case 'set_clipboard': {
      draft.clipboard = action.payload.subjectId;
      break;
    }
    case 'reset_clipboard': {
      draft.clipboard = null;
      break;
    }
    case 'cancel': {
      draft.action = undefined;
      draft.subject = undefined;
      draft.values = {};
      break;
    }
    case 'commit': {
      draft.action = undefined;
      draft.subject = undefined;
      draft.values = {};
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
});
/* eslint-enable no-param-reassign */

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
  const [state, dispatch] = useReducerAsync(isDev ? logDispatch(actionReducer, 'OrgActions') : actionReducer, defaultState);

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
