import React, {
  useEffect,
  useCallback,
} from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import IndianaScrollContainer from 'react-indiana-drag-scroll';

import Hierarchy, { HierarchyProvider, useHierarchyState, useHierarchyDispatch } from '../Hierarchy';
import {
  loadDataAction,
  expandAllAction,
  collapseAllAction,
  resetActiveRootAction,
} from '../Hierarchy/actions';

import ZoomContainer, { useZoom } from '../common/ZoomContainer';

import Menu from './Menu';

import { ActionProvider } from './state';

import Node from './Nodes/BaseNode';
import Group from './Nodes/GroupNode';
import Function from './Nodes/FunctionNode';

import GroupForm from './Forms/GroupForm';
import FunctionForm from './Forms/FunctionForm';

import OrgNode from './OrgNode';

import ModalActions from './ModalActions';

import { metrics, measures } from './metrics';
import FullPageSpinner from '../common/FullPageSpinner';
import { usePersistenceDispatch, usePersistenceState, mutateAction } from '../../state/PersistenceContext';

const Workspace = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ScrollContainer = styled(IndianaScrollContainer)`
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
  cursor: grab;
  border: solid 1px #aaa;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

const FocusHeaderContainer = styled.div`
  height: ${({ height = '2.5rem' }) => height};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(173, 205, 235, 0.5);
  font-weight: 600;
  border-top: solid 1px #aaa;
`;

const modalActionForms = {
  group: {
    edit: GroupForm,
    create: GroupForm,
  },
  function: {
    edit: FunctionForm,
    create: FunctionForm,
  },
};

export const reduceHierarchyData = (entities) => {
  // console.log('reduce hierarchy data');
  const [root] = Object.entries(entities).find(
    ([, { parent }]) => !parent,
  );

  const nodes = Object.entries(entities).reduce((acc, [id, { type, children }]) => ({
    ...acc,
    [id]: {
      id,
      subjectId: id,
      type,
      children,
    },
  }), []);

  return {
    nodes,
    hierarchy: {
      root,
    },
  };
};

const FocusHeader = ({ children }) => (
  <FocusHeaderContainer>
    {children}
  </FocusHeaderContainer>
);

const Org = ({
  ...props
}) => {
  const { cache: { entities }, isLoading } = usePersistenceState();
  const persistenceDispatch = usePersistenceDispatch();

  const { hierarchy: { activeRoot, root } } = useHierarchyState();
  const hierarchyDispatch = useHierarchyDispatch();

  const loadHierarchyData = useCallback(loadDataAction(hierarchyDispatch), [hierarchyDispatch]);

  useEffect(() => {
    if (Object.keys(entities).length) {
      loadHierarchyData(reduceHierarchyData(entities));
    }
  }, [entities, loadHierarchyData]);

  const {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
  } = useZoom();

  const resetFocus = useCallback(
    (root !== activeRoot)
      ? resetActiveRootAction(hierarchyDispatch)
      : null,
    [hierarchyDispatch],
  );

  const isFocused = root !== activeRoot;

  const expandAll = useCallback(expandAllAction(hierarchyDispatch), [hierarchyDispatch]);
  const collapseAll = useCallback(collapseAllAction(hierarchyDispatch), [hierarchyDispatch]);

  const mutate = useCallback(mutateAction(persistenceDispatch));

  const commitChanges = useCallback((action, subject, values) => {
    if (action === 'create') {
      mutate({ create: [{ ...subject, ...values }] });
    } else if (action === 'edit') {
      mutate({ update: [{ id: subject.id, values }] });
    }
  }, [mutate]);

  if (isLoading) {
    return (
      <FullPageSpinner caption="Loading" />
    );
  }

  return (
    <Workspace {...props}>
      <ModalActions forms={modalActionForms} commitChanges={commitChanges} />
      <Menu
        actions={{
          collapseAll,
          expandAll,
          zoomIn,
          zoomOut,
          resetFocus,
        }}
        offsetTop={isFocused ? '2.5rem' : 0}
      />
      {isFocused && (
        <FocusHeader>
          <span>{[activeRoot, ...entities[activeRoot].ancestors].reverse().map(id => entities[id].name).join(' -> ')}</span>
        </FocusHeader>
      )}
      <ScrollContainer hideScrollbars={false}>
        <ZoomContainer zoom={zoom} setZoom={setZoom}>
          <Hierarchy render={(node, nodeProps) => (
            <OrgNode
              node={node}
              components={{
                group: Group,
                function: Function,
                default: Node,
              }}
              metrics={metrics}
              measures={measures}
              {...nodeProps}
            />
          )}
          />
        </ZoomContainer>
      </ScrollContainer>
    </Workspace>
  );
};

export default ({ ...props }) => (
  <HierarchyProvider>
    <ActionProvider>
      <Org {...props} />
    </ActionProvider>
  </HierarchyProvider>
);
