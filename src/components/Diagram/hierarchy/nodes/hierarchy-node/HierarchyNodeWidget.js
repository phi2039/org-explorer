import React from 'react';
import styled from 'styled-components';
import {
  color,
  layout,
  space,
  border,
} from 'styled-system';

import { HierarchyPortWidget } from '../../ports/hierarchy-port/HierarchyPortWidget';

const HierarchyNode = styled.div`
  ${color}
  ${layout}
  ${space}
  ${border}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

HierarchyNode.defaultProps = {
  backgroundColor: 'aliceblue',
  width: '64px',
  height: '64px',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderRadius: '5px',
  borderColor: 'gray',
};

const NodeContent = styled.div`
  ${color}
  ${layout}
  ${space}
  ${border}
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

NodeContent.defaultProps = {
  width: '20px',
  height: '20px',
  borderRadius: '10px',
};

const GroupNode = ({ engine, node }) => {
  return (
    <HierarchyNode>
      {node.getPort('Parent') && <HierarchyPortWidget engine={engine} port={node.getPort('Parent')} />}
      {node.getOptions().name}
      {/* <div>

      </div> */}
      {/* <NodeContent bg={node.color} /> */}
      {node.getPort('Children') && <HierarchyPortWidget engine={engine} port={node.getPort('Children')} />}
    </HierarchyNode>
  );
};

const FunctionNode = ({ engine, node }) => (
  <HierarchyNode>
    {node.getPort('Parent') && <HierarchyPortWidget engine={engine} port={node.getPort('Parent')} />}
    <NodeContent bg={node.color} />
  </HierarchyNode>
);

export const HierarchyNodeWidget = ({ engine, node }) => {
  const Node = node.orgType === 'group' ? GroupNode : FunctionNode;
  return <Node engine={engine} node={node} />;
};

export default HierarchyNodeWidget;
