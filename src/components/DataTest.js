import React from 'react';

import Diagram from './Diagram';
import Dagre from './Diagram/Dagre';

import { useDataContext } from '../state/DataContext';
import { forEachNode } from '../lib/util/hierarchy';

const testMove = entities => {
  const node1 = Object.entries(entities.getAll().nodes).filter(([key, value]) => value.type === 'group')[0][1];
  const node2 = Object.entries(entities.getAll().nodes).filter(([key, value]) => value.type === 'group')[1][1];
  entities.move(node1.id, node2.id);
};

const rehydrate = entities => {
  const rootId = entities.getRoot();

  const processNode = (node, context) => {
    node.children = node.children.map(child => entities.get(child.id));
    // console.log(node.name);
  };

  forEachNode(entities.get(rootId), processNode, {});
};

const renderData = entities => (
  <pre>
    <button type="button" onClick={() => testMove(entities)}>Foo</button>
    {JSON.stringify(entities.getAll(), null, 2)}
  </pre>
);

const renderDiagram = entities => (
  <Diagram />
);

const DataTest = () => {
  const { entities } = useDataContext();
  // rehydrate(entities);
  // return renderDiagram(entities);
  return <Dagre />;
};

export default DataTest;
