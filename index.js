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
 * const relikeAll = require('relike-all')
 * const fs = relikeAll(require('fs'))
 *
 * fs.readFile('package.json', 'utf8')
 *   .then(JSON.parse)
 *   .then(data => {
 *     console.log(data.name) // => 'relike-all'
 *     return data.name
 *   })
 *   .then(fs.statSync)
 *   .then(stats => {
 *     console.log(stats) // => Stats object
 *   })
 * ```
 *
 * @name relikeAll
 * @param {Object|Function} `<source>` the source object to promisify
 * @param {String|Array|RegExp|Function} `[pattern]` a `micromatch` pattern to filter
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
  var isMatch = !pattern ? function () { return true } : utils.isMatch(pattern, options)

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
