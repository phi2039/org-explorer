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

const hasAccessData = entity => (entity.payerFacing === 'Yes' || entity.providerFacing === 'Yes' || entity.requiresPHI === 'Yes')
                                || (entity.payerFacing === true || entity.providerFacing === true || entity.requiresPHI === true);

const AccessTypes = ({ entity }) => hasAccessData(entity)
  ? (
    <Container>
      <Row>
        {
        (entity.payerFacing === 'Yes' || entity.payerFacing === true)
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
        (entity.providerFacing === 'Yes' || entity.providerFacing === true)
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
        (entity.requiresPHI === 'Yes' || entity.requiresPHI === true)
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
