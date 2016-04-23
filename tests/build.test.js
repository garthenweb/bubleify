'use strict';

var test = require('tap').test;
var vm = require('vm');
var spawn = require('child_process').spawn;

var browserify = require('browserify');
var bubleify = require('../index');

var quadPath = require.resolve('./files/quad.js');
var quadPkgPath = require.resolve('./pkg/quad.js');
var bubleifyPath = require.resolve('../index.js');
var browserifyCmd = require.resolve('../node_modules/.bin/browserify');

var runContextQuad5 = function(src) {
  var sandbox = {};
  vm.runInNewContext(src, sandbox);
  return sandbox.require('quad')(5);
};

test('simple js api', function(t) {
  var b = browserify();
  b.require(quadPath, { expose: 'quad' });
  b.transform(bubleify);
  b.bundle(function(err, src) {
    t.error(err);
    t.equal(runContextQuad5(src), 25);
    t.end();
  });
});

test('simple js api with package.json', function(t) {
  var b = browserify();
  b.require(quadPkgPath, { expose: 'quad' });
  b.bundle(function(err, src) {
    t.error(err);
    t.equal(runContextQuad5(src), 25);
    t.end();
  });
});

test('simple cli', function(t) {
  var bProcess = spawn(browserifyCmd, [
    '-r ' + quadPath + ':quad',
    '-t [ ' + bubleifyPath + ' ]',
  ], { shell: true });

  var out = '';
  var err = '';
  bProcess.stdout.on('data', function onData(buf) {
    out += buf;
  });
  bProcess.stderr.on('data', function onError(buf) {
    err += buf;
  });

  bProcess.on('error', function onError(processErr) {
    throw processErr;
  });
  bProcess.on('exit', function onExit() {
    t.error(err);
    t.equal(runContextQuad5(out), 25);
    t.end();
  });
});
