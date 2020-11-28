import React, { useCallback } from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  FiChevronUp,
} from 'react-icons/fi';

import Toggle, { RotatingToggleIcon } from '../../Toggle';

import BaseNode from '../BaseNode';
import AccessSummary from '../common/AccessSummary';
import ResourceSummary from '../common/ResourceSummary';

import Focus from './Focus';
import GroupActionMenu from './GroupActionMenu';

const EnhancedCardBody = styled(Card.Body)`
  padding-left: 0;
  padding-right: 0;

  ${({ compact }) => compact && `
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  `}
`;

const EnhancedCardTitle = styled(Card.Title)`
  margin-bottom: 0;
`;

const EnhancedListGroupItem = styled(ListGroupItem)`
  ${({ compact }) => compact && `
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  `}
  ${({ activeHover }) => activeHover && `
    cursor: pointer;
    :hover {
      background-color: rgba(255,255,255,0.90);
    }
  `}
`;

const GroupHeader = ({
  entity,
  isRoot,
  focused,
  setRoot,
  resetRoot,
  onDelete,
  onEdit,
  onCut,
  onPaste,
  onAddGroup,
  onAddWorkload,
  ...props
}) => (
  <>
    {entity.manager ? <Card.Header>{entity.manager}</Card.Header> : null}
    <EnhancedCardBody {...props}>
      <EnhancedCardTitle>
        <Container>
          <Row noGutters>
            <Col md="auto">
              {
                isRoot
                  ? <div style={{ width: '1.5em' }} />
                  : <Focus focused={focused} set={setRoot} reset={resetRoot} />
              }
            </Col>
            <Col>
              {entity.name}
            </Col>
            <Col md="auto">
              <GroupActionMenu onEdit={onEdit} onDelete={onDelete} onAddGroup={onAddGroup} onAddWorkload={onAddWorkload} onCut={onCut} onPaste={onPaste} />
            </Col>
          </Row>
        </Container>
      </EnhancedCardTitle>
    </EnhancedCardBody>

  </>
);

GroupHeader.propTypes = {
  entity: PropTypes.shape({
    manager: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  isRoot: PropTypes.bool,
  focused: PropTypes.bool,
  setRoot: PropTypes.func,
  resetRoot: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onCut: PropTypes.func,
  onPaste: PropTypes.func,
  onAddGroup: PropTypes.func,
  onAddWorkload: PropTypes.func,
};

GroupHeader.defaultProps = {
  isRoot: false,
  focused: false,
  setRoot: null,
  resetRoot: null,
  onDelete: null,
  onEdit: null,
  onCut: null,
  onPaste: null,
  onAddGroup: null,
  onAddWorkload: null,
};

const GroupSummary = ({
  entity,
  ...props
}) => (
  <EnhancedListGroupItem variant="light" {...props}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ backgroundColor: 'powderblue' }}>
        {entity.currentTotalFTE} FTE - {entity.currentTotalOverhead} OH ({(100 * entity.currentTotalOverhead / (entity.currentTotalFTE || 1)).toFixed(0)}%)
      </div>
      <div>
        {entity.currentTotalWorkloads} Workloads
      </div>
      <div style={{
        border: '1px solid gray',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
        >
          <span className="text-center">{(entity.currentTotalFTE / (entity.currentTotalWorkloads || 1)).toFixed(1)} FTE / WL</span>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          borderLeft: '1px solid gray',
        }}
        >
          <span className="text-center">{(entity.currentTotalFTE / (entity.currentTotalOverhead || 1)).toFixed(1)} FTE / OH</span>
        </div>
      </div>
    </div>
  </EnhancedListGroupItem>
);

GroupSummary.propTypes = {
  entity: PropTypes.shape({
    currentTotalFTE: PropTypes.number,
    currentTotalOverhead: PropTypes.number,
    currentTotalWorkloads: PropTypes.number,
  }).isRequired,
};

const GroupFeatureStatistics = ({ entity, ...props }) => (
  <EnhancedListGroupItem variant="light" {...props}>
    <AccessSummary entity={entity} />
  </EnhancedListGroupItem>
);

GroupFeatureStatistics.propTypes = {
  entity: PropTypes.shape({}).isRequired,
};

const GroupDetail = ({ entity, ...props }) => (
  <>
    <GroupSummary entity={entity} {...props} />
    <GroupFeatureStatistics entity={entity} {...props} />
  </>
);

GroupDetail.propTypes = {
  entity: PropTypes.shape({}).isRequired,
};

const CompactGroupInfo = ({ entity }) => (
  <EnhancedListGroupItem variant="light">
    <ResourceSummary fte={entity.currentTotalFTE} workloads={entity.currentTotalWorkloads} />
  </EnhancedListGroupItem>
);

CompactGroupInfo.propTypes = {
  entity: PropTypes.shape({
    currentTotalFTE: PropTypes.number,
    currentTotalWorkloads: PropTypes.number,
  }).isRequired,
};

const GroupToggle = ({
  toggleState,
  collapsed,
  ...props
}) => (
  <EnhancedListGroupItem variant="light" activeHover onClick={toggleState} {...props}>
    <Container>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Toggle state={!collapsed} tooltip="Toggle Children">
          <RotatingToggleIcon>
            <FiChevronUp size="2em" />
          </RotatingToggleIcon>
        </Toggle>
      </Row>
    </Container>
  </EnhancedListGroupItem>
);

GroupToggle.propTypes = {
  toggleState: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
};

GroupToggle.defaultProps = {
  collapsed: true,
};

const Group = ({
  entity,
  viewMode,
  toggleState,
  collapsed,
  isSelected,
  onCreateChild,
  onClick,
  onEdit,
  ...headerProps
}) => {
  const onAddGroup = useCallback(values => onCreateChild('group', values), [onCreateChild]);
  const onAddWorkload = useCallback(values => onCreateChild('function', values), [onCreateChild]);

  const compact = viewMode !== 'detail';

  return (
    <BaseNode onClick={onClick} onDoubleClick={onEdit}>
      <Card bg={isSelected ? 'success' : 'primary'} text="white" style={{ width: '18rem' }}>
        <GroupHeader entity={entity} isSelected={isSelected} onEdit={onEdit} onAddGroup={onAddGroup} onAddWorkload={onAddWorkload} compact={compact} {...headerProps} />
        <ListGroup variant="flush">
          {(!compact || isSelected) ? <GroupDetail entity={entity} compact={compact} /> : <CompactGroupInfo entity={entity} />}
          <GroupToggle toggleState={toggleState} collapsed={collapsed} compact={compact} />
        </ListGroup>
      </Card>
    </BaseNode>
  );
};

Group.propTypes = {
  entity: PropTypes.shape({}).isRequired,
  viewMode: PropTypes.string,
  toggleState: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
  isSelected: PropTypes.bool,
  onCreateChild: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
};

Group.defaultProps = {
  viewMode: 'detail',
  collapsed: true,
  isSelected: false,
  onCreateChild: null,
  onClick: null,
  onEdit: null,
};

export default Group;
