# Bubléify [![build status][1]][2] [![Coverage Status][3]][4]

A browserify transform for [Bublé](https://www.npmjs.com/package/buble) to transform ES2015 to ES5.

## Installation

``` bash
npm install --save-dev bubleify
```

## Usage

### Node

``` javascript
const browserify = require('browserify');
const bubleify = require('bubleify');

const b = browserify();
b.add('./file.es2015.js'));
b.transform(bubleify, {
  target: {
    chrome: 48,
    firefox: 44,
  },
  transforms: {
    arrow: true,
    defaultParameter: false,
    dangerousForOf: true,
  },
});
b.bundle();
```

### CLI

``` bash
browserify script.js -o bundle.js -t [ bubleify ]
```

## Options

### target: Object

Target specifies a list of environments the output file should be compatible to. Bublè will decide based on this list which transforms should be used.

### transforms: Object

Transforms define which ES2015 features should or should not be transformed into ES5.

Bublèify by default disables the `module` transform to not throw an error when ES2015 `import` and `export` statements are used. If you want to use ES2015 modules you should add another transform to do so.

Find a list of all transforms on the Bublè documentation in section [list of transforms](http://buble.surge.sh/guide/#list-of-transforms). For more detailed information about each transform also see [supported features](http://buble.surge.sh/guide/#supported-features) and [dangerous transforms](http://buble.surge.sh/guide/#dangerous-transforms).

### sourceMap: Boolean

Define whether an inline source map should or should not be created by Bublé. Default is `true`.

_Please note that browserify will not output any source map if debug mode is `false`, even if sourceMap was set to `true`._

## Credits

Thanks goes to [Rich Harris](https://twitter.com/rich_harris) for the [Bublè](https://www.npmjs.com/package/buble) package.

## License

Licensed under the [MIT License](https://opensource.org/licenses/mit-license.php).

[1]: https://travis-ci.org/garthenweb/bubleify.svg
[2]: https://travis-ci.org/garthenweb/bubleify
[3]: https://coveralls.io/repos/github/garthenweb/bubleify/badge.svg?branch=master
[4]: https://coveralls.io/github/garthenweb/bubleify?branch=master
