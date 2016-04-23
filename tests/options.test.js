'use strict';

var test = require('tap').test;
var assign = require('object-assign');
var bubleify = require('../index');

test('buble passed options', function(t) {
  var filename = './test.js';
  var _flags = {};
  var transforms = { myCustomTransform: false };
  var target = { Chrome: 50, Firefox: 43, Edge: 12 };

  var tBuble = bubleify(filename, {
    _flags: _flags,
    transforms: transforms,
    target: target
  });

  t.equal(tBuble._bubleOptions._flags, undefined);

  t.match(tBuble._bubleOptions.transforms, assign({ modules: false }, transforms));
  t.notEqual(tBuble._bubleOptions.transforms, transforms);

  t.match(tBuble._bubleOptions.target, target);
  t.notEqual(tBuble._bubleOptions.target, target);

  t.equal(tBuble._bubleOptions.source, filename);
  t.end();
});
