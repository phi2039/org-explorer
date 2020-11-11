import React from 'react';
import { PropTypes } from 'prop-types';

import './Hierarchy.css';

const NodeLineBelow = ({ span }) => (
  <td colSpan={span} className="nodeGroupCellLines">
    <table className="nodeLineTable">
      <tbody>
        <tr>
          <td colSpan={2} className="nodeLineCell nodeGroupLineVerticalMiddle" />
          <td colSpan={2} className="nodeLineCell" />
        </tr>
      </tbody>
    </table>
  </td>
);

const hasSiblingRight = (childrenCount, childIndex) => {
  return childIndex < (childrenCount - 1)
};

const hasSiblingLeft = (childIndex) => {
  return childIndex > 0
};

const ChildrenLinesAbove = ({ span }) => {
  return Array.from({length: span / 2}, (v, childIndex) => (
    <td colSpan="2" className="nodeGroupCellLines" key={childIndex}>
      <table className="nodeLineTable">
        <tbody>
          <tr>
            <td colSpan={2} className={ 'nodeLineCell nodeGroupLineVerticalMiddle' + (hasSiblingLeft(childIndex) ? ' nodeLineBorderTop' : '') } />
            <td colSpan={2} className={ 'nodeLineCell' + (hasSiblingRight(span / 2, childIndex) ? ' nodeLineBorderTop' : '') } />
          </tr>
        </tbody>
      </table>
    </td>
  ));
};

const HierarchyContentRow = ({ content, span }) => (
  <tr>
    <td className="nodeCell" colSpan={span}>
      {content}
    </td>
  </tr>
);

const HierarchyLines = ({ span }) => (
  <>
    <tr>
      <NodeLineBelow span={span} />
    </tr>
    <tr>
      <ChildrenLinesAbove span={span} />
    </tr>
  </>
);

export const HierarchyNode = ({ content, children, expand }) => {
  const nodes = React.Children.toArray(children);
  const renderChildren = (expand && nodes.length);

  return (
    <td colSpan="2" className="nodeGroupCell">
      <table className="orgNodeChildGroup">
        <tbody>
          <HierarchyContentRow content={content} span={nodes.length * 2}/>
          {
            renderChildren ?
              <>
                <HierarchyLines span={nodes.length * 2} />
                <tr>
                  {children}
                </tr>
              </> : null
          }
        </tbody>
      </table>
    </td>
  );
};

HierarchyNode.propTypes = {
  content: PropTypes.element.isRequired,
  expand: PropTypes.bool,
};

HierarchyNode.defaultProps = {
  expand: false,
};

const Hierarchy = ({ children }) => {
  return (
    <div className="reactHierarchy">
      <table>
        <tbody>
          <tr>
            {children}
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default Hierarchy;
