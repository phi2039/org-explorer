import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { Point } from '@projectstorm/geometry';

const Controller = (link) => {
  const update = () => {
    const points = link.getPoints();
    const startPoint = link.getPointForPort(link.getSourcePort());
    const endPoint = link.getPointForPort(link.getTargetPort());

    const isStraight = (startPoint.getX() === endPoint.getX());
    const pointsRequired = isStraight ? 2 : 4;

    if (points.length < pointsRequired) {
      link.addPoint(
        new PointModel({
          link,
          position: new Point(endPoint.getX(), startPoint.getY() + (endPoint.getY() - startPoint.getY()) / 2),
        }),
        1,
      );
      link.addPoint(
        new PointModel({
          link,
          position: new Point(startPoint.getX(), startPoint.getY() + (endPoint.getY() - startPoint.getY()) / 2),
        }),
        1,
      );
    } else if (points.length > pointsRequired) {
      // link.removeMiddlePoints();
      points[1].remove();
      points[1].remove();
    } else if (points.length === 4) {
      points[2].setPosition(endPoint.getX(), startPoint.getY() + (endPoint.getY() - startPoint.getY()) / 2);
      points[1].setPosition(startPoint.getX(), startPoint.getY() + (endPoint.getY() - startPoint.getY()) / 2);
    }
  };

  return {
    update,
  };
};

const getTargetId = event => {
  if (event.target.dataset) {
    const index = event.target.dataset.point;
    return Number.parseInt(index, 10);
  }
  return null;
};

// TODO: Handle re-render on lock state change
export const HierarchyStaticLinkWidget = ({ link, diagramEngine, factory }) => {
  const refPaths = useRef([]);

  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    link.setRenderedPaths(
      refPaths.current,
    );
    return () => link.setRenderedPaths([]);
  }, [link, refPaths]);

  const controller = useMemo(() => Controller(link, diagramEngine), [link, diagramEngine]);

  const handleEnter = useCallback((event) => {
    const index = getTargetId(event);
    if (index >= 0) {
      // setSelected(true);
    }
  }, [setSelected]);

  controller.update();

  const points = link.getPoints();

  // TODO: Reduce rerenders due to ref changes
  // useEffect(() => {
  //   itemsRef.current = itemsRef.current.slice(0, props.items.length);
  // }, [link]);
  refPaths.current = [...Array(points.length)].map(() => null);

  const paths = [...Array(points.length - 1)].map((_, j) => (
    // factory.generateLinkSegment(
    //   link,
    //   isSelected || link.isSelected(),
    //   LinkWidget.generateLinePath(points[j], points[j + 1]),
    // )
    <DefaultLinkSegmentWidget
      forwardRef={ref => { refPaths.current[j] = ref; }}
      key={`link-${j}`}
      path={LinkWidget.generateLinePath(points[j], points[j + 1])}
      selected={isSelected}
      diagramEngine={diagramEngine}
      factory={diagramEngine.getFactoryForLink(link)}
      link={link}
      ref={ref => { refPaths.current[j] = ref; }}
      onSelection={() => setSelected(false)}
      extras={{
        'data-linkid': link.getID(),
        'data-point': j,
        onMouseEnter: handleEnter,
      }}
    />
  ));

  return <g data-default-link-test={link.getOptions().testName}>{paths}</g>;
};

HierarchyStaticLinkWidget.defaultProps = {
  color: 'red',
  width: 3,
  link: null,
  smooth: false,
  diagramEngine: null,
  factory: null,
};


export default HierarchyStaticLinkWidget;
