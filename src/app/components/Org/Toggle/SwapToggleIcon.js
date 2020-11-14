import React from 'react';
import { PropTypes } from 'prop-types';

// TODO: Fix ref handling so tooltips work
const SwapToggleIcon = ({ active, inactive, state }) => (
  <div>
    {state ? active : inactive}
  </div>
);

export default SwapToggleIcon;
