import { useMemo } from 'react';
import constate from 'constate';

import createEngine, {
  DiagramModel,
} from '@projectstorm/react-diagrams';

const useDiagram = () => {
  const engine = useMemo(createEngine, []);
  const model = useMemo(() => new DiagramModel(), []);
  engine.setModel(model);

  return {
    engine,
    model,
  };
};

export const [DiagramProvider, useDiagramContext, useEngine, useModel] = constate(
  useDiagram,
  context => context,
  ({ engine }) => engine,
  ({ model }) => model,
);
