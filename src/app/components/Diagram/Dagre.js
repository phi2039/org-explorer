import React, { useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import createEngine, {
  DiagramModel,
  DagreEngine,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from 'styled-components';

import {
  DiagramProvider,
  useDiagramContext,
} from './DiagramContext';

import {
  HierarchyNodeModel,
  HierarchyPortModel,
  HierarchyLinkModel,
  HierarchyNodeFactory,
  HierarchyLinkFactory,
} from './hierarchy';

const Canvas = styled.div`
  height: 100%;
  width: 100%;
  display: flex;

  > * {
      height: 100%;
      min-height: 100%;
      width: 100%;
    }
`;

function connectNodes(nodeFrom, nodeTo) {
  // just to get id-like structure
  const portOut = nodeFrom.addPort(new HierarchyPortModel(true, 'Parent', 'Parent'));
  const portTo = nodeTo.addPort(new HierarchyPortModel(false, 'Children', 'Children'));
  return portOut.link(portTo);
}

const linkNodes = (model, parent, child) => {
  if (parent && child) {
    const inPort = parent.getPort('Children');
    const outPort = child.getPort('Parent');
    if (inPort && outPort) {
      const link = new HierarchyLinkModel({ selectedColor: 'red' });
      link.setSourcePort(outPort);
      link.setTargetPort(inPort);
      model.addLink(link);
      return link;
    }
  }
  return null;
};

const addGroup = (model, id, { label, parent } = {}) => {
  const name = label || `${id}`;
  const node = new HierarchyNodeModel({ orgType: 'group', name, color: 'rgb(0,192,255)' });
  const inPort = new HierarchyPortModel({ isIn: true, name: 'Children', label: 'Children' });
  node.inPort = node.addPort(inPort);
  const outPort = new HierarchyPortModel({ isIn: false, name: 'Parent', label: 'Parent' });
  node.outPort = node.addPort(outPort);

  model.addNode(node);

  if (parent) {
    linkNodes(model, parent, node);
  }

  return node;
};

const DagreWidget = ({ engine: diagramEngine, model }) => {
  const dagreEngine = useMemo(() => new DagreEngine({
    graph: {
      rankdir: 'BT',
      ranker: 'longest-path',
      marginx: 25,
      marginy: 25,
    },
    includeLinks: true,
  }), []);

  const autoDistribute = useCallback(() => {
    dagreEngine.redistribute(model);
    diagramEngine.repaintCanvas();
  }, [diagramEngine, dagreEngine, model]);

  useEffect(() => {
    setTimeout(() => autoDistribute(diagramEngine, model));
  }, [diagramEngine, model, autoDistribute]);

  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
        <CanvasWidget engine={diagramEngine} />
      </Canvas>
    </div>
  );
};

const initEngine = (engine, model) => {
  engine.getNodeFactories().registerFactory(new HierarchyNodeFactory());
  engine.getLinkFactories().registerFactory(new HierarchyLinkFactory());

  const nodeA = addGroup(model, 'A');
  const nodeB = addGroup(model, 'B', { parent: nodeA });
  const nodeC = addGroup(model, 'C', { parent: nodeA });
  const nodeB1 = addGroup(model, 'B1', { parent: nodeB });
  const nodeB2 = addGroup(model, 'B2', { parent: nodeB });
  const nodeC1 = addGroup(model, 'C1', { parent: nodeC });
};

const Dagre = () => {
  const { engine, model } = useDiagramContext();
  useMemo(() => initEngine(engine, model), [engine, model]);

  return <DagreWidget model={model} engine={engine} />;
};

export default () => (
  <DiagramProvider>
    <Dagre />
  </DiagramProvider>
);
