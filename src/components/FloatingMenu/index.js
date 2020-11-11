import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import MenuButton from './MenuButton';
import ActionButton from './ActionButton';

import './FloatingMenu.css';

const MenuItem = ({ Icon, tooltip, onClick }) => (
  <ActionButton tooltip={tooltip} onClick={onClick}>
    <Icon size="1.5em" />
  </ActionButton>
);

const FloatingMenu = ({ items = [] }) => {
  const [opened, setOpened] = useState(false);
  const toggle = () => setOpened(!opened);

  return (
    <div className="actionMenu">
      <ul>
        <>
          <MenuButton opened={opened} toggleMenu={toggle} />
          {
            items.filter(item => item.display === 'always').map(item => <MenuItem key={item.tooltip} Icon={item.icon} tooltip={item.tooltip} onClick={item.action} />)
          }
          {
            opened
              ? items.filter(item => item.display !== 'always').map(item => <MenuItem key={item.tooltip} Icon={item.icon} tooltip={item.tooltip} onClick={item.action} />)
              : null
          }
          {/* <li><span>({(zoom * 100).toFixed(0)}%)</span></li> */}
        </>
      </ul>
    </div>
  );
};

export default FloatingMenu;
