import { transform } from 'buble';
import assign from 'object-assign';
import { Transform } from 'stream';
import { EOL } from 'os';

class Bubleify extends Transform {
  constructor(filename, options) {
    super();
    this._data = '';
    this._filename = filename;
    this._options = assign({ sourceMap: true }, options);
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
      const result = transform(this._data, this._bubleOptions);
      let { code } = result;

      if (this._options.sourceMap) {
        // append sourcemaps to code
        code += `${EOL}//# sourceMappingURL=${result.map.toUrl()}`;
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
