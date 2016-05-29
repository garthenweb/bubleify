const fs = require('fs');
const test = require('tap').test;

const convert = require('convert-source-map');
const browserify = require('browserify');
const bubleify = require('../index');

const quadPath = require.resolve('./files/quad.js');
const quadCode = fs.readFileSync(quadPath, 'utf-8');

test('sourcemap in debug mode', (t) => {
  const b = browserify({ debug: true });
  b.require(quadPath);
  b.transform(bubleify);
  b.bundle((err, src) => {
    t.error(err);
    const sourceMap = convert.fromSource(src.toString()).toObject();
    t.equal(sourceMap.sourcesContent[1], quadCode);
    t.end();
  });
});

test('disabling sourcemap via bubleify option', (t) => {
  const b = browserify({ debug: true });
  b.require(quadPath);
  b.transform(bubleify, { sourceMap: false });
  b.bundle((err, src) => {
    t.error(err);
    const sourceMap = convert.fromSource(src.toString()).toObject();
    t.notEqual(sourceMap.sourcesContent[1], quadCode);
    t.end();
  });
});
