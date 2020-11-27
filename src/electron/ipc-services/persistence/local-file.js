const fs = require('fs');

const LocalFileProvider = () => {
  const load = async (location) => {
    const data = await fs.promises.readFile(location);
    return data;
  };

  const store = async (data, location) => {
    if (location) {
      const buf = Buffer.from(data);
      await fs.promises.writeFile(location, buf);
    }
  };

  return {
    load,
    store,
  };
};

module.exports = LocalFileProvider;
