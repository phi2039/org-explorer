import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiMoreHorizontal,
  FiTrash2,
  FiEdit,
  FiScissors,
} from 'react-icons/fi';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ActionMenu from './ActionMenu';

import BaseNode from './BaseNode';
import AccessTypes from './common/AccessTypes';

const FunctionActionMenu = ({
  onEdit,
  onDelete,
  onCut,
}) => {
  const actions = [{
    handler: onEdit,
    name: 'edit',
    icon: <FiEdit size="1em" />,
  }, {
    handler: onDelete,
    name: 'delete',
    icon: <FiTrash2 size="1em" />,
  }];

  if (onCut) {
    actions.push({
      handler: onCut,
      name: 'cut',
      icon: <FiScissors size="1em" />,
    });
  }
  return (
    <ActionMenu
      icon={<FiMoreHorizontal size="1em" />}
      actions={actions}
    />
  );
};
FunctionActionMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
};

FunctionActionMenu.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onCut: null,
};

const Function = ({
  entity,
  isSelected,
  onClick,
  onDelete,
  onEdit,
  onCut,
}) => (
  <BaseNode onClick={onClick} onDoubleClick={onEdit}>
    <Card bg={isSelected ? 'success' : 'secondary'} text="white" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>
          <Container>
            <Row noGutters>
              <Col md="auto">
                <div style={{ width: '1.5em' }} />
              </Col>
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>{entity.description || 'No Description'}</Tooltip>}
              >
                <Col>
                  {entity.name}
                </Col>
              </OverlayTrigger>
              <Col md="auto">
                <FunctionActionMenu onEdit={onEdit} onDelete={onDelete} onCut={onCut} />
              </Col>
            </Row>
          </Container>
        </Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem variant="light">
          {entity.currentTotalFTE} FTE
        </ListGroupItem>
        <ListGroupItem variant="light">
          <AccessTypes entity={entity} />
        </ListGroupItem>
      </ListGroup>
    </Card>
  </BaseNode>
);

Function.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    currentTotalFTE: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
};

Function.defaultProps = {
  isSelected: false,
  onClick: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onCut: null,
};

export default Function;