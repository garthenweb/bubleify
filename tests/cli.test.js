const test = require('tap').test;
const vm = require('vm');
const spawn = require('child_process').spawn;

const quadPath = require.resolve('./files/quad.js');
const quadPathBuble = require.resolve('./files/quad.buble');
const bubleifyPath = require.resolve('../index.js');
const browserifyCmd = require.resolve('../node_modules/.bin/browserify');

const testContextQuad5 = (b, t) => {
  let out = '';
  let err = '';
  b.stdout.on('data', (buf) => {
    out += buf;
  });
  b.stderr.on('data', (buf) => {
    err += buf;
  });

  b.on('error', (processErr) => {
    throw processErr;
  });

  b.on('exit', () => {
    const sandbox = {};
    const srcStr = typeof out !== 'string' ? out.toString('utf8') : out;
    vm.runInNewContext(srcStr, sandbox);
    const result = sandbox.require('quad')(5);

    t.error(err);
    t.equal(result, 25);
    t.end();
  });
};

test('simple cli', (t) => {
  const bProcess = spawn(browserifyCmd, [
    '-r', `${quadPath}:quad`,
    '-t', '[', bubleifyPath, ']',
  ], { shell: true });

  testContextQuad5(bProcess, t);
});

test('cli with extension', (t) => {
  const bProcess = spawn(browserifyCmd, [
    '-r', `${quadPathBuble}:quad`,
    '-t', '[', bubleifyPath, '--extensions .buble]',
  ], { shell: true });

  testContextQuad5(bProcess, t);
});
