import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import {
  useHierarchyDispatch,
  useHierarchyState,
} from './state';

import {
  resetSelectionAction,
  expandAllAction,
  collapseAllAction,
  toggleStateAction,
  setActiveRootAction,
  resetActiveRootAction,
  selectAction,
} from './actions';

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

const selectHandler = dispatch => nodeId => {
  const select = selectAction(dispatch);
  select(nodeId);
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
      if (!node) {
        return null;
      }
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
    [node, render],
  );

  const isSelected = node && (hierarchy.selection === node.id);
  const toggleState = useCallback(toggleStateAction(dispatch)(nodeId), [nodeId, dispatch]);
  const setActiveRoot = useCallback(setActiveRootAction(dispatch)(nodeId), [nodeId, dispatch]);
  const resetActiveRoot = useCallback(resetActiveRootAction(dispatch), [dispatch]);
  const select = useCallback(() => !isSelected && selectHandler(dispatch)(nodeId), [isSelected, nodeId, dispatch]);

  if (!node) {
    return (
      <td>
        <div>TODO: Use Error Boundary</div>
      </td>
    );
  }

  const span = (node.children || []).length * 2;

  return (
    <NodeGroup>
      <NodeContainer>
        <tbody>
          <tr>
            <HierarchyNodeContentContainer colSpan={span}>
              {render(node, {
                isExpanded: node.state.expanded,
                isActiveRoot: hierarchy.activeRoot === node.id,
                isSelected,
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
    hierarchy: { activeRoot, root, selection },
  } = useHierarchyState();
  const dispatch = useHierarchyDispatch();

  const resetSelection = useCallback(selection ? resetSelectionAction(dispatch) : null, [dispatch]);
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
