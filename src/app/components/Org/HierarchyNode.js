import React from 'react';
import PropTypes from 'prop-types';

import { useEntity } from './state';

import Group from './EntityNodes/GroupNode';
import Function from './EntityNodes/FunctionNode';

const HierarchyNode = ({
  isActiveRoot,
  isSelected,
  isExpanded,
  toggleState,
  setActiveRoot,
  resetActiveRoot,
  select,
}) => {
  const [entity] = useEntity();

  if (!entity) {
    return <div />;
  }

  const nodeProps = {
    entity,
    collapsed: !isExpanded,
    isRoot: !setActiveRoot,
    isSelected,
    toggleState,
    setRoot: setActiveRoot,
    focused: isActiveRoot,
    resetRoot: resetActiveRoot,
    onClick: select,
    // onDelete: nop,
    // onAddGroup: (props) => org.addNode('group', props),
    // onAddWorkload: (props) => org.addNode('function', props),
  };

  if (entity.type === 'group') {
    return <Group {...nodeProps} />;
  }

  if (entity.type === 'function') {
    return <Function {...nodeProps} />;
  }

  return <div />; // Unknown type
};

HierarchyNode.propTypes = {
  isExpanded: PropTypes.bool,
  isActiveRoot: PropTypes.bool,
  isSelected: PropTypes.bool,
  toggleState: PropTypes.func,
  setActiveRoot: PropTypes.func,
  resetActiveRoot: PropTypes.func,
  select: PropTypes.func,
};

HierarchyNode.defaultProps = {
  isExpanded: false,
  isActiveRoot: false,
  isSelected: false,
  toggleState: null,
  setActiveRoot: null,
  resetActiveRoot: null,
  select: null,
};

export default HierarchyNode;
