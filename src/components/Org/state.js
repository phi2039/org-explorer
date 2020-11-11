/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react';
import produce from 'immer';
import constate from 'constate';

import { useDataContext } from '../../state/DataContext';

const mapEntities = entities => Object.entries(entities).reduce((acc, [key]) => ({
  ...acc,
  [key]: {},
}), {});

const mapSchemas = schemas => Object.entries(schemas).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: mapEntities(value),
}), {});

const useOrg = () => {
  const { entities, root } = useDataContext();

  const [state, setState] = useState({
    entities: { nodes: {} },
    root,
    activeRoot: root,
  });

  useEffect(() => {
    setState({
      entities: mapSchemas(entities.getAll()),
      root,
      activeRoot: root,
    });
  }, [entities, root]);

  const isActiveRoot = id => (state.activeRoot === id);

  const isRoot = id => (state.root === id);

  const isFocused = () => state.activeRoot !== state.root;

  const isExpanded = id => {
    const node = state.entities.nodes[id];
    return !!(node && node.expand);
  };

  const isSelected = id => (state.selection === id);

  const toggleNodeState = id => {
    setState(
      produce(draft => {
        const node = draft.entities.nodes[id];
        node.expand = !node.expand;
      }),
    );
  };

  const getNodes = type => {
    const { nodes } = entities;
    if (type) {
      return entities.filter(node => node.type === type);
    }
    return nodes;
  };

  const expandAll = () => {
    setState(
      produce(draft => {
        getNodes('group').forEach(node => { node.expand = true; });
      }),
    );
  };

  const collapseAll = () => {
    setState(
      produce(draft => {
        getNodes('group').forEach(node => { node.expand = false; });
      }),
    );
  };

  const setActiveRoot = id => {
    console.log(`set active root to ${id}`);
    if (!id) {
      setState(
        produce(draft => {
          draft.activeRoot = draft.root;
        }),
      );
    } else {
      const node = entities.get(id);
      if (node) {
        setState(
          produce(draft => {
            draft.activeRoot = id;
          }),
        );
      }
    }
  };

  const setSelection = id => {
    setState(
      produce(draft => {
        draft.selection = id;
      }),
    );
  };

  return {
    state,
    isActiveRoot,
    isRoot,
    isExpanded,
    isSelected,
    isFocused,
    toggleNodeState,
    expandAll,
    collapseAll,
    setActiveRoot,
    setSelection,
  };
};

export const [OrgStateProvider, useOrgState] = constate(
  useOrg,
  context => context,
);

// export const useOrgState = useOrg;
