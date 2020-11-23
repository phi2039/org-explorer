import React, {
  createContext,
  useContext,
} from 'react';
import { PropTypes } from 'prop-types';

import useReducerAsync from '../../hooks/useReducerAsync';

const ActionStateContext = createContext();
const ActionDispatchContext = createContext();

const defaultState = {
  action: undefined,
  subject: undefined,
  values: {},
};

const actionReducer = (state, action) => {
  let nextState = state;
  console.log('dispatch', action);
  switch (action.type) {
    case 'begin': {
      nextState = {
        ...state,
        action: action.payload.action,
        subject: action.payload.subject,
        values: {},
      };
      break;
    }
    case 'set_clipboard': {
      nextState = {
        ...state,
        clipboard: action.payload.subjectId,
      };
      break;
    }
    case 'reset_clipboard': {
      nextState = {
        ...state,
        clipboard: null,
      };
      break;
    }
    case 'cancel': {
      nextState = defaultState;
      break;
    }
    case 'reset': {
      nextState = {
        ...state,
        values: {},
      };
      break;
    }
    case 'commit': {
      nextState = {
        ...state,
        action: undefined,
        isCommitting: false,
      };
      break;
    }
    // case 'commit_begin': {
    //   nextState = {
    //     ...state,
    //     isCommitting: true,
    //   };
    //   break;
    // }
    // case 'commit_end': {
    //   nextState = {
    //     ...state,
    //     action: undefined,
    //     isCommitting: false,
    //   };
    //   break;
    // }
    // case 'commit_error': {
    //   nextState = {
    //     ...state,
    //     action: undefined,
    //     isCommitting: false,
    //     values: action.payload.values,
    //     error: action.payload.error,
    //   };
    //   break;
    // }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  console.log('nextState', nextState);
  return nextState;
};

const useActionState = () => {
  const context = useContext(ActionStateContext);
  if (context === undefined) {
    throw new Error(
      'useActionState must be used within a ActionProvider',
    );
  }
  return context;
};

const useActionDispatch = () => {
  const context = useContext(ActionDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useActionDispatch must be used within a ActionProvider',
    );
  }
  return context;
};

const ActionProvider = ({ children }) => {
  const [state, dispatch] = useReducerAsync(actionReducer, defaultState);

  return (
    <ActionStateContext.Provider value={state}>
      <ActionDispatchContext.Provider value={dispatch}>
        {children}
      </ActionDispatchContext.Provider>
    </ActionStateContext.Provider>
  );
};

ActionProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

export { ActionProvider, useActionState, useActionDispatch };
