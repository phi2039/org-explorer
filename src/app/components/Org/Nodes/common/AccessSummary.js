import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  FaHospital,
  FaDonate,
  FaFingerprint,
} from 'react-icons/fa';

const formatRatio = (num, den, digits = 1) => `${(100 * num / den).toFixed(digits)}%`;
const AccessSummary = ({ entity }) => (
  <Container>
    <Row>
      <Col>
        <OverlayTrigger placement="left" overlay={<Tooltip>Payer Facing Functions</Tooltip>}>
          <FaDonate style={{ margin: 5 }} />
        </OverlayTrigger>
          {entity.payerFacingInstances} {formatRatio(entity.payerFacingFTE, entity.currentTotalFTE)}
      </Col>
      <Col>
        <OverlayTrigger placement="left" overlay={<Tooltip>Provider Facing Functions</Tooltip>}>
          <FaHospital style={{ margin: 5 }} />
        </OverlayTrigger>
          {entity.providerFacingInstances} {formatRatio(entity.providerFacingFTE, entity.currentTotalFTE)}
      </Col>
      <Col>
        <OverlayTrigger placement="left" overlay={<Tooltip>PHI Required Functions</Tooltip>}>
          <FaFingerprint style={{ margin: 5 }} />
        </OverlayTrigger>
          {entity.PHIInstances} {formatRatio(entity.PHIFTE, entity.currentTotalFTE)}
      </Col>
    </Row>
  </Container>
);

export default AccessSummary;
