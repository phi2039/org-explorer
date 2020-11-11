import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const ActionButton = ({ tooltip, children, ...props }) => (
  <li className="actionButton">
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>{tooltip}</Tooltip>}
    >
      <button type="button" {...props}>
        {children}
      </button>
    </OverlayTrigger>
  </li>
);

export default ActionButton;
