import buble from 'buble';
import { Transform } from 'stream';

class Bubleify extends Transform {
  constructor(filename, ...args) {
    super(filename, ...args);
    this._data = '';
    this._filename = filename;
  }

  _transform(buf, enc, callback) {
    this._data += buf;
    callback();
  }

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
  }
}

export default (filename) => new Bubleify(filename);
