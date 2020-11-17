import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import IndianaScrollContainer from 'react-indiana-drag-scroll';

import { toTitleCase } from '../../../lib/util/strings';

import Hierarchy, { HierarchyProvider, useHierarchyState, useHierarchyDispatch } from '../Hierarchy';
import {
  loadDataAction,
  expandAllAction,
  collapseAllAction,
  resetActiveRootAction,
} from '../Hierarchy/actions';

import ZoomContainer from '../ZoomContainer';

import Menu from './Menu';
import HierarchyNode from './HierarchyNode';

import {
  useEntityState,
  useEntityDispatch,
  deleteEntityAction,
  patchEntityAction,
} from '../../state/EntityContext';

import { splitNodes, reduceData } from './data';

import { ActionProvider, useActionState, useActionDispatch } from './state';

import ModalForm from './ModalForm';

import FullPageSpinner from './FullPageSpinner';

import GroupForm from './Forms/GroupForm';
import FunctionForm from './Forms/FunctionForm';

import {
  beginActionAction,
  cancelActionAction,
  beginCommitAction,
  endCommitAction,
} from './actions';

import Query from './query';
import { aggregate, compute } from './analytics';
import { metrics, measures } from './metrics';

// TODO: Split into individual steps/stages (see: redux-thunk)
const commitActionThunk = (entityDispatch, values) => async (dispatch, getState) => {
  beginCommitAction(dispatch)();

  const { subject } = getState();
  patchEntityAction(entityDispatch)(subject, values);

  endCommitAction(dispatch)(values);
};

const commitActionAction = (actionDispatch, entityDispatch) => values => {
  actionDispatch(commitActionThunk(entityDispatch, values));
};

const renderEntityForm = entity => {
  if (entity.type === 'group') {
    return <GroupForm entity={entity} />;
  }
  if (entity.type === 'function') {
    return <FunctionForm entity={entity} />;
  }

  throw new Error('unknown entity type');
};

const EntityContainer = ({
  id,
  Component,
  ...props
}) => {
  const { entities } = useEntityState();
  const [entity, setEntity] = useState(entities.nodes && entities.nodes[id]);

  const actionDispatch = useActionDispatch();
  const entityDispatch = useEntityDispatch();

  const onEdit = useCallback(() => beginActionAction(actionDispatch)('edit', entity), [actionDispatch, entity]);
  const onDelete = useCallback(() => deleteEntityAction(entityDispatch)(entity.id), [entityDispatch, entity]);

  useEffect(() => {
    setEntity(entities.nodes && entities.nodes[id]);
  }, [entities, id]);

  const handlers = {
    onEdit,
    onDelete,
  };

  const descendants = useMemo(() => Query(entities).getDescendants(entity.id).map(d => entities.nodes[d.id]), [entity, entities]);
  // console.log('descendants', descendants);

  const aggregates = useMemo(() => {
    const result = aggregate(metrics, [entity, ...descendants]);
    // console.log('aggregates', result);
    return result;
  }, [descendants, entity]);

  const computed = useMemo(() => {
    const result = compute(measures, { ...entity, ...aggregates });
    console.log('computed', result);
    return result;
  }, [entity, aggregates]);

  if (!entity) {
    return null;
  }

  return <Component entity={{ ...entity, ...aggregates, ...computed }} {...handlers} {...props} />;
};

EntityContainer.propTypes = {
  id: PropTypes.string.isRequired,
  Component: PropTypes.elementType.isRequired,
};

const renderOrgNode = ({ node, ...props }) => {
  const { entityId } = node;
  return <EntityContainer id={entityId} Component={HierarchyNode} {...props} />;
};

// const forms = {
//   group: GroupForm,
// };

const EntityActions = () => {
  const { action, subject, isCommitting } = useActionState();
  const actionDispatch = useActionDispatch();
  const entityDispatch = useEntityDispatch();

  const closeModal = useCallback(cancelActionAction(actionDispatch), [actionDispatch]);
  const isModalShowing = !!action;
  const commitChanges = useCallback(commitActionAction(actionDispatch, entityDispatch), [actionDispatch, entityDispatch]);

  const formatTitle = (s, a) => `${toTitleCase(a)}${s ? ` ${toTitleCase(s.type)}` : ''}`;

  if (isCommitting) {
    return (
      <FullPageSpinner caption="Saving" />
    );
  }

  return (
    // <ModalForm forms={forms} formName="group" formMode="create" isShowing={isModalShowing} onCancel={closeModal} onSubmit={commitChanges} title="Something important" commitText="Save" />
    <ModalForm formMode={action} isShowing={isModalShowing} onCancel={closeModal} onSubmit={commitChanges} title={formatTitle(subject, action)} commitText="Save">
      {isModalShowing && renderEntityForm(subject)}
    </ModalForm>
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

const Org = ({
  ...props
}) => {
  const { entities } = useEntityState();

  const { hierarchy: { activeRoot, root } } = useHierarchyState();
  const hierarchyDispatch = useHierarchyDispatch();

  const loadHierarchyData = useCallback(loadDataAction(hierarchyDispatch), [hierarchyDispatch]);

  useEffect(() => {
    const { nodes = {} } = entities;
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
      <EntityActions />
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
    <ActionProvider>
      <Org {...props} />
    </ActionProvider>
  </HierarchyProvider>
);
