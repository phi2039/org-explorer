import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiChevronsUp,
  FiChevronsDown,
  FiMinimize,
  FiCornerUpLeft,
  FiCornerUpRight,
} from 'react-icons/fi';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

import { useHotkeys } from 'react-hotkeys-hook';

import FloatingMenu from '../common/FloatingMenu';
import { useTimeline } from '../../state/entity-store';

const Menu = ({
  actions: {
    collapseAll,
    expandAll,
    zoomIn,
    zoomOut,
    resetFocus,
  },
  offsetTop,
}) => {
  const { doUndo, doRedo, timeline } = useTimeline();

  useHotkeys('ctrl+z', doUndo, [doUndo]);
  useHotkeys('ctrl+y', doRedo, [doRedo]);

  const menuItems = [
    resetFocus && {
      action: resetFocus,
      icon: FiMinimize,
      tooltip: 'Reset Focus',
      display: 'always',
    },
    timeline.past.length && { action: doUndo, icon: FiCornerUpLeft, tooltip: 'Undo' },
    timeline.future.length && { action: doRedo, icon: FiCornerUpRight, tooltip: 'Redo' },
    collapseAll && { action: collapseAll, icon: FiChevronsUp, tooltip: 'Collapse All' },
    expandAll && { action: expandAll, icon: FiChevronsDown, tooltip: 'Expand All' },
    zoomIn && { action: zoomIn, icon: FaPlusCircle, tooltip: 'Zoom In' },
    zoomOut && { action: zoomOut, icon: FaMinusCircle, tooltip: 'Zoom Out' },
  ].filter(item => item);

  return <FloatingMenu items={menuItems} offsetTop={offsetTop} />;
};

Menu.propTypes = {
  actions: PropTypes.shape({
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func,
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    resetFocus: PropTypes.func,
  }),
  offsetTop: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

Menu.defaultProps = {
  actions: {},
  offsetTop: 0,
};

export default Menu;
