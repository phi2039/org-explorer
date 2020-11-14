/// WIP

import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiChevronsRight,
  FiChevronsLeft,
} from 'react-icons/fi';

import './Sidebar.css';

const Sidebar = ({ open, children }) => <div className={`sidebar${open ? ' open' : ''}`}>{children}</div>;
export const SidebarHeader = ({ open, onToggle }) => (
  <div className="header">
    <button className="collapse-btn" type="button">
      { open ? <FiChevronsRight size="1em" onClick={onToggle} /> : <FiChevronsLeft size="1em" onClick={onToggle} />}
    </button>
  </div>
);

export const Separator = () => <div className="vertical-separator" />;

export default Sidebar;
