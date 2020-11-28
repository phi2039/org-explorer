import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { PropTypes } from 'prop-types';
import produce, { current } from 'immer';

const SettingsStateContext = createContext();
const SettingsDispatchContext = createContext();

/* eslint-disable no-param-reassign */
const settingsReducer = produce((draft, action) => {
  console.log('dispatch[OrgSettings]', action);
  switch (action.type) {
    case 'set_view_mode': {
      draft.viewMode = action.payload.mode;
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState[OrgSettings]', current(draft));
});
/* eslint-enable no-param-reassign */

const useSettingsState = () => {
  const context = useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error(
      'useSettingsState must be used within a SettingsProvider',
    );
  }
  return context;
};

const useSettingsDispatch = () => {
  const context = useContext(SettingsDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useSettingsDispatch must be used within a SettingsProvider',
    );
  }
  return context;
};

const defaultState = {
  viewMode: 'compact',
};

const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, defaultState);

  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

export {
  SettingsProvider,
  useSettingsState,
  useSettingsDispatch,
};
