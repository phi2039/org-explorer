import React from 'react';
import { PropTypes } from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Toggle = ({
  state,
  tooltip,
  children,
  ...props
}) => {
  const elements = React.Children.toArray(children);

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      {elements.map(element => React.cloneElement(element, { state, ...props }))[0]}
    </OverlayTrigger>
  );
};

Toggle.propTypes = {
  state: PropTypes.bool,
  tooltip: PropTypes.string,
  children: PropTypes.element.isRequired,
};

Toggle.defaultProps = {
  state: false,
  tooltip: 'Toggle',
};

export default Toggle;

export { default as RotatingToggleIcon } from './RotatingToggleIcon';
export { default as SwapToggleIcon } from './SwapToggleIcon';
