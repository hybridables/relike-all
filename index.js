/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Promisify functions in an object. You can pass `pattern` to filter
 * what should be promisified and what not. Using [is-match][], which
 * is thin wrapper around [micromatch][]. You should install [is-match][],
 * if you want to use filtering.
 *
 * **Example**
 *
 * ```js
 * const relikeAll = require('relike-all')
 * const fs = relikeAll(require('fs'))
 *
 * fs.readFile('package.json', 'utf8')
 *   .then(JSON.parse)
 *   .then(data => {
 *     console.log(data.name) // => 'relike-all'
 *     return 'package.json'
 *   })
 *   .then(fs.statSync)
 *   .then(stats => {
 *     console.log(stats) // => Stats object
 *   }, err => {
 *     console.error(err.stack)
 *   })
 * ```
 *
 * @name  relikeAll
 * @param {Object|Function} `<source>` The source object to promisify.
 * @param {String|Array|RegExp|Function} `[pattern]` A glob pattern to filter, using [micromatch][].
 * @param {Object} `[options]` Options passed to [micromatch][].
 * @return {Object|Function} Same as incoming `source`.
 * @api public
 */

var relikeAll = module.exports = function relikeAll (source, pattern, options) {
  if (utils.kindOf(source) !== 'function' && utils.kindOf(source) !== 'object') {
    throw new TypeError('relike-all: expect `source` be object|function')
  }
  var Promize = relikeAll.Promise || options && options.Promise
  var dest = options && options.dest || {}
  var self = this

  if (typeof source === 'function') {
    dest = utils.relike.promisify.call(self, source, Promize)
  }
  if (arguments.length === 2 && utils.kindOf(pattern) === 'object') {
    options = pattern
    pattern = false
  }
  var isMatch = !pattern ? function () { return true } : utils.isMatch(pattern, options)

  return Object.keys(source).length ? utils.reduce(source, function (dest, fn, name) {
    dest[name] = isMatch(name) ? utils.relike.promisify.call(self, fn, Promize) : fn
    return dest
  }, dest) : dest
}

/**
 * > Returns a function that will wrap the given `fn`.
 * Instead of taking a callback, the returned function will
 * return a promise whose fate is decided by the callback
 * behavior of the given `fn` node function. The node function
 * should conform to node.js convention of accepting a callback
 * as last argument and calling that callback with error as the
 * first argument and success value on the second argument.
 * – [Bluebird Docs on `.promisify`](http://bluebirdjs.com/docs/api/promise.promisify.html)
 *
 * **Example**
 *
 * ```js
 * const fs = require('fs')
 * const relikeAll = require('relike-all')
 * const readFile = relikeAll.promisify(fs.readFile)
 *
 * readFile('package.json', 'utf8')
 *   .then(JSON.parse)
 *   .then(data => {
 *     console.log(data.name) // => 'relike-all'
 *   }, err => {
 *     console.error(err.stack)
 *   })
 * ```
 *
 * @name   .promisify
 * @param  {Function} `fn` Some sync or async function to promisify.
 * @param  {Function} `[Promize]` Promise constructor to be used on enviroment where no support for native.
 * @return {Function} Promisified function, which always return a Promise.
 * @api public
 */

relikeAll.promisify = function relikeAllPromisify (fn, Promize) {
  var self = this
  return function promisified () {
    utils.relike.Promise = Promize || relikeAllPromisify.Promise || promisified.Promise
    return utils.relike.apply(this || self, [fn].concat(utils.sliced(arguments)))
  }
}
