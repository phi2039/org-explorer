import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import produce, { current } from 'immer';

import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate';
import useReducerAsync from '../hooks/useReducerAsync';
import PersistenceService from '../data/service';

const PersistenceStateContext = createContext();
const PersistenceDispatchContext = createContext();

const mutateThunk = mutations => async (dispatch, getState, extraArg) => {
  dispatch({
    type: 'mutation_begin',
    payload: {
      mutations,
    },
  });

  const { update = [], remove = [], create = [] } = mutations;
  const persistenceService = extraArg;
  const [updated = [], removed = [], created = []] = await Promise.all([
    persistenceService.updateMany(update),
    persistenceService.removeMany(remove),
    persistenceService.createMany(create),
  ]);

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

const fetchThunk = ids => async (dispatch, getState, extraArg) => {
  dispatch({
    type: 'fetch_begin',
    payload: {
      ids,
    },
  });

  const persistenceService = extraArg;
  const items = await persistenceService.getMany(ids);

  dispatch({
    type: 'fetch_complete',
    payload: {
      items,
    },
  });
};

export const fetchAction = dispatch => ids => {
  dispatch(fetchThunk(ids));
};

// TODO: This is ugly. Should not be using dispatch for general message-passing
const saveThunk = (location) => async (dispatch, getState, extraArg) => {
  const persistenceService = extraArg;
  await persistenceService.flush(location);
};

export const saveAction = dispatch => location => {
  dispatch(saveThunk(location));
};

// TODO: This is ugly. Should not be using dispatch for general message-passing
const openThunk = (location, options) => async (dispatch, getState, extraArg) => {
  const persistenceService = extraArg;
  await persistenceService.open(location, options);
};

export const openAction = dispatch => (location, options) => {
  dispatch(openThunk(location, options));
};

const getInitialState = source => ({
  cache: {
    entities: {},
  },
  source,
});

/* eslint-disable no-param-reassign */
const persistenceReducer = produce((draft, action) => {
  console.log('dispatch[Persistence]', action);
  switch (action.type) {
    case 'set_source': {
      draft.source = action.payload.source;
      break;
    }
    case 'load': {
      draft.isLoading = false;
      draft.cache.entities = action.payload.entities;
      break;
    }
    case 'reload_begin': {
      draft.isLoading = true;
      break;
    }
    case 'reload_complete': {
      draft.isLoading = false;
      draft.cache.entities = action.payload.entities;
      break;
    }
    case 'fetch_begin': {
      draft.isLoading = true;
      break;
    }
    case 'fetch_complete': {
      draft.isLoading = false;
      const { items } = action.payload;
      items.forEach(item => {
        draft.cache.entities[item.id] = item;
      });
      break;
    }
    case 'mutation_begin': {
      draft.isSaving = true;
      break;
    }
    case 'mutation_complete': {
      draft.isSaving = false;
      const { created, updated, removed } = action.payload;
      created.forEach(item => {
        draft.cache.entities[item.id] = item;
      });
      removed.forEach(item => {
        delete draft.cache.entities[item.id];
      });
      updated.forEach(item => {
        draft.cache.entities[item.id] = item;
      });
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState[Persistence]', current(draft));
});
/* eslint-enable no-param-reassign */

const persistenceService = PersistenceService({
  persistenceAdapter: 'file',
});

const PersistenceProvider = ({ initialSource, children }) => {
  const [state, dispatch] = useReducerAsync(persistenceReducer, getInitialState(initialSource), persistenceService);
  useWhyDidYouUpdate('PersistenceProvider', state);

  useEffect(() => {
    const locationListener = persistenceService.on('location_changed', async (location /* , options */) => {
      dispatch({
        type: 'set_source',
        payload: {
          source: location,
        },
      });
    });

    const openListener = persistenceService.on('open', async (filePath /* , options */) => {
      const entities = await persistenceService.getAll();
      dispatch({
        type: 'load',
        payload: {
          entities,
        },
      });
      dispatch({
        type: 'set_source',
        payload: {
          source: filePath,
        },
      });
    });

    return () => {
      persistenceService.removeListener(locationListener);
      persistenceService.removeListener(openListener);
    };
  }, [dispatch]);

  return (
    <PersistenceStateContext.Provider value={state}>
      <PersistenceDispatchContext.Provider value={dispatch}>
        {children}
      </PersistenceDispatchContext.Provider>
    </PersistenceStateContext.Provider>
  );
};

PersistenceProvider.propTypes = {
  initialSource: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

PersistenceProvider.defaultProps = {
  initialSource: null,
};

const usePersistenceState = () => {
  const context = useContext(PersistenceStateContext);
  if (context === undefined) {
    throw new Error(
      'useEntityState must be used within a PersistenceProvider',
    );
  }
  return context;
};

const usePersistenceDispatch = () => {
  const context = useContext(PersistenceDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useEntityDispatch must be used within a PersistenceProvider',
    );
  }
  return context;
};

export { PersistenceProvider, usePersistenceState, usePersistenceDispatch };
