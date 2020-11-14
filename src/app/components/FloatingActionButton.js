import React from 'react';
import { PropTypes } from 'prop-types';

import styled from 'styled-components';
import {
  color,
  layout,
  space,
  border,
} from 'styled-system';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const ActionButtonContainer = styled.div`
  ${color}
  ${layout}
  ${space}
  ${border}
  z-index: 30;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  outline: none;
  font-weight: bold;
  text-decoration: none;
  font-size: 18px;
  top: ${({ location }) => 0};
  left: ${({ location }) => 0};
  bottom: ${({ location }) => 'auto'};
  right: ${({ location }) => 'auto'};

  & button {
    background-color: transparent;
    /* display: inline-block; */
    border: none;
    color: inherit;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    text-align: center;
  }
`;

ActionButtonContainer.defaultProps = {
  color: '#f1f1f1',
  backgroundColor: '#dc3545',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  location: 'topleft',
  padding: 0,
  margin: 0,
};

const FloatingActionButton = ({
  tooltip,
  children,
  offset,
  ...props
}) => (
  <ActionButtonContainer margin={offset}>
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>{tooltip}</Tooltip>}
    >
      <button type="button" {...props}>
        {children}
      </button>
    </OverlayTrigger>
  </ActionButtonContainer>
);

export default FloatingActionButton;
