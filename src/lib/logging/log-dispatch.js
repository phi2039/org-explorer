const logDispatch = (dispatch, name, logger = console) => (state, action) => {
  logger.log(`dispatch[${name}]`, action);
  const nextState = dispatch(state, action);
  logger.log(`nextState[${name}]`, nextState);
  return nextState;
};

export default logDispatch;
