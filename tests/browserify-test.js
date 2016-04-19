const path = require('path');
const browserify = require('browserify');
const bubleify = require('../index');

const b = browserify();
b.add(path.join(__dirname, './test-file.js'));
b.transform(bubleify);
b.bundle();
