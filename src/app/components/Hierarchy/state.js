import React, {
  createContext,
  useContext,
  useReducer,
} from 'react';

const HierarchyStateContext = createContext();
const HierarchyDispatchContext = createContext();

const setStateOnOne = (key, value) => (nodes, id) => {
  const node = nodes[id] || {};

  return {
    ...nodes,
    [id]: {
      ...node,
      state: {
        ...(node.state || {}),
        [key]: value,
      },
    },
  };
};

const setStateOnAll = (key, value) => (nodes) => Object.entries(nodes).reduce(
  (acc, [id, attrs]) => ({
    ...acc,
    [id]: {
      ...attrs,
      state: {
        ...(attrs.state || {}),
        [key]: value,
      },
    },
  }),
  {},
);

const ensureStateOnAll = nodes => Object.entries(nodes).reduce(
  (acc, [id, attrs]) => ({
    ...acc,
    [id]: {
      ...attrs,
      state: {
        ...(attrs.state || {}),
      },
    },
  }),
  {},
);

const setActiveRoot = (hierarchy, id) => ({
  ...hierarchy,
  activeRoot: id,
});

const resetActiveRoot = (hierarchy) => ({
  ...hierarchy,
  activeRoot: hierarchy.root,
});

const selectNode = (hierarchy, id) => ({
  ...hierarchy,
  selection: id,
});

const resetSelection = (hierarchy) => ({
  ...hierarchy,
  selection: null,
});

const collapseAll = setStateOnAll('expanded', false);
const expandAll = setStateOnAll('expanded', true);

const collapseNode = setStateOnOne('expanded', false);
const expandNode = setStateOnOne('expanded', true);

const toggleNode = (nodes, id) => {
  const node = nodes[id];
  return node.state.expanded
    ? collapseNode(nodes, id)
    : expandNode(nodes, id);
};

const mergeState = (object, source) => Object.entries(object).reduce(
  (acc, [id, attrs]) => ({
    ...acc,
    [id]: {
      ...attrs,
      state: {
        ...(attrs.state || {}),
        ...((source[id] || {}).state || {}),
      },
    },
  }),
  {},
);

const load = ({
  nodes = {},
  root,
}) => ({
  nodes: ensureStateOnAll(nodes),
  hierarchy: {
    root,
    activeRoot: root,
  },
});

// TODO: Switch to immer (performance improvement?)
const hierarchyReducer = (state, action) => {
  let nextState = state;
  console.log('dispatch[Hierarchy]', action);
  switch (action.type) {
    case 'load': {
      nextState = load(action.payload.data);
      const { nodes } = nextState;
      nextState.nodes = mergeState(nodes, state.nodes || {});
      break;
    }
    case 'set_active_root': {
      nextState = {
        ...state,
        hierarchy: setActiveRoot(state.hierarchy, action.payload.id),
      };
      break;
    }
    case 'reset_active_root': {
      nextState = {
        ...state,
        hierarchy: resetActiveRoot(state.hierarchy),
      };
      break;
    }
    case 'select': {
      nextState = {
        ...state,
        hierarchy: selectNode(state.hierarchy, action.payload.id),
      };
      break;
    }
    case 'reset_selection': {
      nextState = {
        ...state,
        hierarchy: resetSelection(state.hierarchy),
      };
      break;
    }
    case 'expand': {
      nextState = {
        ...state,
        nodes: expandNode(state.nodes, action.payload.id),
      };
      break;
    }
    case 'collapse': {
      nextState = {
        ...state,
        nodes: collapseNode(state.nodes, action.payload.id),
      };
      break;
    }
    case 'toggle': {
      nextState = {
        ...state,
        nodes: toggleNode(state.nodes, action.payload.id),
      };
      break;
    }
    case 'expand_all': {
      nextState = {
        ...state,
        nodes: expandAll(state.nodes),
      };
      break;
    }
    case 'collapse_all': {
      nextState = {
        ...state,
        nodes: collapseAll(state.nodes),
      };
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState[Hierarchy]', nextState);
  return nextState;
};

const HierarchyProvider = ({ nodes = {}, root, children }) => {
  const [state, dispatch] = useReducer(hierarchyReducer, load({
    nodes,
    root,
  }));

  return (
    <HierarchyStateContext.Provider value={state}>
      <HierarchyDispatchContext.Provider value={dispatch}>
        {children}
      </HierarchyDispatchContext.Provider>
    </HierarchyStateContext.Provider>
  );
};

const useHierarchyState = () => {
  const context = useContext(HierarchyStateContext);
  if (context === undefined) {
    throw new Error(
      'useHierarchyState must be used within a HierarchyProvider',
    );
  }
  return context;
};

const useHierarchyDispatch = () => {
  const context = useContext(HierarchyDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useHierarchyDispatch must be used within a HierarchyProvider',
    );
  }
  return context;
};

export { HierarchyProvider, useHierarchyState, useHierarchyDispatch };
