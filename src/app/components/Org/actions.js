export const beginActionAction = dispatch => (action, subject) => dispatch({
  type: 'begin',
  payload: {
    action,
    subject,
  },
});

export const cancelActionAction = dispatch => () => dispatch({
  type: 'cancel',
});

export const beginCommitAction = dispatch => () => dispatch({
  type: 'commit_begin',
});

export const endCommitAction = dispatch => () => dispatch({
  type: 'commit_end',
});

export const setClipboardAction = dispatch => subjectId => dispatch({
  type: 'set_clipboard',
  payload: {
    subjectId,
  },
});

export const resetClipboardAction = dispatch => () => dispatch({
  type: 'reset_clipboard',
});
