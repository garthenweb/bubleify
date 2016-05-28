const test = require('tap').test;
const vm = require('vm');
const spawn = require('child_process').spawn;

const browserify = require('browserify');
const bubleify = require('../index');

const quadPath = require.resolve('./files/quad.js');
const quadPkgPath = require.resolve('./pkg/quad.js');
const bubleifyPath = require.resolve('../index.js');
const browserifyCmd = require.resolve('../node_modules/.bin/browserify');

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

test('simple cli', (t) => {
  const bProcess = spawn(browserifyCmd, [
    '-r', `${quadPath}:quad`,
    '-t', '[', bubleifyPath, ']',
  ], { shell: true });

  let out = '';
  let err = '';
  bProcess.stdout.on('data', (buf) => {
    out += buf;
  });
  bProcess.stderr.on('data', (buf) => {
    err += buf;
  });

  bProcess.on('error', (processErr) => {
    throw processErr;
  });
  bProcess.on('exit', () => {
    t.error(err);
    t.equal(runContextQuad5(out), 25);
    t.end();
  });
});
