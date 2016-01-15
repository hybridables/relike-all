/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var relike = require('relike')
var sliced = require('sliced')

module.exports = function relikeAll (val) {
  relike.promise = relikeAll.promise
  var args = sliced(arguments)
  if (typeof val !== 'function') {
    return relike.call(this, function () {
      if (require('isarray')(args) && args.length === 1) {
        return args[0]
      }
      return args
    })
  }
  return relike.apply(this, args)
}
