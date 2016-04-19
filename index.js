const buble = require('buble');
const stream = require('stream');
const util = require('util');

function Bubleify(filename) {
  if (!(this instanceof Bubleify)) {
    return new Bubleify(filename);
  }

  stream.Transform.call(this);
  this._data = '';
  this._filename = filename;
}

Bubleify.prototype = {
  _transform(buf, enc, callback) {
    this._data += buf;
    callback();
  },

  _flush(callback) {
    try {
      const result = buble.transform(this._data);
      this.emit('bubleify', result, this._filename);
      this.push(result.code);
    } catch (err) {
      this.emit('error', err);
      return;
    }
    callback();
  },
};

util.inherits(Bubleify, stream.Transform);
module.exports = Bubleify;
