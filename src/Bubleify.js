import buble from 'buble';
import assign from 'object-assign';
import { Transform } from 'stream';

class Bubleify extends Transform {
  constructor(filename, options) {
    super();
    this._data = '';
    this._filename = filename;
    this._options = assign({ _flags: {} }, options);
  }

  get _bubleOptions() {
    const defaults = { source: this._filename };
    const options = assign(defaults, this._options);

    // copy properties to not modify the existing objects
    // set default transforms with deactivated modules
    options.transforms = assign({ modules: false }, this._options.transforms);
    options.target = assign({}, this._options.target);

    // remove browserify options
    delete options._flags;

    return options;
  }

  _transform(buf, enc, cb) {
    this._data += buf;
    cb();
  }

  _flush(cb) {
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
    cb();
  }
}

export default (filename, options) => new Bubleify(filename, options);
