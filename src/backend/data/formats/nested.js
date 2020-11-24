const { normalize, schema } = require('normalizr');
const { pick } = require('lodash');
const cuid = require('cuid');

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

const normalizeData = data => {
  if (!data) {
    return {};
  }

  const enhanced = ensureIds(data[0] || data);

  const normalizedData = normalize(enhanced, nodeSchema);

  return {
    entities: normalizedData.entities.nodes,
    root: normalizedData.result,
  };
};

module.exports = normalizeData;
