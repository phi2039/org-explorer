import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import IndianaScrollContainer from 'react-indiana-drag-scroll';

import Hierarchy, { HierarchyProvider, useHierarchyState, useHierarchyDispatch } from '../Hierarchy';

import ZoomContainer from '../ZoomContainer';

import Menu from './Menu';
import HierarchyNode from './HierarchyNode';

import { useEntities } from '../../state/DataContext';
import { EntityProvider, useEntity } from './state';

import { splitNodes, reduceData } from './data';

const EntityNodeContainer = ({ id, children }) => {
  const entities = useEntities();
  const [, setEntity] = useEntity();

  useEffect(() => {
    const e = entities.get(id);
    setEntity(e);
  }, [entities, id, setEntity]);

  return children;
};

EntityNodeContainer.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const renderOrgNode = ({ node, ...props }) => {
  const { entityId } = node;
  return (
    <EntityProvider>
      <EntityNodeContainer id={entityId}>
        <HierarchyNode {...props} />
      </EntityNodeContainer>
    </EntityProvider>
  );
};

const Workspace = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
`;

const ScrollContainer = styled(IndianaScrollContainer)`
  overflow: hidden;
  height: 100vh;
  width: 100%;
  cursor: grab;
  border: solid 1px #aaa;
`;

const loadDataAction = dispatch => data => {
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

const resetActiveRootAction = (dispatch) => () => {
  dispatch({
    type: 'reset_active_root',
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

const Org = ({
  ...props
}) => {
  const entities = useEntities();
  const {
    hierarchy: { activeRoot, root },
  } = useHierarchyState();
  const hierarchyDispatch = useHierarchyDispatch();

  const loadHierarchyData = useCallback(loadDataAction(hierarchyDispatch), [hierarchyDispatch]);

  useEffect(() => {
    const { nodes = {} } = entities.getAll();
    if (Object.keys(nodes).length) {
      const data = splitNodes(nodes);
      const reduced = reduceData(data);
      loadHierarchyData(reduced);
    }
  }, [entities, loadHierarchyData]);

  const [zoom, setZoom] = useState(1.0);
  const zoomIncrement = 0.1;
  const zoomIn = () => setZoom(level => Math.min(2, level + zoomIncrement));
  const zoomOut = () => setZoom(level => Math.max(zoomIncrement, level - zoomIncrement));

  const resetFocus = useCallback(
    (root !== activeRoot)
      ? resetActiveRootAction(hierarchyDispatch)
      : null,
    [hierarchyDispatch],
  );
  const expandAll = useCallback(expandAllAction(hierarchyDispatch), [hierarchyDispatch]);
  const collapseAll = useCallback(collapseAllAction(hierarchyDispatch), [hierarchyDispatch]);

  return (
    <Workspace {...props}>
      <Menu actions={{
        collapseAll,
        expandAll,
        zoomIn,
        zoomOut,
        resetFocus,
      }}
      />
      <ScrollContainer hideScrollbars={false}>
        <ZoomContainer zoom={zoom} setZoom={setZoom}>
          <Hierarchy render={renderOrgNode} />
        </ZoomContainer>
      </ScrollContainer>
    </Workspace>
  );
};

export default ({ ...props }) => (
  <HierarchyProvider>
    <Org {...props} />
  </HierarchyProvider>
);
