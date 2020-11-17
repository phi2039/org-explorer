import React from 'react';
import PropTypes from 'prop-types';

import Group from './EntityNodes/GroupNode';
import Function from './EntityNodes/FunctionNode';

const HierarchyNode = ({
  entity,
  isActiveRoot,
  isSelected,
  isExpanded,
  toggleState,
  setActiveRoot,
  resetActiveRoot,
  select,
  onEdit,
  onDelete,
}) => {
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
    onEdit,
    onDelete,
    // onAddGroup: nop,
    // onAddWorkload: nop,
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
  entity: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool,
  isActiveRoot: PropTypes.bool,
  isSelected: PropTypes.bool,
  toggleState: PropTypes.func,
  setActiveRoot: PropTypes.func,
  resetActiveRoot: PropTypes.func,
  select: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

HierarchyNode.defaultProps = {
  isExpanded: false,
  isActiveRoot: false,
  isSelected: false,
  toggleState: null,
  setActiveRoot: null,
  resetActiveRoot: null,
  select: null,
  onEdit: null,
  onDelete: null,
};

export default HierarchyNode;
