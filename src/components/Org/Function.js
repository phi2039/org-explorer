import React from 'react';
import { PropTypes } from 'prop-types';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import AccessTypes from './AccessTypes';

const Function = ({ node, isSelected, onClick }) => (
  <BaseNode onClick={onClick}>
    <Card bg="secondary" text="white" style={{ width: '18rem', borderWidth: isSelected ? 3 : null }}>
      <Card.Body>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>{node.description || 'No Description'}</Tooltip>}
        >
          <Card.Title>{node.name}</Card.Title>
        </OverlayTrigger>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem variant="light">
          {node.currentTotalFTE} FTE
        </ListGroupItem>
        <ListGroupItem variant="light">
          <AccessTypes node={node} />
        </ListGroupItem>
      </ListGroup>
    </Card>
  </BaseNode>
);

export default Function;
