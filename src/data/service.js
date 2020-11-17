import { normalize, schema } from 'normalizr';

const nodeSchema = new schema.Entity('nodes');

const nodeArraySchema = new schema.Array({
  nodes: nodeSchema,
}, () => 'nodes');

nodeSchema.define({ children: nodeArraySchema });

export const normalizeOrg = data => {
  if (!data) {
    return {};
  }

  const normalizedData = normalize(data, nodeSchema);
  return {
    entities: normalizedData.entities,
    root: normalizedData.result,
  };
};

const DataService = () => {
  console.log('create data service');

  const state = {};

  return {
    load: async (data) => {
      const normalizedData = normalizeOrg(data);
      state.entities = normalizedData.entities || {};
      console.log('loaded data', state.entities);
    },
    getAllEntities: () => state.entities || {},
    getEntity: (id, entitySchema = 'nodes') => ((state.entities || {})[entitySchema] || {})[id],
  };
};

export default DataService;
