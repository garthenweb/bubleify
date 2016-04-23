'use strict';

const test = require('tap').test;
const assign = require('object-assign');
const bubleify = require('../index');

test('buble passed options', (t) => {
  const filename = './test.js';
  const _flags = {};
  const transforms = { myCustomTransform: false };
  const target = { Chrome: 50, Firefox: 43, Edge: 12 };

  const tBuble = bubleify(filename, { _flags, transforms, target });

  t.equal(tBuble._bubleOptions._flags, undefined);

  t.match(tBuble._bubleOptions.transforms, assign({ modules: false }, transforms));
  t.notEqual(tBuble._bubleOptions.transforms, transforms);

  t.match(tBuble._bubleOptions.target, target);
  t.notEqual(tBuble._bubleOptions.target, target);

  t.equal(tBuble._bubleOptions.source, filename);
  t.end();
});
