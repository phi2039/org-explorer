import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
} from 'react';
import { LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { Point } from '@projectstorm/geometry';

const Controller = (link, diagramEngine) => {
  let draggingIndex = 0;

  const getDraggingIndex = () => draggingIndex;
  const beginDrag = index => { draggingIndex = index; };

  const calculatePositions = (points, event, index, coordinate) => {
    // If path is first or last add another point to keep node port on its position
    if (index === 0) {
      const point = new PointModel({
        link,
        position: new Point(points[index].getX(), points[index].getY()),
      });
      link.addPoint(point, index);
      draggingIndex += 1;
      return;
    }

    if (index === points.length - 2) {
      const point = new PointModel({
        link,
        position: new Point(points[index + 1].getX(), points[index + 1].getY()),
      });
      link.addPoint(point, index + 1);
      return;
    }

    // Merge two points if it is not close to node port and close to each other
    if (index - 2 > 0) {
      const pts = {
        [index - 2]: points[index - 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index - 1]: points[index - 1].getPosition(),
      };
      if (Math.abs(pts[index - 1][coordinate] - pts[index + 1][coordinate]) < 5) {
        pts[index - 2][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        pts[index + 1][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index - 2].setPosition(pts[index - 2]);
        points[index + 1].setPosition(pts[index + 1]);
        points[index - 1].remove();
        points[index - 1].remove();
        draggingIndex -= 2;
        return;
      }
    }

    // Merge two points if it is not close to node port
    if (index + 2 < points.length - 2) {
      const pts = {
        [index + 3]: points[index + 3].getPosition(),
        [index + 2]: points[index + 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index]: points[index].getPosition(),
      };

      if (Math.abs(pts[index + 1][coordinate] - pts[index + 2][coordinate]) < 5) {
        pts[index][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        pts[index + 3][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index].setPosition(pts[index]);
        points[index + 3].setPosition(pts[index + 3]);
        points[index + 1].remove();
        points[index + 1].remove();
        return;
      }
    }

    // If no condition above handled then just update path points position
    const pts = {
      [index]: points[index].getPosition(),
      [index + 1]: points[index + 1].getPosition(),
    };
    pts[index][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
    pts[index + 1][coordinate] = diagramEngine.getRelativeMousePoint(event)[coordinate];
    points[index].setPosition(pts[index]);
    points[index + 1].setPosition(pts[index + 1]);
  };

  const draggingEvent = (event) => {
    const points = link.getPoints();
    // get moving difference. Index + 1 will work because links indexes has
    // length = points.lenght - 1
    const dx = Math.abs(points[draggingIndex].getX() - points[draggingIndex + 1].getX());
    const dy = Math.abs(points[draggingIndex].getY() - points[draggingIndex + 1].getY());

    // moving with y direction
    if (dx === 0) {
      calculatePositions(points, event, draggingIndex, 'x');
    } else if (dy === 0) {
      calculatePositions(points, event, draggingIndex, 'y');
    }
    link.setFirstAndLastPathsDirection();
  };

  const update = (isDragging) => {
    // ensure id is present for all points on the path
    const points = link.getPoints();
    // const paths = [];

    // Get points based on link orientation
    let pointLeft = points[0];
    let pointRight = points[points.length - 1];
    let hadToSwitch = false;
    if (pointLeft.getX() > pointRight.getX()) {
      pointLeft = points[points.length - 1];
      [pointRight] = points;
      hadToSwitch = true;
    }
    const dy = Math.abs(points[0].getY() - points[points.length - 1].getY());

    // When new link add one middle point to get everywhere 90° angle
    if (link.getTargetPort() === null && points.length === 2) {
      [...Array(2)].forEach(item => {
        link.addPoint(
          new PointModel({
            link,
            position: new Point(pointLeft.getX(), pointRight.getY()),
          }),
          1,
        );
      });
      link.setManuallyFirstAndLastPathsDirection(true, true);
    } else if (link.getTargetPort() === null && link.getSourcePort() !== null) {
    // When new link is moving and not connected to target port move with middle point
    // TODO: @DanielLazarLDAPPS This will be better to update in DragNewLinkState
    //  in function fireMouseMoved to avoid calling this unexpectedly e.g. after Deserialize

      points[1].setPosition(
        pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
        !hadToSwitch ? pointLeft.getY() : pointRight.getY()
      );
      points[2].setPosition(
        pointRight.getX() + (pointLeft.getX() - pointRight.getX()) / 2,
        !hadToSwitch ? pointRight.getY() : pointLeft.getY()
      );
    } else if (!isDragging && points.length > 2) {
      // Render was called but link is not moved by user.
      // Node is moved and in this case fix coordinates to get 90° angle.
      // For loop just for first and last path

      // Those points and its position only will be moved
      for (let i = 1; i < points.length; i += points.length - 2) {
        if (i - 1 === 0) {
          if (link.getFirstPathXdirection()) {
            points[i].setPosition(points[i].getX(), points[i - 1].getY());
          } else {
            points[i].setPosition(points[i - 1].getX(), points[i].getY());
          }
        } else if (link.getLastPathXdirection()) {
          points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
        } else {
          points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
        }
      }
    }

    // If there is existing link which has two points add one
    // NOTE: It doesn't matter if check is for dy or dx
    if (points.length === 2 && dy !== 0 && !isDragging) {
      link.addPoint(
        new PointModel({
          link,
          position: new Point(pointLeft.getX(), pointRight.getY()),
        }),
      );
    }

    return points;
  };

  return {
    calculatePositions,
    beginDrag,
    draggingEvent,
    getDraggingIndex,
    update,
  };
};

const HierarchyLinkSegmentWidget = forwardRef((props, ref) => {
  return (
    <DefaultLinkSegmentWidget
      forwardRef={ref}
      {...props}
    />
  );
});

const getTargetId = event => {
  if (event.target.dataset) {
    const index = event.target.dataset.point;
    return Number.parseInt(index, 10);
  }
  return null;
};

// TODO: Handle re-render on lock state change
export const HierarchyLinkWidget = ({ link, diagramEngine }) => {
  const refPaths = useRef([]);

  const [isSelected, setSelected] = useState(false);
  const [isDragging, setDragging] = useState(false);
  // const [lastHoverIndex, setLastHoverIndex] = useState(0);

  const isLocked = link.isLocked();

  useEffect(() => {
    link.setRenderedPaths(
      refPaths.current,
    );
    return () => link.setRenderedPaths([]);
  }, [link, refPaths]);

  const controller = useMemo(() => Controller(link, diagramEngine), [link, diagramEngine]);

  const handleMove = useCallback((event) => {
    if (isLocked) return;
    controller.draggingEvent(event);
  }, [controller, isLocked]);

  const handleUp = useCallback((event) => {
    setDragging(false);
    setSelected(false);
  }, [setDragging, setSelected]);

  const handleDown = useCallback((event) => {
    if (isLocked) return;
    if (event.button === 0) {
      const index = getTargetId(event);
      if (index >= 0) {
        controller.beginDrag(index);
        setDragging(true);
      }
    }
  }, [controller, setDragging, isLocked]);

  const handleEnter = useCallback((event) => {
    const index = getTargetId(event);
    if (index >= 0) {
      setSelected(true);
      // setLastHoverIndex(index);
    }
  }, [setSelected]);
  // }, [setSelected, setLastHoverIndex]);

  // useEffect(() => {
  //   if (isSelected) {
  //     link.lastHoverIndexOfPath = lastHoverIndex; // eslint-disable-line no-param-reassign
  //   }
  // }, [isSelected, lastHoverIndex, link]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    }
  }, [isDragging, handleMove, handleUp]);

  controller.update(isDragging);

  const points = link.getPoints();

  // TODO: Reduce rerenders due to ref changes
  // useEffect(() => {
  //   itemsRef.current = itemsRef.current.slice(0, props.items.length);
  // }, [link]);
  refPaths.current = [...Array(points.length)].map(() => null);

  const paths = [...Array(points.length - 1)].map((_, j) => (
    <HierarchyLinkSegmentWidget
      key={`link-${j}`}
      path={LinkWidget.generateLinePath(points[j], points[j + 1])}
      selected={isSelected}
      diagramEngine={diagramEngine}
      factory={diagramEngine.getFactoryForLink(link)}
      link={link}
      ref={ref => { refPaths.current[j] = ref; }}
      onSelection={setSelected}
      extras={{
        'data-linkid': link.getID(),
        'data-point': j,
        onMouseDown: handleDown,
        onMouseEnter: handleEnter,
      }}
    />
  ));

  return <g data-default-link-test={link.getOptions().testName}>{paths}</g>;
};

HierarchyLinkWidget.defaultProps = {
  color: 'red',
  width: 3,
  link: null,
  smooth: false,
  diagramEngine: null,
  factory: null,
};


export default HierarchyLinkWidget;
