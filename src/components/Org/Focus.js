import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';

const FocusActionIcon = ({ Icon, tooltip, onClick }) => (
  <OverlayTrigger placement="left" overlay={<Tooltip>{tooltip}</Tooltip>}>
    <Icon style={{ cursor: 'pointer' }} size="1.5em" onClick={onClick} />
  </OverlayTrigger>
);

export const FocusIcon = ({ ...props }) => <FocusActionIcon {...props} Icon={FiMaximize} tooltip="Set Focus" />;
export const UnfocusIcon = ({ ...props }) => <FocusActionIcon {...props} Icon={FiMinimize} tooltip="Reset Focus" />;

const Focus = ({
  focused,
  set,
  reset
}) => focused ? <UnfocusIcon onClick={reset} /> : <FocusIcon onClick={set} />;

export default Focus;
