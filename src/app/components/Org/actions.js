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

export const endCommitAction = dispatch => values => dispatch({
  type: 'commit_end',
  payload: {
    values,
  },
});
