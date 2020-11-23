const cuid = require('cuid');

const { normalize, schema } = require('normalizr');
const { pick } = require('lodash');

const { readFile } = require('./store/file-store');

const ensureIds = (node, parent = null) => {
  const id = node.id || cuid();
  return {
    id,
    ...node,
    parent,
    children: (node.children || []).map(child => ensureIds(child, id)),
  };
};

const groupAttributes = [
  'id',
  'type',
  'name',
  'manager',
  'children',
  'parent',
  'managerFTE',
];

const functionAttributes = [
  'id',
  'type',
  'parent',
  'name',
  'description',
  'payerFacing',
  'providerFacing',
  'requiresPHI',
  'currentFTE',
];

const whitelistAttributes = entity => pick(entity, entity.type === 'group' ? groupAttributes : functionAttributes);

const nodeSchema = new schema.Entity('nodes', {}, {
  processStrategy: whitelistAttributes,
});

const nodeArraySchema = new schema.Array({
  nodes: nodeSchema,
}, () => 'nodes');

nodeSchema.define({ children: nodeArraySchema });

// const mapEntity = entity =>
const normalizeData = data => {
  if (!data) {
    return {};
  }

  const normalizedData = normalize(data, nodeSchema);
  return {
    entities: normalizedData.entities,
    root: normalizedData.result,
  };
};

const OrgDataService = () => {
  let root = null;

  const getRoot = () => root;

  const getEntities = () => normalizeData(root).entities;

  const loadFile = async (location, format) => {
    const data = await readFile(location, format);
    root = ensureIds(data[0] || data); // eslint-disable-line prefer-destructuring
  };

  const saveFile = async (location, format) => {

  };

  return {
    loadFile,
    saveFile,
    getRoot,
    getEntities,
  };
};

module.exports = OrgDataService;
