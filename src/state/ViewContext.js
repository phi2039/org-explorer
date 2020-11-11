import { useState } from 'react';
import constate from 'constate';

/* {
  view: String,
} */

export const [ViewProvider, useView] = constate(({ initialView }) => useState(initialView));
