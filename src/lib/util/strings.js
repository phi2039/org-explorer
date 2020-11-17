import { startCase, toLower } from 'lodash';

export const toTitleCase = s => startCase(toLower(s));
