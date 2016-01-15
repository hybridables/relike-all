/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

module.exports = function relikeAll (val) {
  utils.relike.promise = relikeAll.promise
  var args = utils.sliced(arguments)
  if (typeof val !== 'function') {
    return utils.relike.call(this, function () {
      if (utils.isarray(args) && args.length === 1) {
        return args[0]
      }
      return args
    })
  }
  return utils.relike.apply(this, args)
}
