/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Promisify all functions in an object.
 *
 * **Example:**
 *
 * ```js
 * var relikeAll = require('relike-all')
 * var fs = require('fs')
 *
 * fs = relikeAll(fs)
 * fs.readFile(__filename, 'utf8', function(err, res) {
 *   //=> err, res
 * })
 * .then(function(res) {
 *   //=> res
 *   return fs.stat(__filename)
 * })
 * .then(function(stat) {
 *   assert.strictEqual(stat.size, fs.statSync(__filename).size)
 * })
 * ```
 *
 * @name relikeAll
 * @param {Object|Function} `<source>` the source object to promisify from
 * @param {String|Array|RegExp|Function} `[pattern]` a `micromatch` pattern to filter functions to promisify
 * @param {Object} `[options]` options passed to `micromatch`
 * @return {Object|Function}
 * @api public
 */
module.exports = function relikeAll (source, pattern, options) {
  if (utils.kindOf(source) !== 'function' && utils.kindOf(source) !== 'object') {
    throw new TypeError('relike-all: expect `source` be object|function')
  }
  var self = this
  utils.relike.promise = relikeAll.promise || options && options.promise

  if (typeof source === 'function') {
    return function promisified () {
      var args = utils.sliced(arguments)
      utils.relike.promise = promisified.promise || utils.relike.promise

      return utils.relike.apply(self || this, [source].concat(args))
    }
  }
  if (arguments.length === 2 && utils.kindOf(pattern) === 'object') {
    options = pattern
    pattern = false
  }
  if (!pattern) {
    pattern = function () {
      return true
    }
  }
  var isMatch = utils.isMatch(pattern, options)

  return utils.reduce(source, function (dest, fn, name) {
    if (isMatch(name)) {
      dest[name] = function promisifiedFn () {
        var args = utils.sliced(arguments)
        utils.relike.promise = promisifiedFn.promise || utils.relike.promise

        return utils.relike.apply(self || this, [fn].concat(args))
      }
    } else {
      dest[name] = fn
    }
    return dest
  }, options && options.dest ? options.dest : {})
}
