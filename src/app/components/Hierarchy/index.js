import React, { useCallback, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import {
  useHierarchyDispatch,
  useHierarchyState,
} from './state';

const Table = styled.table`
  border-collapse: collapse;
  border: none;
  margin: 0 auto;
`;

const Cell = styled.td`
  padding: 0;
`;

const NodeLineContainer = styled(Table)`
  width: 100%;
  /* border: 1px solid yellow; */
`;

const NodeGroupLineNone = styled(Cell).attrs(() => ({ colSpan: 2 }))``;

const NodeGroupLineVerticalMiddle = styled(NodeGroupLineNone)`
  height: 25px;
  width: 50%;
  border-right: 2px solid #000;
`;

const NodeLineBorderTop = styled(NodeGroupLineNone)`
  border-top: solid 2px #000;
`;

const NodeLineBorderTopAndMiddle = styled(NodeGroupLineVerticalMiddle)`
  border-top: solid 2px #000;
`;

const NodeLineBelow = ({ span }) => (
  <Cell colSpan={span}>
    <NodeLineContainer>
      <tbody>
        <tr>
          <NodeGroupLineVerticalMiddle />
          <NodeGroupLineNone />
        </tr>
      </tbody>
    </NodeLineContainer>
  </Cell>
);

NodeLineBelow.propTypes = {
  span: PropTypes.number.isRequired,
};

const hasSiblingRight = (childrenCount, childIndex) => childIndex < childrenCount - 1;

const hasSiblingLeft = (childIndex) => childIndex > 0;

const toggleStateAction = (nodeId, dispatch) => () => {
  dispatch({
    type: 'toggle',
    payload: { id: nodeId },
  });
};

const setActiveRootAction = (nodeId, dispatch) => () => {
  dispatch({
    type: 'set_active_root',
    payload: { id: nodeId },
  });
};

const resetActiveRootAction = (dispatch) => () => {
  dispatch({
    type: 'reset_active_root',
  });
};

const selectAction = (nodeId, dispatch) => (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  }
  dispatch({
    type: 'select',
    payload: { id: nodeId },
  });
};

const ChildrenLinesAbove = ({ span }) => Array.from({ length: span / 2 }, (v, childIndex) => (
  <Cell colSpan={2} key={childIndex}>
    <NodeLineContainer>
      <tbody>
        <tr>
          {hasSiblingLeft(childIndex) ? (
            <NodeLineBorderTopAndMiddle />
          ) : (
            <NodeGroupLineVerticalMiddle />
          )}
          {hasSiblingRight(span / 2, childIndex) ? (
            <NodeLineBorderTop />
          ) : (
            <NodeGroupLineNone />
          )}
        </tr>
      </tbody>
    </NodeLineContainer>
  </Cell>
));

const NodeGroup = styled(Cell).attrs(() => ({ colSpan: 2 }))`
  vertical-align: top;
`;

const NodeContainer = styled(Table)``;

const HierarchyNodeContentContainer = styled(Cell)`
  text-align: center;
  width: 50%;
  /* border: 1px solid green; */
`;

const HierarchyNode = ({ nodeId, render }) => {
  const { nodes, hierarchy } = useHierarchyState();
  const dispatch = useHierarchyDispatch();

  const [node, setNode] = useState(nodes[nodeId]);

  useEffect(() => {
    setNode(nodes[nodeId]);
  }, [nodes, nodeId]);

  const renderChildren = useCallback(
    (children) => {
      const span = children.length * 2;
      if (node.state.expanded) {
        return (
          <>
            <tr>
              <NodeLineBelow span={span} />
            </tr>
            <tr>
              <ChildrenLinesAbove span={span} />
            </tr>
            <tr>
              {children.map(child => (
                <HierarchyNode key={child} nodeId={child} render={render} />
              ))}
            </tr>
          </>
        );
      }
      return null;
    },
    [node.state.expanded, render],
  );

  const toggleState = useCallback(toggleStateAction(nodeId, dispatch), [nodeId, dispatch]);
  const setActiveRoot = useCallback(setActiveRootAction(nodeId, dispatch), [nodeId, dispatch]);
  const resetActiveRoot = useCallback(resetActiveRootAction(dispatch), [dispatch]);
  const select = useCallback(selectAction(nodeId, dispatch), [nodeId, dispatch]);

  const span = (node.children || []).length * 2;

  if (!node) {
    return <div>TODO: User Error Boundary</div>;
  }

  return (
    <NodeGroup>
      <NodeContainer>
        <tbody>
          <tr>
            <HierarchyNodeContentContainer colSpan={span}>
              {render({
                node,
                isExpanded: node.state.expanded,
                isActiveRoot: hierarchy.activeRoot === node.id,
                isSelected: hierarchy.selection === node.id,
                toggleState,
                setActiveRoot: hierarchy.root !== node.id ? setActiveRoot : null,
                resetActiveRoot,
                select,
              })}
            </HierarchyNodeContentContainer>
          </tr>
          {span && node.state.expanded ? renderChildren(node.children) : null}
        </tbody>
      </NodeContainer>
    </NodeGroup>
  );
};

HierarchyNode.propTypes = {
  nodeId: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

// TODO: Modify outer container to allow this to fill the view (so deselect works everywhere)
const RootContainer = styled.div`
  margin: 2px;
  padding: 1em;

  table: {
    border-collapse: collapse;
    border: none;
    margin: 0 auto;
  }
`;

const resetSelectionAction = (dispatch) => () => {
  dispatch({
    type: 'reset_selection',
  });
};

const expandAllAction = (dispatch) => () => {
  dispatch({
    type: 'expand_all',
  });
};

const collapseAllAction = (dispatch) => () => {
  dispatch({
    type: 'collapse_all',
  });
};

const DebugControls = () => {
  const dispatch = useHierarchyDispatch();
  const expandAll = useCallback(expandAllAction(dispatch), [dispatch]);
  const collapseAll = useCallback(collapseAllAction(dispatch), [dispatch]);

  return (
    <div style={{ position: 'absolute', left: 300, bottom: 0 }}>
      <button type="button" onClick={expandAll}>Expand All</button>
      <button type="button" onClick={collapseAll}>Collapse All</button>
    </div>
  );
};

const Hierarchy = ({ render }) => {
  const {
    hierarchy: { activeRoot, root },
  } = useHierarchyState();
  const dispatch = useHierarchyDispatch();

  const resetSelection = useCallback(resetSelectionAction(dispatch), [dispatch]);
  if (!root && !activeRoot) {
    return null;
  }

  return (
    <RootContainer onClick={resetSelection}>
      <Table>
        <tbody>
          <tr>
            <HierarchyNode nodeId={activeRoot || root} render={render} />
          </tr>
        </tbody>
      </Table>
      {/* <DebugControls /> */}
    </RootContainer>
  );
};

Hierarchy.propTypes = {
  render: PropTypes.func.isRequired,
};

export default Hierarchy;
export { HierarchyProvider, useHierarchyDispatch, useHierarchyState } from './state';
