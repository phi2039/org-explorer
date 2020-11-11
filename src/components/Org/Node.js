import React from 'react';

import { HierarchyNode } from '../Hierarchy';

import Group from './Group';
import Function from './Function';

import { useEntities } from '../../state/DataContext';
import { useOrgState } from './state';

const renderContent = (node, expand, props) => {
  if (!node) {
    return null;
  }

  if (node.type === 'group') {
    return (
      <Group
        node={node}
        collapsed={!expand}
        {...props}
      />
    );
  }

  if (node.type === 'function') {
    return (
      <Function
        node={node}
        collapsed={!expand}
        {...props}
      />
    );
  }

  return <div />; // Unknown type
};

const Node = ({ id }) => {
  const entities = useEntities();
  const org = useOrgState();

  if (!id) {
    return <td />;
  }
  const node = entities.get(id);
  if (!node) {
    return <td />;
  }

  const expand = org.isExpanded(id);

  const nodeProps = {
    toggleState: () => org.toggleNodeState(id),
    focused: org.isActiveRoot(id),
    isRoot: org.isRoot(id),
    isSelected: org.isSelected(id),
    setRoot: () => org.setActiveRoot(id),
    resetRoot: () => org.setActiveRoot(),
    onClick: () => org.setSelection(id),
    onDelete: () => entities.remove(id),
    // onAddGroup: (props) => org.addNode('group', props),
    // onAddWorkload: (props) => org.addNode('function', props),
    expand,
  };

  const content = renderContent(node, expand, nodeProps);

  return (
    <HierarchyNode key={id} content={content} expand={expand}>
      {(node.children || []).map(child => (
        <Node
          key={child.id}
          id={child.id}
        />
      ))}
    </HierarchyNode>
  );
};

export default Node;
