import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { HierarchyLinkModel } from '../../links/hierarchy-link/HierarchyLinkModel';

export class HierarchyPortModel extends DefaultPortModel {
  // eslint-disable-next-line class-methods-use-this
  createLinkModel(factory) {
    return new HierarchyLinkModel();
  }

  canLinkToPort(port) {
    if (port instanceof HierarchyPortModel) {
      return this.options.in !== port.getOptions().in;
    }
    return false;
  }
}

export default HierarchyPortModel;
