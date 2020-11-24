const { readFile, writeFile } = require('./store/file-store');

const denormalizeEntity = ({
  id,
  type,
  parent,
  name,
  annotations = [],
  measures = [],
}) => ({
  id,
  type,
  parent,
  name,
  ...annotations.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  ...measures.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
});

const normalizeEntity = ({
  id,
  type,
  parent,
  name,
  ...rest
}) => ({
  id,
  type,
  parent,
  name,
  annotations: Object.entries({ ...rest }).filter(([, value]) => typeof value === 'string'),
  measures: Object.entries({ ...rest }).filter(([, value]) => ['number', 'boolean'].includes(typeof value)),
});

const OrgDataService = () => {
  const loadFile = async (location, format) => {
    const data = await readFile(location, format);
    return data.map(denormalizeEntity).reduce((acc, entity) => ({ ...acc, [entity.id]: entity }), {});
  };

  const saveFile = async (entities, location, format) => {
    const normalizedData = Object.values(entities).map(normalizeEntity);
    await writeFile(normalizedData, location, format);
  };

  return {
    loadFile,
    saveFile,
  };
};

module.exports = OrgDataService;
