import React from 'react';
import { PropTypes } from 'prop-types';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import BaseNode from './BaseNode';
import AccessTypes from './common/AccessTypes';

const Function = ({ entity, isSelected, onClick }) => (
  <BaseNode onClick={onClick}>
    <Card bg="secondary" text="white" style={{ width: '18rem', borderWidth: isSelected ? 3 : null }}>
      <Card.Body>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>{entity.description || 'No Description'}</Tooltip>}
        >
          <Card.Title>{entity.name}</Card.Title>
        </OverlayTrigger>
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

export default Function;
