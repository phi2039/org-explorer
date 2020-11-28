import React, { useMemo, useCallback } from 'react';

import {
  FiList,
  FiGrid,
} from 'react-icons/fi';

import { useSettingsState, useSettingsDispatch } from './settings';

import ControlBar from '../common/ControlBar';

const items = [
  {
    name: 'compact',
    icon: FiList,
  },
  {
    name: 'detail',
    icon: FiGrid,
  },
];

const ViewControls = ({ ...props }) => {
  const { viewMode } = useSettingsState();
  const settingsDispatch = useSettingsDispatch();

  const activeItem = useMemo(() => items.findIndex(item => item.name === viewMode), [viewMode]);

  const setViewMode = useCallback(mode => settingsDispatch({
    type: 'set_view_mode',
    payload: {
      mode,
    },
  }), [settingsDispatch]);

  const controls = useMemo(() => items.map(control => ({
    ...control,
    action: () => setViewMode && setViewMode(control.name),
  })), [setViewMode]);

  return (
    <ControlBar
      initialActiveItem={activeItem}
      controls={controls}
      {...props}
    />
  );
};

export default ViewControls;
