import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

import {
  FiMoreHorizontal,
  FiFolderPlus,
  FiFilePlus,
  FiTrash2,
  FiEdit,
} from 'react-icons/fi';

import { Planet } from 'react-planet';

const PopupMenuButton = styled.div`
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;

  :hover {
    background: #020958;
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

const GroupActionMenu = ({
  onEdit,
  onDelete,
  onAddGroup,
  onAddWorkload,
}) => (
  <div style={{ width: '1.5em' }}>
    <Planet
      centerContent={<PopupMenuButton><FiMoreHorizontal size="1em" /></PopupMenuButton>}
      hideOrbit
      autoClose
      orbitRadius={45}
      rotation={190}
    >
      <PopupActionButton onClick={onEdit}><FiEdit size="1em" /></PopupActionButton>
      <PopupActionButton onClick={onDelete}><FiTrash2 size="1em" /></PopupActionButton>
      <PopupActionButton onClick={onAddGroup}><FiFolderPlus size="1em" /></PopupActionButton>
      <PopupActionButton onClick={onAddWorkload}><FiFilePlus size="1em" /></PopupActionButton>
      <div />
      <div />
      <div />
    </Planet>
  </div>
);

GroupActionMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddGroup: PropTypes.func,
  onAddWorkload: PropTypes.func,
};

GroupActionMenu.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onAddGroup: () => {},
  onAddWorkload: () => {},
};

export default GroupActionMenu;
