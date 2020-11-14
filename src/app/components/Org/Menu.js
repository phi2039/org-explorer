import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiChevronsUp,
  FiChevronsDown,
  FiMinimize,
} from 'react-icons/fi';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

import FloatingMenu from '../FloatingMenu';

const Menu = ({
  actions: {
    collapseAll,
    expandAll,
    zoomIn,
    zoomOut,
    resetFocus,
  },
}) => {
  const menuItems = [
    resetFocus && {
      action: resetFocus,
      icon: FiMinimize,
      tooltip: 'Reset Focus',
      display: 'always',
    },
    collapseAll && { action: collapseAll, icon: FiChevronsUp, tooltip: 'Collapse All' },
    expandAll && { action: expandAll, icon: FiChevronsDown, tooltip: 'Expand All' },
    zoomIn && { action: zoomIn, icon: FaPlusCircle, tooltip: 'Zoom In' },
    zoomOut && { action: zoomOut, icon: FaMinusCircle, tooltip: 'Zoom Out' },
  ].filter(item => item);

  return <FloatingMenu items={menuItems} />;
};

Menu.propTypes = {
  actions: PropTypes.shape({
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func,
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    resetFocus: PropTypes.func,
  }),
};

Menu.defaultProps = {
  actions: {},
};

export default Menu;
