import React from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

const RotatingToggleIcon = styled.div`
  transform: rotate(${({ state }) => state ? '0deg' : '180deg'});
  transition: all 0.1s linear;
  cursor: pointer;
`;

export default RotatingToggleIcon;
