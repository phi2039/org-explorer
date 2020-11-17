export const loadDataAction = dispatch => data => {
  dispatch({
    type: 'load',
    payload: {
      data: {
        nodes: data.nodes,
        root: data.hierarchy.root,
      },
    },
  });
};

export const resetSelectionAction = dispatch => () => {
  dispatch({
    type: 'reset_selection',
  });
};

export const expandAllAction = dispatch => () => {
  dispatch({
    type: 'expand_all',
  });
};

export const collapseAllAction = dispatch => () => {
  dispatch({
    type: 'collapse_all',
  });
};

export const toggleStateAction = dispatch => nodeId => () => {
  dispatch({
    type: 'toggle',
    payload: { id: nodeId },
  });
};

export const setActiveRootAction = dispatch => nodeId => () => {
  dispatch({
    type: 'set_active_root',
    payload: { id: nodeId },
  });
};

export const resetActiveRootAction = dispatch => () => {
  dispatch({
    type: 'reset_active_root',
  });
};

export const selectAction = dispatch => nodeId => {
  dispatch({
    type: 'select',
    payload: {
      id:
      nodeId,
    },
  });
};
