import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import produce from 'immer';

import { createReducer } from 'react-use';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate';

import PersistenceService from '../data/persistence';
import { useEntities } from '../state/entity-store';

const PersistenceStateContext = createContext();
const PersistenceDispatchContext = createContext();

const getInitialState = source => ({
  source,
});

/* eslint-disable no-param-reassign */
const persistenceReducer = produce((draft, action) => {
  switch (action.type) {
    case 'set_source': {
      draft.source = action.payload.source;
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
});
/* eslint-enable no-param-reassign */

const persistenceService = PersistenceService({
  persistenceAdapter: 'file',
});

const useThunkReducer = createReducer(thunk.withExtraArgument(persistenceService), logger);

const PersistenceProvider = ({ initialSource, children }) => {
  const [state, dispatch] = useThunkReducer(persistenceReducer, getInitialState(initialSource));
  const { entities, load } = useEntities();

  useEffect(() => {
    const locationListener = async (location /* , options */) => {
      dispatch({
        type: 'set_source',
        payload: {
          source: location,
        },
      });
    };
    persistenceService.on('location_changed', locationListener);

    const openListener = async (filePath /* , options */) => {
      const data = await persistenceService.getAll();
      load(data);
      dispatch({
        type: 'set_source',
        payload: {
          source: filePath,
        },
      });
    };
    persistenceService.on('open', openListener);

    return () => {
      persistenceService.removeListener(locationListener);
      persistenceService.removeListener(openListener);
    };
  }, [dispatch, load]);

  const save = useCallback(async (location, options) => {
    await persistenceService.load(entities); // TODO: This is not the stadard interface (so may fail)
    await persistenceService.flush(location, options);
  }, [entities]);

  const open = useCallback(async (location, options) => {
    await persistenceService.open(location, options);
  }, []);

  // useWhyDidYouUpdate('PersistenceProvider', contextValue);

  return (
    <PersistenceStateContext.Provider value={{
      ...state,
      save,
      open,
    }}
    >
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

const usePersistence = () => {
  const { save, open } = usePersistenceState();
  return { save, open };
};

export {
  PersistenceProvider,
  usePersistenceState,
  usePersistenceDispatch,
  usePersistence,
};
