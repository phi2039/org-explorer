import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import ScrollContainer from 'react-indiana-drag-scroll';

import {
  FiChevronsUp,
  FiChevronsDown,
  FiMinimize,
  // FiChevronsRight,
  // FiChevronsLeft,
  // FiPlusCircle,
} from 'react-icons/fi';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

import Hierarchy from '../Hierarchy';
import FloatingMenu from '../FloatingMenu';
import ZoomContainer from '../ZoomContainer';

import Node from './Node';

import { OrgStateProvider, useOrgState } from './state';
import './Org.css';

// const AddIcon = ({ onClick }) => (
//   <OverlayTrigger placement="top" overlay={<Tooltip>Add Child</Tooltip>}>
//     <FiPlusCircle size="1.5em" />
//   </OverlayTrigger>
// );

// const Sidebar = ({ open, children }) => <div className={`sidebar${open ? ' open': ''}`}>{children}</div>;
// const SidebarHeader = ({ open, onToggle }) => (
//   <div className="header">
//     <button className="collapse-btn" type="button">
//       { open ? <FiChevronsRight size="1em" onClick={onToggle}/> : <FiChevronsLeft size="1em" onClick={onToggle} />}
//     </button>
//   </div>
// );

// const Separator = () => <div className="vertical-separator" />;

const Org = ({
  ...props
}) => {
  const {
    state,
    isFocused,
    expandAll,
    collapseAll,
    setActiveRoot,
  } = useOrgState();

  const [zoom, setZoom] = useState(1.0);
  const zoomIncrement = 0.1;
  const zoomIn = () => setZoom(level => Math.min(2, level + zoomIncrement));
  const zoomOut = () => setZoom(level => Math.max(zoomIncrement, level - zoomIncrement));

  const resetFocus = () => setActiveRoot();
  // const [sidebar, setSidebar] = useState(false);
  // const toggleSidebar = () => setSidebar(show => !show);
  // const [edit, setEdit] = useState(false);
  // const toggleEdit = () => setEdit(enabled => !enabled);

  const menuItems = [
    ...(isFocused() ? [{ action: resetFocus, icon: FiMinimize, tooltip: 'Reset Focus', display: 'always' }] : []),
    { action: collapseAll, icon: FiChevronsUp, tooltip: 'Collapse All' },
    { action: expandAll, icon: FiChevronsDown, tooltip: 'Expand All' },
    { action: zoomIn, icon: FaPlusCircle, tooltip: 'Zoom In' },
    { action: zoomOut, icon: FaMinusCircle, tooltip: 'Zoom Out' },
  ];

  return (
    <div className="workspace" {...props}>
      <FloatingMenu items={menuItems} />
      <ScrollContainer hideScrollbars={false} className="scrollContainer">
        <ZoomContainer zoom={zoom} setZoom={setZoom}>
          <Hierarchy>
            <Node schema="groups" id={state.activeRoot} />
          </Hierarchy>
        </ZoomContainer>
      </ScrollContainer>
      {/* <Separator />
      <Sidebar open={sidebar} edit={edit}>
        <SidebarHeader open={sidebar} onToggle={toggleSidebar}/>
      </Sidebar> */}
    </div>
  );
};

export default ({ ...props }) => (
  <OrgStateProvider>
    <Org {...props} />
  </OrgStateProvider>
);
