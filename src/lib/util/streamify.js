const { Readable } = require('stream');

const streamify = buf => {
  const readable = new Readable();
  readable._read = () => { // eslint-disable-line no-underscore-dangle
    console.log('read');
  }; // _read is required but you can noop it
  readable.push(buf);
  readable.push(null);
  return readable;
};

module.exports = streamify;
