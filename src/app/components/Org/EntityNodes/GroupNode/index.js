import React from 'react';
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

import Focus from './Focus';
import GroupActionMenu from './GroupActionMenu';

const ActiveHoverListGroupItem = styled(ListGroupItem)`
  cursor: pointer;
  :hover {
    background-color: rgba(255,255,255,0.90);
  }
`;

const Group = ({
  entity,
  toggleState,
  collapsed,
  focused,
  isRoot,
  isSelected,
  setRoot,
  resetRoot,
  onClick,
  onDelete,
  onEdit,
  onAddGroup,
  onAddWorkload,
  // onCut,
  // onPaste,
}) => (
  <BaseNode onClick={onClick}>
    <Card bg={isSelected ? 'success' : 'primary'} text="white" style={{ width: '18rem' }}>
      {entity.manager ? <Card.Header>{entity.manager}</Card.Header> : null}
      <Card.Body style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Card.Title>
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
                <GroupActionMenu onEdit={onEdit} onDelete={onDelete} onAddGroup={onAddGroup} onAddWorkload={onAddWorkload} />
              </Col>
            </Row>
          </Container>
        </Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem variant="light">
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
                justifyContent: 'center'
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
        </ListGroupItem>
        <ListGroupItem variant="light">
          <AccessSummary entity={entity} />
        </ListGroupItem>
        <ActiveHoverListGroupItem variant="light" onClick={toggleState}>
          <Container>
            <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Toggle state={!collapsed} tooltip="Toggle Children">
                <RotatingToggleIcon>
                  <FiChevronUp size="2em" />
                </RotatingToggleIcon>
              </Toggle>
            </Row>
          </Container>
        </ActiveHoverListGroupItem>
      </ListGroup>
    </Card>
  </BaseNode>
);

export default Group;
