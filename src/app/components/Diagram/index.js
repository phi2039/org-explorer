import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';

import createEngine, {
  DiagramModel,
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget,
} from '@projectstorm/react-canvas-core';

import useToggle from '../../hooks/toggle';

import {
  HierarchyNodeModel,
  HierarchyNodeFactory,
  HierarchyPortModel,
  HierarchyLinkFactory,
  HierarchyLinkModel,
} from './hierarchy';

import LockButton from './LockButton';

// const Body = styled(CanvasWidget)`
//   height: 100%;
//   width: 100%;
// `;

const Workspace = styled.div`
  height: 100%;
  width: 100%;
  display: flex;

  > * {
      height: 100%;
      min-height: 100%;
      width: 100%;
    }
`;

const OrgModel = () => {
  const model = new DiagramModel();

  const getDiagramModel = () => model;

  const nodes = {};

  const lock = () => model.setLocked(true);
  const unlock = () => model.setLocked(false);

  const linkNodes = (parentId, childId) => {
    if (!parentId || !childId) {
      return null;
    }

    const parent = nodes[parentId];
    const child = nodes[childId];

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

  const addGroup = (id, { label, position: [x = 0, y = 0] = [], parent } = {}) => {
    const name = label || `${id}`;
    const node = new HierarchyNodeModel({ orgType: 'group', name, color: 'rgb(0,192,255)' });
    node.setPosition(x, y);
    const inPort = new HierarchyPortModel({ isIn: true, name: 'Children', label: 'Children' });
    node.inPort = node.addPort(inPort);
    const outPort = new HierarchyPortModel({ isIn: false, name: 'Parent', label: 'Parent' });
    node.outPort = node.addPort(outPort);

    nodes[id] = node;
    model.addNode(node);

    if (parent) {
      linkNodes(parent, id);
    }

    return node;
  };

  const addFunction = (id, { label, position: [x = 0, y = 0] = [], parent } = {}) => {
    const name = label || `${id}`;
    const node = new HierarchyNodeModel({ orgType: 'function', name, color: 'rgb(192,255,0)' });
    node.setPosition(x, y);
    node.outPort = node.addPort(new HierarchyPortModel({ isIn: false, name: 'Parent', label: 'Parent' }));

    nodes[id] = node;
    model.addNode(node);

    if (parent) {
      linkNodes(parent, id);
    }

    return node;
  };

  return {
    addGroup,
    addFunction,
    getDiagramModel,
    lock,
    unlock,
  };
};

const initEngine = () => {
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new HierarchyNodeFactory());
  engine.getLinkFactories().registerFactory(new HierarchyLinkFactory());
  return engine;
};

const initModel = () => {
  const model = OrgModel();
  model.addGroup('Node 1', { position: [100, 100] });
  model.addFunction('Node 2', { position: [100, 200], parent: 'Node 1' });
  return model;
};

const Diagram = () => {
  const engine = useMemo(initEngine, []);
  const [locked, toggleLocked] = useToggle(true);

  const orgModel = useMemo(initModel, []);

  useEffect(() => {
    locked ? orgModel.lock() : orgModel.unlock();
    // engine.repaintCanvas();
  }, [orgModel, locked]);

  engine.setModel(orgModel.getDiagramModel());
  return (
    <div style={{ height: '100vh' }}>
      <LockButton locked={locked} onToggle={toggleLocked} />
      <Workspace>
        <CanvasWidget engine={engine} />
      </Workspace>
    </div>
  );
};

export default Diagram;
