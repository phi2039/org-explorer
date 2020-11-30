import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';

import { isEqual } from 'lodash';

import produce, { enablePatches, produceWithPatches } from 'immer';

import { createReducer } from 'react-use';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const EntityStateContext = createContext();
const EntityDispatchContext = createContext();

enablePatches();

/* eslint-disable no-param-reassign */
const withTimeline = reducer => (state, action) => {
  switch (action.type) {
    case 'timeline_undo':
      return produce(state, draft => {
        if (draft.past.length) {
          const newPresent = draft.past.pop();
          draft.future.unshift(draft.present);
          draft.present = newPresent;
        }
      });
    case 'timeline_redo':
      return produce(state, draft => {
        if (draft.future.length) {
          const newPresent = draft.future.shift();
          draft.past.push(draft.present);
          draft.present = newPresent;
        }
      });
    case 'timeline_clear':
      return produce(state, draft => {
        draft.past = [];
        draft.future = [];
      });
    default:
      return produce(state, draft => {
        const [nextState, patches] = produceWithPatches(draft.present, d => reducer(d, action));
        if (patches.length) {
          draft.past.push(draft.present);
          draft.present = nextState;
          draft.future = [];
        }
      });
  }
};
/* eslint-enable no-param-reassign */

const useThunkReducer = createReducer(thunk, logger);

const updateEntity = entities => (id, { id: _id, type, ...values }) => ({ ...entities[id], ...values });

const mutateThunk = mutations => async (dispatch, getState) => {
  const { present: { entities } } = getState();

  const { update = [], remove = [], create = [] } = mutations;
  const updated = update.map(({ id, values }) => updateEntity(entities)(id, values)); // Takes {id, values}  -> Returns entities
  const removed = remove.map(id => ({ id })); // Takes id  -> Returns partial entities (only id attribute)
  const created = create.map(values => ({ ...values, id: cuid() })); // Takes values  -> Returns entities

  dispatch({
    type: 'entities_mutate',
    payload: {
      updated,
      removed,
      created,
    },
  });
};

export const mutateAction = dispatch => mutations => {
  dispatch(mutateThunk(mutations));
};

const loadThunk = entities => async (dispatch, getState) => {
  dispatch({
    type: 'entities_load',
    payload: {
      entities,
    },
  });
  dispatch({ type: 'timeline_clear' });
};

export const loadAction = dispatch => entities => {
  dispatch(loadThunk(entities));
};

const getInitialState = source => ({
  past: [],
  future: [],
  present: {},
  source,
});

/* eslint-disable no-param-reassign */
const entityReducer = produce((draft, action) => {
  switch (action.type) {
    case 'entities_load': {
      draft.entities = action.payload.entities;
      break;
    }
    case 'entities_mutate': {
      const { created, updated, removed } = action.payload;
      created.forEach(item => {
        draft.entities[item.id] = item;
      });
      removed.forEach(item => {
        delete draft.entities[item.id];
      });
      updated.forEach(item => {
        if (!draft.entities[item.id]) {
          draft.entities[item.id] = item;
        } else if (!isEqual(draft.entities[item.id], item)) {
          Object.assign(draft.entities[item.id], item);
        }
      });
      break;
    }
    default: {
      if (action.type) {
        throw new Error(`Unhandled action type: ${action.type}`);
      }
    }
  }
});
/* eslint-enable no-param-reassign */

const useEntityContext = () => {
  const context = useContext(EntityStateContext);
  if (context === undefined) {
    throw new Error(
      'useEntityContext must be used within a EntityProvider',
    );
  }
  return context;
};

const useEntities = () => {
  const { present: { entities = {} } } = useEntityContext();
  const dispatch = useContext(EntityDispatchContext);

  const mutate = useCallback(mutateAction(dispatch), [dispatch]);
  const load = useCallback(loadAction(dispatch), [dispatch]);

  return { entities, mutate, load };
};

const useEntity = id => {
  const { entities } = useEntities();
  const entity = entities[id];
  if (!entity) {
    throw new Error(`unknown entity: ${id}`);
  }
  return entity;
};

const useTimeline = () => {
  const dispatch = useContext(EntityDispatchContext);
  const { present, past, future } = useEntityContext();

  const doUndo = useCallback(() => dispatch({ type: 'timeline_undo' }), [dispatch]);
  const doRedo = useCallback(() => dispatch({ type: 'timeline_redo' }), [dispatch]);
  const doClear = useCallback(() => dispatch({ type: 'timeline_clear' }), [dispatch]);

  const timeline = useMemo(() => ({ present, past, future }), [present, past, future]);

  return {
    doUndo,
    doRedo,
    doClear,
    timeline,
  };
};

const EntityProvider = ({ initialSource, children }) => {
  const reducer = withTimeline(entityReducer);
  const [state, dispatch] = useThunkReducer(reducer, getInitialState(initialSource));

  return (
    <EntityStateContext.Provider value={state}>
      <EntityDispatchContext.Provider value={dispatch}>
        {children}
      </EntityDispatchContext.Provider>
    </EntityStateContext.Provider>
  );
};

EntityProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
  initialSource: PropTypes.string,
};

EntityProvider.defaultProps = {
  initialSource: null,
};

export {
  EntityProvider,
  useEntities,
  useEntity,
  useTimeline,
};
