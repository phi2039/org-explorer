import React from 'react';
import { PropTypes } from 'prop-types';

import { useSettingsState } from './settings';

import useEntity from './hooks/useEntity';
import useCalculatedValues from './hooks/useCalculatedValues';
import useEntityActions from './hooks/useEntityActions';

const mapNodeProps = ({
  isActiveRoot,
  isSelected,
  isExpanded,
  toggleState,
  setActiveRoot,
  resetActiveRoot,
  select,
  ...props
}) => ({
  collapsed: !isExpanded,
  isRoot: !setActiveRoot,
  isSelected,
  toggleState,
  setRoot: setActiveRoot,
  focused: isActiveRoot,
  resetRoot: resetActiveRoot,
  onClick: select,
  ...props,
});

const OrgNode = ({
  node,
  components,
  ...props
}) => {
  const { subjectId: entityId } = node;

  const { viewMode } = useSettingsState();

  const entity = useEntity(entityId);
  const handlers = useEntityActions(entity);
  const calculatedValues = useCalculatedValues(entity);

  if (!entity) {
    return null;
  }

  const Component = components[entity.type] || components.default;

  const nodeProps = mapNodeProps({
    node,
    viewMode,
    entity: {
      ...entity,
      ...calculatedValues,
    },
    ...handlers,
    ...props,
  });
  return <Component {...nodeProps} />;
};

OrgNode.propTypes = {
  node: PropTypes.shape({
    subjectId: PropTypes.string,
  }).isRequired,
  components: PropTypes.objectOf(PropTypes.elementType).isRequired,
};

export default OrgNode;
