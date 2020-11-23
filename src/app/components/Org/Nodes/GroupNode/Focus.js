import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';

import Toggle, { SwapToggleIcon } from '../../Toggle';

const iconSize = '1.5em';
const iconStyle = { cursor: 'pointer' };

const Focus = ({ focused, set, reset }) => (
  <Toggle state={focused} tooltip={focused ? 'Reset Focus' : 'Set Focus'}>
    <SwapToggleIcon
      active={<FiMinimize style={iconStyle} size={iconSize} onClick={reset} />}
      inactive={<FiMaximize style={iconStyle} size={iconSize} onClick={set} />}
    />
  </Toggle>
);

Focus.propTypes = {
  focused: PropTypes.bool,
  set: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

Focus.defaultProps = {
  focused: false,
};

export default Focus;
