import React from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

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
import ResourceSummary from './common/ResourceSummary';

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

const FunctionDetail = ({
  entity,
  ...props
}) => (
  <>
    <EnhancedListGroupItem variant="light" {...props}>
      {entity.currentTotalFTE} FTE
    </EnhancedListGroupItem>
    <EnhancedListGroupItem variant="light" {...props}>
      <AccessTypes entity={entity} />
    </EnhancedListGroupItem>
  </>
);

FunctionDetail.propTypes = {
  entity: PropTypes.shape({
    currentTotalFTE: PropTypes.number,
  }).isRequired,
};

const CompactFunctionInfo = ({ entity }) => (
  <EnhancedListGroupItem variant="light">
    <ResourceSummary fte={entity.currentTotalFTE} />
  </EnhancedListGroupItem>
);

CompactFunctionInfo.propTypes = {
  entity: PropTypes.shape({
    currentTotalFTE: PropTypes.number,
  }).isRequired,
};

const Function = ({
  entity,
  viewMode,
  isSelected,
  onClick,
  onDelete,
  onEdit,
  onCut,
}) => {
  const compact = viewMode !== 'detail';
  return (
    <BaseNode onClick={onClick} onDoubleClick={onEdit}>
      <Card bg={isSelected ? 'success' : 'secondary'} text="white" style={{ width: '18rem' }}>
        <EnhancedCardBody compact={compact}>
          <EnhancedCardTitle>
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
          </EnhancedCardTitle>
        </EnhancedCardBody>
        <ListGroup className="list-group-flush">
          {(!compact || isSelected) ? <FunctionDetail entity={entity} compact={compact} /> : <CompactFunctionInfo entity={entity} />}
        </ListGroup>
      </Card>
    </BaseNode>
  );
};

Function.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    currentTotalFTE: PropTypes.number,
  }).isRequired,
  viewMode: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
};

Function.defaultProps = {
  viewMode: 'detail',
  isSelected: false,
  onClick: () => {},
  onEdit: () => {},
  onDelete: () => {},
  onCut: null,
};

export default Function;
