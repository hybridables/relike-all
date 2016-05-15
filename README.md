# [relike-all][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Promisify all function in an object, using [relike][].

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
```
npm i relike-all --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const relikeAll = require('relike-all')
```

### [relikeAll](index.js#L46)
> Promisify functions in an object. You can pass `pattern` to filter what should be promisified and what not. Using [is-match][], which is thin wrapper around [micromatch][]. You should install [is-match][], if you want to use filtering.

**Params**

* `<source>` **{Object|Function}**: The source object to promisify.    
* `[pattern]` **{String|Array|RegExp|Function}**: A glob pattern to filter, using [micromatch][].    
* `[options]` **{Object}**: Options passed to [micromatch][].    
* `returns` **{Object|Function}**: Same as incoming `source`.  

**Example**

```js
const relikeAll = require('relike-all')
const fs = relikeAll(require('fs'))

fs.readFile('package.json', 'utf8')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => 'relike-all'
    return 'package.json'
  })
  .then(fs.statSync)
  .then(stats => {
    console.log(stats) // => Stats object
  }, err => {
    console.error(err.stack)
  })
```

### [.promisify](index.js#L102)
> Returns a function that will wrap the given `fn`. Instead of taking a callback, the returned function will return a promise whose fate is decided by the callback behavior of the given `fn` node function. The node function should conform to node.js convention of accepting a callback as last argument and calling that callback with error as the first argument and success value on the second argument. – [Bluebird Docs on `.promisify`](http://bluebirdjs.com/docs/api/promise.promisify.html)

**Params**

* `fn` **{Function}**: Some sync or async function to promisify.    
* `[Promize]` **{Function}**: Promise constructor to be used on enviroment where no support for native.    
* `returns` **{Function}**: Promisified function, which always return a Promise.  

**Example**

```js
const fs = require('fs')
const relikeAll = require('relike-all')
const readFile = relikeAll.promisify(fs.readFile)

readFile('package.json', 'utf8')
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) // => 'relike-all'
  }, err => {
    console.error(err.stack)
  })
```

### .Promise
> Customizing what Promise constructor to be used in old environments where there's no support for native Promise.  
See more in [relike's `.Promise` section](https://github.com/hybridables/relike#promise) for more info.

**Example**

```js
const fs = require('fs')
const relikeAll = require('relike-all')

// using `when` promise on node <= 0.11.12
relikeAll.promisify.Promise = require('when') 

const readFile = relikeAll.promisify(fs.readFile)
const promise = readFile('index.js')

console.log(promise.Promise) // => The `when` promise constructor, on old enviroments
console.log(promise.___customPromise) // => `true` on old environments
```

## Related
* [hybridify](https://www.npmjs.com/package/hybridify): Hybridify. Hybrids. Create sync, async or generator function to support both promise… [more](https://www.npmjs.com/package/letta) | [homepage](https://github.com/hybridables/hybridify)
* [letta-value](https://www.npmjs.com/package/letta-value): Extends `letta` to accept and handles more than functions only. Handles all… [more](https://www.npmjs.com/package/letta-value) | [homepage](https://github.com/hybridables/letta-value)
* [letta](https://www.npmjs.com/package/letta): Promisify sync, async or generator function, using [relike][]. Kind of promisify, but… [more](https://www.npmjs.com/package/letta) | [homepage](https://github.com/hybridables/letta)
* [relike-value](https://www.npmjs.com/package/relike-value): Create promise from sync, async, string, number, array and so on. Handle… [more](https://www.npmjs.com/package/relike-value) | [homepage](https://github.com/hybridables/relike-value)
* [relike](https://www.npmjs.com/package/relike): Simple promisify async or sync function with sane defaults. Lower level than… [more](https://www.npmjs.com/package/relike) | [homepage](https://github.com/hybridables/relike)
* [value2stream](https://www.npmjs.com/package/value2stream): Transform any value to stream. Create a stream from any value -… [more](https://www.npmjs.com/package/value2stream) | [homepage](https://github.com/hybridables/value2stream)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/relike-all/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[is-match]: https://github.com/jonschlinkert/is-match
[micromatch]: https://github.com/jonschlinkert/micromatch
[relike]: https://github.com/hybridables/relike

[npmjs-url]: https://www.npmjs.com/package/relike-all
[npmjs-img]: https://img.shields.io/npm/v/relike-all.svg?label=relike-all

[license-url]: https://github.com/hybridables/relike-all/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/relike-all.svg

[downloads-url]: https://www.npmjs.com/package/relike-all
[downloads-img]: https://img.shields.io/npm/dm/relike-all.svg

[codeclimate-url]: https://codeclimate.com/github/hybridables/relike-all
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/relike-all.svg

[travis-url]: https://travis-ci.org/hybridables/relike-all
[travis-img]: https://img.shields.io/travis/hybridables/relike-all/master.svg

[coveralls-url]: https://coveralls.io/r/hybridables/relike-all
[coveralls-img]: https://img.shields.io/coveralls/hybridables/relike-all.svg

[david-url]: https://david-dm.org/hybridables/relike-all
[david-img]: https://img.shields.io/david/hybridables/relike-all.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg