import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';

import { TYPE_NAME } from './constants';

export class HierarchyLinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      type: TYPE_NAME,
      ...options,
    });
    this.lastHoverIndexOfPath = 0;
    this.lastPathXdirection = options.orientation === 'horizontal';
    this.firstPathXdirection = options.orientation === 'horizontal';
  }

  setFirstAndLastPathsDirection() {
    const points = this.getPoints();
    for (let i = 1; i < points.length; i += points.length - 2) {
      const dx = Math.abs(points[i].getX() - points[i - 1].getX());
      const dy = Math.abs(points[i].getY() - points[i - 1].getY());
      if (i - 1 === 0) {
        this.firstPathXdirection = dx > dy;
      } else {
        this.lastPathXdirection = dx > dy;
      }
    }
  }

  addPoint(pointModel, index = 1) {
    super.addPoint(pointModel, index);
    this.setFirstAndLastPathsDirection();
    return pointModel;
  }

  deserialize(event) {
    super.deserialize(event);
    this.setFirstAndLastPathsDirection();
  }

  setManuallyFirstAndLastPathsDirection(first, last) {
    this.firstPathXdirection = first;
    this.lastPathXdirection = last;
  }

  getLastPathXdirection() {
    return this.lastPathXdirection;
  }

  getFirstPathXdirection() {
    return this.firstPathXdirection;
  }

  setWidth(width) {
    this.options.width = width;
    this.fireEvent({ width }, 'widthChanged');
  }

  setColor(color) {
    this.options.color = color;
    this.fireEvent({ color }, 'colorChanged');
  }

  isLocked() {
    return this.parent.isLocked();
  }
}

export default HierarchyLinkModel;
