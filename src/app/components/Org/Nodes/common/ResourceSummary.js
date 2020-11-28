import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import {
  FiUsers,
  FiSettings,
} from 'react-icons/fi';

const ResourceSummaryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const ResourceItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ResourceIconContainer = styled.span`
  margin-right: 1rem;
`;

const ResourceSummary = ({ fte, workloads }) => (
  <ResourceSummaryContainer>
    <ResourceItemContainer>
      <ResourceIconContainer>
        <FiUsers size="1.5em" />
      </ResourceIconContainer>
      {fte}
    </ResourceItemContainer>
    {workloads !== undefined && (
      <ResourceItemContainer>
        <ResourceIconContainer>
          <FiSettings size="1.5em" />
        </ResourceIconContainer>
        {workloads}
      </ResourceItemContainer>
    )}
  </ResourceSummaryContainer>
);

ResourceSummary.propTypes = {
  fte: PropTypes.number,
  workloads: PropTypes.number,
};

ResourceSummary.defaultProps = {
  fte: 0,
  workloads: undefined,
};

export default ResourceSummary;
