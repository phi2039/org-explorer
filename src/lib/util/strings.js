import { startCase, toLower } from 'lodash';

export const toTitleCase = s => startCase(toLower(s));

const truthy = val => !!val;

export const joinTruthy = (arr = [], sep) => {
  return arr.filter(truthy).join(sep);
};
