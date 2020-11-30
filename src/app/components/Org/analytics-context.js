import React, {
  createContext,
  useContext,
} from 'react';
import { PropTypes } from 'prop-types';

import { metrics, measures } from './metrics';
import { useGraph } from './state';
import useGraphAnalytics from './hooks/useGraphAnalytics';
import { useEntities } from '../../state/entity-store';

const AnalyticsContext = createContext();

const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error(
      'useAnalytics must be used within a AnalyticsProvider',
    );
  }
  return context;
};

const AnalyticsProvider = ({ children }) => {
  const { entities } = useEntities();
  const graph = useGraph();
  const analytics = useGraphAnalytics(graph, entities, { metrics, measures });

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};

AnalyticsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.string,
  ]).isRequired,
};

export {
  AnalyticsProvider,
  useAnalytics,
};
