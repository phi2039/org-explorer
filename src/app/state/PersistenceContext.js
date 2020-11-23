import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

import produce, { current } from 'immer';

import { flow, flatten } from 'lodash';

import { joinTruthy } from '../../lib/util/strings';

import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate';
import useReducerAsync from '../hooks/useReducerAsync';
import PersistenceService from '../data/service';

const PersistenceStateContext = createContext();
const PersistenceDispatchContext = createContext();

const getPath = (node, nodes) => flow([
  n => nodes[n.parent], // get parent
  parent => parent
    ? joinTruthy([parent.path, parent.id], '/')
    : '',
])(node);

const addLazyEvalPath = nodes => node => ({
  ...node,
  get path() {
    delete this.path;
    this.path = getPath(node, nodes);
    return this.path;
  },
});

const getChildren = (node, nodes) => Object.values(nodes)
  .filter(n => n.parent === node.id)
  .map(n => n.id);

const addLazyEvalChildren = nodes => node => {
  if (node.type !== 'group') {
    return node;
  }

  return {
    ...node,
    get children() {
      delete this.children;
      this.children = getChildren(node, nodes);
      return this.children;
    },
  };
};

const getDescendants = (node, nodes) => {
  const { children = [] } = node;

  return flatten(children.map(child => ([
    child,
    ...getDescendants(nodes[child], nodes),
  ])));
};

const addLazyEvalDescendants = nodes => node => {
  if (node.type !== 'group') {
    return node;
  }

  return {
    ...node,
    get descendants() {
      delete this.descendants;
      this.descendants = getDescendants(node, nodes);
      return this.descendants;
    },
  };
};

const getEnhancers = docs => [
  addLazyEvalPath(docs),
  addLazyEvalChildren(docs),
  addLazyEvalDescendants(docs),
];

const enhanceDocument = (doc, enhancers) => flow(enhancers)(doc);

const enhanceDocuments = (docs) => {
  const enhancers = getEnhancers(docs);

  Object.entries(docs).forEach(([id, attrs]) => {
    // eslint-disable-next-line no-param-reassign
    docs[id] = enhanceDocument(attrs, enhancers);
  });

  return docs;
};

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

export const fetchAction = dispatch => mutations => {
  dispatch(fetchThunk(mutations));
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
      draft.cache.entities = enhanceDocuments(action.payload.entities);
      break;
    }
    case 'reload_begin': {
      draft.isLoading = true;
      break;
    }
    case 'reload_complete': {
      draft.isLoading = false;
      draft.cache.entities = enhanceDocuments(action.payload.entities);
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
      draft.cache.entities = enhanceDocuments(draft.cache.entities);
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
      draft.cache.entities = enhanceDocuments(draft.cache.entities);
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState[Persistence]', current(draft));
});
/* eslint-enable no-param-reassign */

const persistenceService = PersistenceService();

const PersistenceProvider = ({ initialSource, children }) => {
  const [state, dispatch] = useReducerAsync(persistenceReducer, getInitialState(initialSource), persistenceService);
  useWhyDidYouUpdate('PersistenceProvider', state);

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
