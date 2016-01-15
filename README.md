# [relike-all][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Create promise from sync, async, string, number, array and so on. Handle completion (results) and errors gracefully! Built on top of `relike`, used by `redolent` to build robust (hybrid) APIs.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## What's the difference?
> _What's the difference between me and you?!  
> **–– Dr Dre feat. Eminem & X-Zibit - Whats the Difference, https://youtu.be/8y5MjguI-pM**_

What's the difference between this module, [relike](https://github.com/hybridables/relike) and [redolent](https://github.com/hybridables/redolent)?  
–– Simply, almost nothing.

1. This one accepts everything and returns `Promise`. But it is little bit tricky:
  - if you pass only one **non-function** argument to it, it will pass it to promise
  - if you pass more that one arguments to it, it will create array from them and pass it to promise
  - if you pass `function` as first argument, next arguments will be passed to this function
2. [relike](https://github.com/hybridables/relike) one just accept `sync` or `async` function which is executed immediately with next arguments, after that it  returns `Promise`.
3. [redolent](https://github.com/hybridables/redolent) accepts **everything** and returns function, which when is executed it returns `Promise`. Above things applies here, because it is on top of `relike-all`.

> **Notice:** Both `relike` and `relike-all` direcly executes first argument (if function) and returns `Promise`.

## Install
```
npm i relike-all --save
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
const relike-all = require('relike-all')
```

### [relikeAll](./index.js#L40)
> Will try to promisify `fn` with native Promise, otherwise will use `Bluebird`
or you can give different promise module to `relikeAll.promise`, for example `pinkie`.

- `[args...]` **{Anything}** any number of any type from string to function (number, array, boolean, etc)
- `return` **{Promise}** promise

**Example**

```js
const fs = require('fs')
const request = require('request')
const relikeAll = require('relike-all')

relikeAll(fs.readFile, 'package.json', 'utf-8').then(data => {
  console.log(JSON.parse(data).name)
})

// promisify sync function
relikeAll(fs.readFileSync, 'package.json', 'utf-8')
.then(JSON.parse)
.then(res => {
  console.log(res.name)
})

// handles multiple arguments by default (comes from `request`)
relikeAll(request, 'http://www.tunnckocore.tk/').then(result => {
  const [httpResponse, body] = result
})
```

### relikeAll.promise
> Static property on which you can pass custom Promise module to use, e.g. `Q` constructor.  

**Example**

```js
const fs = require('fs')
const relikeAll = require('relike-all')

// `q` promise will be used if not native promise available
// but only in node <= 0.11.12
relikeAll.promise = require('q')
relikeAll(fs.readFile, 'package.json', 'utf-8').then(data => {
  console.log(JSON.parse(data).name)
})
```

### Access Promise constructor
> You can access the used Promise constructor for promisify-ing from `promise.Prome`

**Example**

```js
const fs = require('fs')
const relikeAll = require('relike-all')

// use `pinkie` promise if not native promise available
// but only in node <= 0.11.12
relikeAll.promise = require('pinkie')

const promise = relikeAll(fs.readFile, 'package.json', 'utf8')

console.log(promise.Prome)
//=> will be `pinkie` promise constructor (only in node <= 0.11.12)
console.log(promise.Prome.___customPromise) //=> true (only on node <= 0.11.12)
console.log(promise.___customPromise) //=> true (only on node <= 0.11.12)

promise
  .then(JSON.parse)
  .then(data => {
    console.log(data.name) //=> `relike-all`
  })
```

## Promise from any type
> Any number of any type of arguments can be given - String, Stream, Null, Boolean, Number and etc.

**Example**

```js
const relikeAll = require('relike-all')

var promise = relikeAll('foo bar baz').then(function (str) {
  console.log(str) // => 'foo bar baz'
}, console.error)

relikeAll(false).then(function (bool) {
  console.log(bool) // => false

  return relikeAll(null).then(function (empty) {
  console.log(empty) // => null
  })
}, console.error)

relikeAll('foo', 123, [1, 2], {a: 'b'}).then(function (arr) {
  console.log(arr) // => ['foo', 123, [1, 2], {a: 'b'}]
}, console.error)
```


## Related
- [always-done](https://github.com/hybridables/always-done): Handles completion and errors of anything!
- [always-promise](https://github.com/hybridables/always-promise): Promisify, basically, **everything**. Generator function, callback-style or synchronous function; sync function that returns child process, stream or observable; directly passed promise, stream or child process.
- [always-thunk](https://github.com/hybridables/always-thunk): Thunkify, basically, **everything**. Generator function, callback-style or synchronous function; sync function that returns child process, stream or observable; directly passed promise, stream or child process.
- [always-generator](https://github.com/hybridables/always-generator): Generatorify, basically, **everything**. Async, callback-style or synchronous function; sync function that returns child process, stream or observable; directly passed promise, stream or child process.
- [native-or-another](https://github.com/tunnckoCore/native-or-another): Always will expose native `Promise` if available, otherwise `Bluebird` but only if you don't give another promise module like `q` or `promise` or what you want.
- [native-promise](https://github.com/tunnckoCore/native-promise): Get native `Promise` or falsey value if not available.
- [relike](https://github.com/hybridables/relike): Simple promisify a callback-style function with sane defaults. Support promisify-ing sync functions.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/relike-all/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/relike-all
[npmjs-img]: https://img.shields.io/npm/v/relike-all.svg?label=relike-all

[license-url]: https://github.com/hybridables/relike-all/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/hybridables/relike-all
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/relike-all.svg

[travis-url]: https://travis-ci.org/hybridables/relike-all
[travis-img]: https://img.shields.io/travis/hybridables/relike-all.svg

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