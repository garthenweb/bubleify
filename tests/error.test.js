const { test } = require('tap');

const browserify = require('browserify');
const bubleify = require('../index');

const errorExportPath = require.resolve('./files/error.export.js');
const errorTemplatePath = require.resolve('./files/error.template.js');

test('throw on error', (t) => {
  const b = browserify({ debug: true });
  b.require(errorExportPath);
  b.transform(bubleify, { transforms: { modules: true } });
  b.bundle((err, src) => {
    t.notOk(src);
    t.end();
  });
});

test('throw on error with buble custom message', (t) => {
  const b = browserify({ debug: true });
  b.require(errorTemplatePath);
  b.transform(bubleify, { bubleError: true });
  b.bundle((err, src) => {
    t.notOk(src);
    t.type(err, 'string');
    t.match(err, /myTag`test`/ig, 'err should contain the failing code');
    t.end();
  });
});

