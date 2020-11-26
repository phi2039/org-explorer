import React from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';

import { useSpring, animated, config } from 'react-spring';

import Snack from '../common/Snack';

const snackbarPadding = {
  top: 'margin-top: 1rem',
  bottom: 'margin-bottom: 1rem',
};

const SnackbarContainer = styled(animated.div)`
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  ${({ position = 'top' }) => snackbarPadding[position]}
  ${({ position = 'top' }) => position}: 0;
`;

const Snackbar = ({
  onDismiss,
  children,
}) => {
  // const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const props = useSpring({ transform: 'translate3d(0, 0, 0) scale(1)', from: { transform: 'translate3d(0, 120%, 0) scale(0.9)' }, config: config.stiff });
  return (
    <SnackbarContainer position="bottom" style={props}>
      <Snack onDismiss={onDismiss} dismissText="Cancel">
        {children}
      </Snack>
    </SnackbarContainer>
  );
};

Snackbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
  onDismiss: PropTypes.func,
};

Snackbar.defaultProps = {
  onDismiss: null,
};

export default Snackbar;
