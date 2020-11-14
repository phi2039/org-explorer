import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

import { TYPE_NAME } from './constants';

import { HierarchyNodeModel } from './HierarchyNodeModel';
import { HierarchyNodeWidget } from './HierarchyNodeWidget';

export class HierarchyNodeFactory extends AbstractReactFactory {
  constructor() {
    super(TYPE_NAME);
  }

  static generateModel(event) {
    return new HierarchyNodeModel();
  }

  generateReactWidget(event) {
    return <HierarchyNodeWidget engine={this.engine} node={event.model} />;
  }
}

export default HierarchyNodeFactory;
