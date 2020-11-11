import * as React from 'react';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
import { HierarchyLinkWidget } from './HierarchyLinkWidget';
import { HierarchyLinkModel } from './HierarchyLinkModel';
import { HierarchyStaticLinkWidget } from './HierarchyStaticLinkWidget';

import { TYPE_NAME } from './constants';

export class HierarchyLinkFactory extends DefaultLinkFactory {
  constructor() {
    super(TYPE_NAME);
  }

  static generateModel(event) {
    return new HierarchyLinkModel();
  }

  generateReactWidget(event) {
    return <HierarchyStaticLinkWidget diagramEngine={this.engine} link={event.model} factory={this} />;
  }
}

export default HierarchyLinkFactory;
