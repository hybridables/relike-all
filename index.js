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
  var Prome = relikeAll.promise || options && options.promise

  if (typeof source === 'function') {
    source = utils.relike.promisify.call(this, source, Prome)
  }
  if (arguments.length === 2 && utils.kindOf(pattern) === 'object') {
    options = pattern
    pattern = false
  }
  var self = this
  var isMatch = !pattern ? function () { return true } : utils.isMatch(pattern, options)

  return Object.keys(source).length ? utils.reduce(source, function (dest, fn, name) {
    dest[name] = isMatch(name) ? utils.relike.promisify.call(self, fn, Prome) : fn
    return dest
  }, options && options.dest ? options.dest : {}) : source
}
