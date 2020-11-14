import { useState } from 'react';
import constate from 'constate';

/* {
  entity: Object,
} */

export const [EntityProvider, useEntity] = constate(({ entity }) => useState(entity));
