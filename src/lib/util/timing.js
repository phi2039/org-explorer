/* eslint-disable import/prefer-default-export */
export const Timer = () => {
  const now = window.performance.now();
  const state = {
    start: now,
    last: now,
  };

  const mark = () => {
    const time = window.performance.now();
    const interval = time - state.last;
    state.last = time;
    return interval;
  };

  const reset = () => {
    const ref = window.performance.now();
    state.start = ref;
    state.last = ref;
  };

  const current = () => window.performance.now() - state.start;

  return {
    current,
    mark,
    reset,
  };
};
