import React, { useState, useEffect } from 'react';
import { PropTypes, arrayOf } from 'prop-types';

import * as WebDataRocksReact from '../../lib/webdatarocks.react';

import flatten from '../../lib/util/tree-flatten';

const schema = {
  path: {
    type: 'string',
  },
  type: {
    type: 'string'
  },
  description: {
    type: 'hidden',
  },
  manager: {
    type: 'string',
  },
  payerFacing: {
    type: 'string',
  },
  providerFacing: {
    type: 'string',
  },
  requiresPHI: {
    type: 'string',
  },
  requiredCredentials: {
    type: 'hidden',
  },
  currentFTE: {
    type: 'number',
  },
  managerFTE: {
    type: 'number',
  },
  plannedFTE: {
    type: 'number',
  },
  currentTotalFTE: {
    type: 'hidden',
  },
  currentTotalWorkloads: {
    type: 'hidden',
  },
  currentTotalOverhead: {
    type: 'hidden',
  },
  payerFacingInstances: {
    type: 'hidden',
  },
  providerFacingInstances: {
    type: 'hidden',
  },
  PHIInstances: {
    type: 'hidden',
  },
  payerFacingFTE: {
    type: 'hidden',
  },
  providerFacingFTE: {
    type: 'hidden',
  },
  PHIFTE: {
    type: 'hidden',
  },
};

const transformData = data => {
  const flat = flatten(data);
  const depth = flat.reduce((a, b) => Math.max(a, b.level), 0);

  const levelFields = Array.from(new Array(depth)).map((i, index) => `L${index + 1}`);
  const levels = levelFields.reduce((acc, item, index) => ({
    ...acc,
    [item]: {
      type: 'level',
      hierarchy: 'Org',
      parent: `L${index}`,
      level: `L${index + 1}`,
    },
  }), {});

  delete levels.L1.parent;
  delete levels.L1.level;

  return [
    {
      ...levels,
      ...schema,
    },
    ...flat,
  ];
};

const containerStyle = {
  position: 'relative',
  overflow: 'hidden',
  height: '100vh',
  width: '100%',
  border: 'solid 1px #aaa',
  display: 'flex',
  flexDirection: 'column',
}

const Pivot = ({ orgData, style = {}, ...props }) => {
  if (!orgData) {
    return null;
  }

  const data = transformData(orgData);

  return <div style={{ ...containerStyle, ...style }} {...props}>
    <h3>Workload Reporting</h3>
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <WebDataRocksReact.Pivot report={{
        dataSource: { data },
        grid: {
          showHeaders: false,
        }
      }} height="100%" />
    </div>
  </div>
};

export default Pivot;
