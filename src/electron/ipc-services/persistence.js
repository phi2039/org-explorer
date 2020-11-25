const PersistenceService = ({ dataService }) => {
  const loadData = async (location) => {
    const data = await dataService.loadFile(location);
    console.log('[PersistenceService]Loaded', location);
    return data;
  };

  const saveData = async (data, location) => {
    if (location) {
      await dataService.saveFile(data, location);
      console.log('[PersistenceService]saved', location);
    }
  };

  return {
    loadData,
    saveData,
  };
};

module.exports = PersistenceService;
