const test = require('tap').test;

const browserify = require('browserify');
const bubleify = require('../index');

const errorPath = require.resolve('./files/error.js');

test('throw on error', (t) => {
  const b = browserify({ debug: true });
  b.require(errorPath);
  b.transform(bubleify, { transforms: { modules: true } });
  b.bundle((err, src) => {
    t.notOk(src);
    t.end();
  });
});
