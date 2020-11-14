import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  FiX,
  FiMoreVertical,
} from 'react-icons/fi';

const MenuButton = ({ opened, toggleMenu, ...props }) => (
  <li className="menuButton">
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>{opened ? 'Close' : 'Open Menu'}</Tooltip>}
    >
      <button type="button" onClick={toggleMenu} {...props}>
        {opened ? <FiX size="1.5em" /> : <FiMoreVertical size="1.5em" />}
      </button>
    </OverlayTrigger>
  </li>
);

export default MenuButton;
