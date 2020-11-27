const excelConfig = {
  sheets: [{
    key: 'group',
    name: 'Groups',
    columns: [{
      key: 'id',
      type: 'string',
      heading: 'Id',
    }, {
      key: 'name',
      type: 'string',
      heading: 'Name',
    }, {
      key: 'manager',
      type: 'number',
      heading: 'Manager',
    }, {
      key: 'managerFTE',
      type: 'number',
      heading: 'Manager FTE',
    }, {
      key: 'parent',
      type: 'string',
      heading: 'Parent',
    }],
  }, {
    key: 'function',
    name: 'Workloads',
    columns: [{
      key: 'id',
      type: 'string',
      heading: 'Id',
    }, {
      key: 'name',
      type: 'string',
      heading: 'Name',
    }, {
      key: 'currentFTE',
      type: 'number',
      heading: 'FTE',
    }, {
      key: 'providerFacing',
      type: 'boolean',
      heading: 'Provider Facing',
    }, {
      key: 'payerFacing',
      type: 'boolean',
      heading: 'Payer Facing',
    }, {
      key: 'requiresPHI',
      type: 'boolean',
      heading: 'Requires PHI',
    }, {
      key: 'parent',
      type: 'string',
      heading: 'Group',
    }],
  }],
};

const exporters = {
  json: [{
    transform: 'json',
    operation: 'dump',
  }],
  yaml: [{
    transform: 'yaml',
    operation: 'dump',
  }],
  xlsx: [{
    transform: 'array',
    operation: 'group',
    config: {
      key: 'type',
    },
  }, {
    transform: 'excel',
    operation: 'dump',
    config: excelConfig,
  }],
};

export default exporters;
