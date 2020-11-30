import React, { createContext, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';

import produce from 'immer';

import isDev from 'electron-is-dev';
import logDispatch from '../../lib/logging/log-dispatch';
import useReducerAsync from '../hooks/useReducerAsync';

const EntityStateContext = createContext();
const EntityDispatchContext = createContext();

const updateEntity = entities => (id, { id: _id, type, ...values }) => ({ ...entities[id], ...values });

const mutateThunk = mutations => async (dispatch, getState) => {
  dispatch({
    type: 'mutation_begin',
    payload: {
      mutations,
    },
  });

  const { entities } = getState();
  const { update = [], remove = [], create = [] } = mutations;
  const updated = update.map(({ id, values }) => updateEntity(entities)(id, values)); // Takes {id, values}  -> Returns entities
  const removed = remove.map(id => ({ id })); // Takes id  -> Returns partial entities (only id attribute)
  const created = create.map(values => ({ ...values, id: cuid() })); // Takes values  -> Returns entities

  dispatch({
    type: 'mutation_complete',
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

export const loadAction = dispatch => entities => {
  dispatch({
    type: 'load',
    payload: {
      entities,
    },
  });
};

const getInitialState = source => ({
  entities: {},
  source,
});

/* eslint-disable no-param-reassign */
const entityReducer = produce((draft, action) => {
  switch (action.type) {
    case 'load': {
      draft.errors = [];
      draft.isSaving = false;
      draft.entities = action.payload.entities;
      break;
    }
    case 'mutation_begin': {
      draft.errors = [];
      draft.isSaving = true;
      break;
    }
    case 'mutation_failed': {
      draft.errors = action.payload.errors;
      draft.isSaving = false;
      break;
    }
    case 'mutation_complete': {
      draft.isSaving = false;
      const { created, updated, removed } = action.payload;
      created.forEach(item => {
        draft.entities[item.id] = item;
      });
      removed.forEach(item => {
        delete draft.entities[item.id];
      });
      updated.forEach(item => {
        draft.entities[item.id] = item;
      });
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
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
  const { entities } = useEntityContext();
  const dispatch = useContext(EntityDispatchContext);

  const mutate = useCallback(mutateAction(dispatch), [dispatch]);
  const load = useCallback(loadAction(dispatch), [dispatch]);

  return { entities, mutate, load };
};

const useEntity = id => {
  const context = useContext(EntityStateContext);
  const entity = context.entities[id];
  if (!entity) {
    throw new Error(`unknown entity: ${id}`);
  }
  return entity;
};

const EntityProvider = ({ initialSource, children }) => {
  const [state, dispatch] = useReducerAsync(isDev ? logDispatch(entityReducer, 'Entities') : entityReducer, getInitialState(initialSource));

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
};
