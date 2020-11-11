import { NodeModel } from '@projectstorm/react-diagrams';

import { TYPE_NAME } from './constants';

export class HierarchyNodeModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: TYPE_NAME,
    });
    this.color = options.color || { options: 'red' };
    this.orgType = options.orgType || 'function';
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.options.color,
    };
  }

  deserialize(ob, engine) {
    super.deserialize(ob, engine);
    this.color = ob.color;
  }
}

export default HierarchyNodeModel;
