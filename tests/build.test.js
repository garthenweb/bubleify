const test = require('tap').test;
const vm = require('vm');

const browserify = require('browserify');
const bubleify = require('../index');

const quadPath = require.resolve('./files/quad.js');
const quadPkgPath = require.resolve('./pkg/quad.js');
const simpleJSONPath = require.resolve('./files/simple.json');

const runContextQuad5 = (src) => {
  const sandbox = {};
  const srcStr = typeof src !== 'string' ? src.toString('utf8') : src;
  vm.runInNewContext(srcStr, sandbox);
  return sandbox.require('quad')(5);
};

test('simple js api', (t) => {
  const b = browserify();
  b.require(quadPath, { expose: 'quad' });
  b.transform(bubleify);
  b.bundle((err, src) => {
    t.error(err);
    t.equal(runContextQuad5(src), 25);
    t.end();
  });
});

test('simple js api with package.json', (t) => {
  const b = browserify();
  b.require(quadPkgPath, { expose: 'quad' });
  b.bundle((err, src) => {
    t.error(err);
    t.equal(runContextQuad5(src), 25);
    t.end();
  });
});

test('ignoring of undefined extensions (json)', (t) => {
  const b = browserify();
  b.require(simpleJSONPath);
  b.transform(bubleify);
  b.bundle((err, src) => {
    t.error(err);
    t.match(src.toString('utf8'), /module.exports={"test":"test","test2":5}/);
    t.end();
  });
});
