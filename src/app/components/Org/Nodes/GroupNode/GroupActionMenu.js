import React from 'react';
import { PropTypes } from 'prop-types';

import {
  FiMoreHorizontal,
  FiFolderPlus,
  FiFilePlus,
  FiTrash2,
  FiEdit,
  FiScissors,
  FiClipboard,
} from 'react-icons/fi';

import ActionMenu from '../ActionMenu';

const GroupActionMenu = ({
  onEdit,
  onDelete,
  onAddGroup,
  onAddWorkload,
  onCut,
  onPaste,
}) => {
  const actions = [{
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
  }];
  if (onCut) {
    actions.push({
      handler: onCut,
      name: 'cut',
      icon: <FiScissors size="1em" />,
    });
  }
  if (onPaste) {
    actions.push({
      handler: onPaste,
      name: 'paste',
      icon: <FiClipboard size="1em" />,
    });
  }

  return (
    <ActionMenu
      icon={<FiMoreHorizontal size="1em" />}
      actions={actions}
    />
  );
};

GroupActionMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddGroup: PropTypes.func,
  onAddWorkload: PropTypes.func,
  onCut: PropTypes.func,
  onPaste: PropTypes.func,
};

GroupActionMenu.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onAddGroup: () => {},
  onAddWorkload: () => {},
  onCut: null,
  onPaste: null,
};

export default GroupActionMenu;
