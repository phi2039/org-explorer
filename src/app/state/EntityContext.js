import React, { createContext, useContext, useReducer } from 'react';
import produce, { current } from 'immer';

import { normalize, schema } from 'normalizr';

const EntityStateContext = createContext();
const EntityDispatchContext = createContext();

const nodeSchema = new schema.Entity('nodes');

const nodeArraySchema = new schema.Array({
  nodes: nodeSchema,
}, () => 'nodes');

nodeSchema.define({ children: nodeArraySchema });

const normalizeData = data => {
  if (!data) {
    return {};
  }

  const normalizedData = normalize(data, nodeSchema);
  return {
    entities: normalizedData.entities,
    root: normalizedData.result,
  };
};

export const deleteEntityAction = dispatch => id => dispatch({
  type: 'delete',
  payload: {
    id,
  },
});

export const patchEntityAction = dispatch => (subject, values) => dispatch({
  type: 'patch',
  payload: {
    id: subject.id,
    values,
  },
});


const Lazy = resolve => {
  let value;
  return {
    get: () => {
      if (value === undefined) {
        value = resolve();
      }
      return value;
    },
  };
};

const getPath = (node, nodes) => {
  const { parent: parentId } = node;
  if (!parentId) {
    return '';
  }

  const parent = nodes.get(parentId);
  if (!parent) {
    throw new Error('invalid parent id');
  }

  return [parent.path, parent.id].filter(path => !!path).join('/');
};

const addPaths = nodes => {
  const startTime = window.performance.now();
  const nodeProvider = {
    get: id => nodes[id],
  };

  const enhanced = Object.entries(nodes).reduce(
    (acc, [id, attrs]) => ({
      ...acc,
      [id]: {
        ...attrs,
        getPath: Lazy(() => getPath(attrs, nodeProvider)).get,
        get path() { return this.getPath(); },
      },
    }),
    {},
  );

  nodeProvider.get = id => enhanced[id];

  const result = Object.entries(enhanced).reduce(
    (acc, [id, attrs]) => ({
      ...acc,
      [id]: {
        ...attrs,
        path: attrs.path,
      },
    }),
    {},
  );

  const endTime = window.performance.now();
  console.log('added paths:', endTime - startTime);
  return result;
};

const entityReducer = produce((draft, action) => {
  console.log('dispatch', action);
  switch (action.type) {
    case 'load': {
      const normalizedData = normalizeData(action.payload.data);
      draft.entities = normalizedData.entities; // eslint-disable-line no-param-reassign
      draft.entities.nodes = addPaths(draft.entities.nodes); // eslint-disable-line no-param-reassign
      break;
    }
    case 'patch': {
      const { id, values } = action.payload;
      const entity = draft.entities.nodes[id];
      if (entity) {
        const {
          id: _id,
          type,
          ...attrs
        } = values;
        Object.assign(entity, { ...attrs });
      }
      break;
    }
    case 'delete': {
      const { id } = action.payload;
      const entity = draft.entities.nodes[id];
      if (entity) {
        delete draft.entities.nodes[id]; // eslint-disable-line no-param-reassign
      }
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState', current(draft));
}, {});

const EntityProvider = ({ entities = {}, children }) => {
  const [state, dispatch] = useReducer(entityReducer, { entities });

  return (
    <EntityStateContext.Provider value={state}>
      <EntityDispatchContext.Provider value={dispatch}>
        {children}
      </EntityDispatchContext.Provider>
    </EntityStateContext.Provider>
  );
};

const useEntityState = () => {
  const context = useContext(EntityStateContext);
  if (context === undefined) {
    throw new Error(
      'useEntityState must be used within a EntityProvider',
    );
  }
  return context;
};

const useEntityDispatch = () => {
  const context = useContext(EntityDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useEntityDispatch must be used within a EntityProvider',
    );
  }
  return context;
};

export { EntityProvider, useEntityState, useEntityDispatch };
