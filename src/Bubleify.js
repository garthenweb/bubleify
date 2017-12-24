import { transform } from 'buble';
import { Transform, PassThrough } from 'stream';
import { EOL } from 'os';
import { extname } from 'path';

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

    // copy properties to not modify the existing objects
    // set default transforms with deactivated modules
    options.transforms = Object.assign({ modules: false }, this._options.transforms);
    options.target = Object.assign({}, this._options.target);

    // remove browserify options
    delete options._flags;
    delete options.sourceMap;
    delete options.extensions;
    delete options.bubleError;

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
      // emit buble error message instead of the default error
      if (this._options.bubleError && err.snippet) {
        this.emit('error', `---${EOL}${err.snippet}${EOL}${EOL}${err.message}${EOL}`);
      } else {
        this.emit('error', err);
      }
      return;
    }
    cb();
  }
}

export default (filename, options) => {
  // get extensions or defaults
  let { extensions = ['.js', '.jsx', '.es', '.es6'] } = options;
  // convert to json
  extensions = Array.isArray(extensions) ? extensions : [extensions];

  const enrishedOptions = Object.assign({
    sourceMap: true,
    bubleError: false,
  }, options, { extensions });

  const shouldIgnoreFile = extensions.indexOf(extname(filename)) === -1;
  // return empty stream for files that should not be transformed
  if (shouldIgnoreFile) {
    // eslint-disable-next-line new-cap
    return PassThrough();
  }

  return new Bubleify(filename, enrishedOptions);
};
