import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiMoreHorizontal,
  FiFolderPlus,
  FiFilePlus,
  FiTrash2,
  FiEdit,
} from 'react-icons/fi';

import ActionMenu from '../ActionMenu';

const GroupActionMenu = ({
  onEdit,
  onDelete,
  onAddGroup,
  onAddWorkload,
}) => (
  <ActionMenu
    icon={<FiMoreHorizontal size="1em" />}
    actions={[{
      handler: onEdit,
      name: 'edit',
      icon: <FiEdit size="1em" />,
    }, {
      handler: onDelete,
      name: 'delete',
      icon: <FiTrash2 size="1em" />,
    }, {
      handler: onAddGroup,
      name: 'addGroup',
      icon: <FiFolderPlus size="1em" />,
    }, {
      handler: onAddWorkload,
      name: 'addFunction',
      icon: <FiFilePlus size="1em" />,
    }]}
  />
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
