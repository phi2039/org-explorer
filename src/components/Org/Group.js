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
  FiMoreHorizontal,
  FiFolderPlus,
  FiFilePlus,
  FiTrash2,
} from 'react-icons/fi';

import { Planet } from 'react-planet';

import Focus from './Focus';
import Toggle from './Toggle';

import BaseNode from './Base';

import AccessSummary from './AccessSummary';

const PopupMenuButton = styled.div`
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;

    :hover {
      background: #020958;
    }
`;

const PopupActionButton = styled.div`
    height: 1.5em;
    width: 1.5em;
    color: #020958;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.14), 0 2px 4px rgba(0, 0, 0, 0.28);

    :hover {
      background: #020958;
      color: white;
      border-style: solid;
      border-width: 1px;
      border-color: transparent;
    }
`;

const PopupMenu = ({
  onDelete,
  onAddGroup,
  onAddWorkload,
}) => {
  return (
    <div style={{ width: '1.5em' }}>
      <Planet
        centerContent={<PopupMenuButton><FiMoreHorizontal size="1em" /></PopupMenuButton>}
        // open={open}
        hideOrbit
        autoClose
        orbitRadius={45}
        rotation={190}
      >
        <PopupActionButton onClick={onDelete}><FiTrash2 size="1em" /></PopupActionButton>
        <PopupActionButton onClick={onAddGroup}><FiFolderPlus size="1em" /></PopupActionButton>
        <PopupActionButton onClick={onAddWorkload}><FiFilePlus size="1em" /></PopupActionButton>
        <div />
        <div />
        <div />
        <div />
      </Planet>
    </div>
  );
};

const ToggleItem = styled(ListGroupItem)`
  cursor: pointer;
  :hover {
    background-color: rgba(255,255,255,0.90);
  }
`;

const Group = ({
  node,
  toggleState,
  collapsed,
  focused,
  isRoot,
  // isSelected,
  setRoot,
  resetRoot,
  // onClick,
  onDelete,
  onAddGroup,
  onAddWorkload,
  // onCut,
  // onPaste,
}) => (
  // <BaseNode onClick={onClick}>
  <BaseNode>
    <Card bg="primary" text="white" style={{ width: '18rem' }}>
      {node.manager ? <Card.Header>{node.manager}</Card.Header> : null}
      <Card.Body style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Card.Title>
          <Container>
            <Row>
              <Col md="auto">
                {isRoot ? <div style={{ width: '1.5em' }} /> : <Focus focused={focused} set={setRoot} reset={resetRoot} />}
              </Col>
              <Col>
                {node.name}
              </Col>
              <Col md="auto">
                <PopupMenu onDelete={onDelete} onAddGroup={onAddGroup} onAddWorkload={onAddWorkload} />
              </Col>
            </Row>
          </Container>
        </Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem variant="light">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ backgroundColor: 'powderblue' }}>
              {node.currentTotalFTE} FTE - {node.currentTotalOverhead} OH ({(100 * node.currentTotalOverhead / (node.currentTotalFTE || 1)).toFixed(0)}%)
            </div>
            <div>
              {node.currentTotalWorkloads} Workloads
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
                <span className="text-center">{(node.currentTotalFTE / (node.currentTotalWorkloads || 1)).toFixed(1)} FTE / WL</span>
              </div>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                borderLeft: '1px solid gray',
              }}
              >
                <span className="text-center">{(node.currentTotalFTE / (node.currentTotalOverhead || 1)).toFixed(1)} FTE / OH</span>
              </div>
            </div>
          </div>
        </ListGroupItem>
        <ListGroupItem variant="light">
          <AccessSummary node={node} />
        </ListGroupItem>
        <ToggleItem variant="light" onClick={toggleState}>
          <Container>
            <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Toggle collapsed={collapsed} />
            </Row>
          </Container>
        </ToggleItem>
      </ListGroup>
    </Card>
  </BaseNode>
);

export default Group;
