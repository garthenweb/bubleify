import buble from 'buble';
import { Transform } from 'stream';

class Bubleify extends Transform {
  constructor(filename, options) {
    super();
    this._data = '';
    this._filename = filename;
    this._options = options;
  }

  get _bubleOptions() {
    const defaults = { source: this._filename };
    const options = Object.assign(defaults, this._options);
    // set default transforms with deactivated modules
    options.transforms = Object.assign({ modules: false }, options.transforms);

    // remove browserify options
    delete options._flags;

    return options;
  }

  _transform(buf, enc, callback) {
    this._data += buf;
    callback();
  }

  _flush(callback) {
    try {
      const result = buble.transform(this._data, this._bubleOptions);
      let { code } = result;

      // append sourcemaps to code
      if (this._options._flags.debug) {
        code += `\n//# sourceMappingURL=${result.map.toUrl()}`;
      }

      this.emit('bubleify', result, this._filename);
      this.push(code);
    } catch (err) {
      this.emit('error', err);
      return;
    }
    callback();
  }
}

export default (filename, options) => new Bubleify(filename, options);
