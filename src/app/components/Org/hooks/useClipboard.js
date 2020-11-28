import { useCallback } from 'react';
import { useActionDispatch, useActionState } from '../state';

const setClipboardAction = dispatch => subjectId => dispatch({
  type: 'set_clipboard',
  payload: {
    subjectId,
  },
});

const resetClipboardAction = dispatch => () => dispatch({
  type: 'reset_clipboard',
});

const useClipboard = () => {
  const context = useActionState();
  const dispatch = useActionDispatch();
  if (context === undefined) {
    throw new Error(
      'useActionState must be used within a ActionProvider',
    );
  }

  const resetClipboard = useCallback(resetClipboardAction(dispatch), [dispatch]);
  const setClipboard = useCallback(setClipboardAction(dispatch), [dispatch]);

  return {
    subject: context.clipboard,
    resetClipboard,
    setClipboard,
  };
};

export default useClipboard;
