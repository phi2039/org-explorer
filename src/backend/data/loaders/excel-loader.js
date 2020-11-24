const _ = require('lodash');
const readXlsxFile = require('read-excel-file/node');

const streamify = require('../../../lib/util/streamify');

const groupSheetName = 'Team';
const groupFieldNameMap = {
  Group: 'name',
  Parent: 'parent',
  Manager: 'manager',
  'Manager FT': 'managerFTE',
};
const functionSheetName = 'Workload';
const functionFieldNameMap = {
  Group: 'group',
  Function: 'name',
  Description: 'description',
  'Payer-facing': 'payerFacing',
  'Provider-facing': 'providerFacing',
  PHI: 'requiresPHI',
  Credentials: 'requiredCredentials',
  'Current FTE': 'currentFTE',
  'Planned FTE': 'plannedFTE',
};

const readSheet = async (data, sheetName) => {
  const stream = streamify(data);
  const res = await readXlsxFile(stream, { sheet: sheetName });
  return res;
};

const parseObject = (fields, fieldNameMap) => row => {
  const obj = _.zipObject(fields, row);
  return Object.entries(fieldNameMap).reduce((acc, [from, to]) => {
    acc[to] = obj[from];
    return acc;
  }, {});
};

const parseObjects = fieldNameMap => rows => {
  const fields = rows[0];
  return rows.slice(1).map(parseObject(fields, fieldNameMap));
};

const readObjects = async (fileName, sheetName) => {
  const res = await readSheet(fileName, sheetName);
  return res;
};

const groupFunctions = transform => functions => _.groupBy(functions, transform);

const attachFunctions = functions => groups => groups.map(group => ({
  ...group,
  functions: functions[group.name] || [],
}));

const getChildren = groups => name => groups.filter(item => item.parent === name);

const buildTree = groups => branch => {
  const branchGroups = getChildren(groups)(branch.name);
  if (branchGroups) {
    return {
      ...branch,
      groups: branchGroups.map(buildTree(groups)),
    };
  }
  return branch;
};

// eslint-disable-next-line import/prefer-default-export
const loadExcelData = async (fileName) => {
  const functionObjects = await readObjects(fileName, functionSheetName);
  const parsedFunctions = parseObjects(functionFieldNameMap)(functionObjects);
  const functions = groupFunctions('group')(parsedFunctions);

  const groups = await readObjects(fileName, groupSheetName)
    .then(parseObjects(groupFieldNameMap))
    .then(attachFunctions(functions));

  const tree = buildTree(groups)(groups[0]);
  // console.log(yaml.dump(tree));

  return tree;
};

module.exports = {
  load: loadExcelData,
  store: () => { throw new Error('loader does not support writing'); },
};
