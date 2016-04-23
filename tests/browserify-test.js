const path = require('path');
const browserify = require('browserify');
const bubleify = require('../index');

const b = browserify({ debug: true });
b.add(path.join(__dirname, './test-file.js'));
b.transform(bubleify, {
  target: { chrome: 50 },
  transforms: { arrow: true },
});
module.exports = b.bundle();
