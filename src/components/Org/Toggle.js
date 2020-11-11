import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { FiChevronUp } from 'react-icons/fi';

const Toggle = ({ toggleState, collapsed }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>Toggle Children</Tooltip>}>
    <FiChevronUp onClick={toggleState} size="2em" className={collapsed ? 'buttonExpand' : 'buttonCollapse'} />
  </OverlayTrigger>
);

export default Toggle;
