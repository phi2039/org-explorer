import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

import { Planet } from 'react-planet';

const PopupMenuButton = styled.div`
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;

  :hover {
    background: rgba(0, 0, 0, 0.14);
  }
`;

const PopupActionButton = styled.div`
  height: 1.5em;
  width: 1.5em;
  color: #020958;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.14), 0 2px 4px rgba(0, 0, 0, 0.28);

  :hover {
    background: #020958;
    color: white;
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
  }
`;

const ActionMenu = ({
  size,
  icon,
  actions,
  orbitRadius,
  rotation,
  ...props
}) => (
  <div style={{ width: size }}>
    <Planet
      centerContent={<PopupMenuButton>{icon}</PopupMenuButton>}
      hideOrbit
      autoClose
      orbitRadius={orbitRadius}
      rotation={(rotation || 0) + 90 + (actions.length % 2 ? 22.5 : 0)}
      {...props}
    >
      {/* eslint-disable-next-line react/no-array-index-key */}
      {Array.from(Array(Math.trunc((8 - actions.length) / 2))).map((_, i) => <div key={`spacer${i}`} />)}
      {actions.map(action => <PopupActionButton key={action.name} onClick={action.handler}>{action.icon}</PopupActionButton>)}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {Array.from(Array(Math.round((8 - actions.length) / 2))).map((_, i) => <div key={`spacer${i}`} />)}
    </Planet>
  </div>
);

const ActionPropType = PropTypes.shape({
  handler: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
});

ActionMenu.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  actions: PropTypes.arrayOf(ActionPropType).isRequired,
  orbitRadius: PropTypes.number,
  rotation: PropTypes.number,
};

ActionMenu.defaultProps = {
  size: '1.5em',
  orbitRadius: 45,
  rotation: null,
};

export default ActionMenu;
