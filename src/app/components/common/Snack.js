import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const snackStates = {
  entering: 'transform: translate3d(0, 120%, 0) scale(0.9)',
  entered: 'transform: translate3d(0, 0, 0) scale(1)',
  exiting: 'transform: translate3d(0, 120%, 0) scale(0.9)',
  exited: 'transform: translate3d(0, 120%, 0) scale(0.9)',
};

const SnackContainer = styled.div`
  align-items: center;
  background-color: rgb(49, 49, 49);
  border-radius: 3px;
  box-shadow:
    0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 288px;
  max-width: 568px;
  padding: 6px 24px;
  pointer-events: initial;
  transition-property: transform;
  transition-duration: ${({ transitionDuration }) => transitionDuration}ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  transform-origin: bottom;
  z-index: 2;
  ${({ transitionState }) => snackStates[transitionState]}
`;

const SnackContent = styled.div`
  font-size: 1rem;
  padding: 8px 0;
`;

const SnackDismissButton = styled.div`
  color: #998DD9;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 24px;
  padding: 7px 8px;
  text-transform: uppercase;
`;

const Snack = ({
  children,
  transitionDuration,
  transitionState,
  dismissText,
  onDismiss,
  ...props
}) => (
  <SnackContainer transitionState={transitionState} transitionDuration={transitionDuration} {...props}>
    <SnackContent>{children}</SnackContent>
    <SnackDismissButton
      onClick={onDismiss}
      aria-hidden="true"
      role="button"
    >
      {dismissText}
    </SnackDismissButton>
  </SnackContainer>
);

Snack.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
  transitionDuration: PropTypes.number,
  transitionState: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  dismissText: PropTypes.string,
};

Snack.defaultProps = {
  transitionState: 'entered',
  transitionDuration: 220,
  dismissText: 'Undo',
};

export default Snack;
