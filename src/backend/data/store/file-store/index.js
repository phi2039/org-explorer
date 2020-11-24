const path = require('path');
const isUrl = require('is-url');

const { readFile: readLocalFile, writeFile: writeLocalFile } = require('./local');
const readRemoteFile = require('./url');

const yamlLoader = require('../../loaders/yaml-loader');
const excelLoader = require('../../loaders/excel-loader');

const dataTypeLoaders = {
  excel: excelLoader,
  yaml: yamlLoader,
};

const fileTypeLoaders = {
  '.xlsx': dataTypeLoaders.excel,
  '.xlsb': dataTypeLoaders.excel,
  '.xlsm': dataTypeLoaders.excel,
  '.yaml': dataTypeLoaders.yaml,
  '.yml': dataTypeLoaders.yaml,
  '.org': dataTypeLoaders.yaml,
};

const readLocal = async (file, format) => {
  let loader;
  if (format) {
    loader = dataTypeLoaders[format];
  } else {
    const extension = path.extname(file);
    loader = fileTypeLoaders[extension];
  }
  if (!loader) {
    throw new Error('Unknown file type');
  }

  const buf = await readLocalFile(file);
  const data = await loader.load(buf);
  return data;
};

const writeLocal = async (data, file, format) => {
  let loader;
  if (format) {
    loader = dataTypeLoaders[format];
  } else {
    const extension = path.extname(file);
    loader = fileTypeLoaders[extension];
  }
  if (!loader) {
    throw new Error('Unknown file type');
  }

  const buf = await loader.store(data);
  await writeLocalFile(file, buf);
};

const readRemote = async (url, format) => {
  const loader = dataTypeLoaders[format];
  if (!loader) {
    throw new Error('Unknown or unspecified file type');
  }

  const buf = await readRemoteFile(url);
  const data = loader(buf);
  return data;
};

const readFile = async (spec, format) => {
  const data = isUrl(spec)
    ? await readRemote(spec, format)
    : await readLocal(spec, format);
  return data;
};

const writeFile = async (data, spec, format) => {
  if (isUrl(spec)) {
    throw new Error('cannot write to URL locations');
  }
  await writeLocal(data, spec, format);
};

module.exports = {
  readFile,
  writeFile,
};
