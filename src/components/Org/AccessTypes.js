import React from 'react';
import { PropTypes } from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  FaHospital,
  FaDonate,
  FaFingerprint,
} from 'react-icons/fa';

const hasAccessData = node => (node.payerFacing === 'Yes' || node.providerFacing === 'Yes' || node.requiresPHI === 'Yes');
const AccessTypes = ({ node }) => hasAccessData(node)
  ? (
    <Container>
      <Row>
        {
        node.payerFacing === 'Yes'
          ? (
            <Col>
              <OverlayTrigger placement="left" overlay={<Tooltip>Payer Facing</Tooltip>}>
                <FaDonate style={{ margin: 5 }} />
              </OverlayTrigger>
            </Col>
          )
          : null
        }
        {
        node.providerFacing === 'Yes'
          ? (
            <Col>
              <OverlayTrigger placement="left" overlay={<Tooltip>Provider Facing</Tooltip>}>
                <FaHospital style={{ margin: 5 }} />
              </OverlayTrigger>
            </Col>
          )
          : null
        }
        {
        node.requiresPHI === 'Yes'
          ? (
            <Col>
              <OverlayTrigger placement="left" overlay={<Tooltip>PHI Required</Tooltip>}>
                <FaFingerprint style={{ margin: 5 }} />
              </OverlayTrigger>
            </Col>
          )
          : null
        }
      </Row>
    </Container>
  )
  : null;

export default AccessTypes;
