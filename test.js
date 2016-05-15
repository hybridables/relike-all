/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('mukla')
var relikeAll = require('./index')
var isPromise = require('is-promise')
var isStream = require('is-node-stream')
var isBuffer = require('is-buffer')

test('should throw TypeError if first argument not an object or function', function (done) {
  function fixture () {
    relikeAll(1234)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `source` be object/)
  done()
})

test('should promisify `fs` module, including `fs.createReadStream`', function () {
  var pfs = relikeAll(fs)

  // checking `fs.readFileSync`
  return pfs.readFileSync('package.json', 'utf8')
    .then(JSON.parse)
    .then(function (data) {
      test.strictEqual(data.name, 'relike-all')
      return 'package.json'
    })
    // checking `fs.readFile`
    .then(pfs.readFile)
    .then(function (buf) {
      test.strictEqual(isBuffer(buf), true)
      return 'package.json'
    })
    // checking `fs.createReadStream`
    .then(pfs.createReadStream)
    .then(function (stream) {
      test.strictEqual(isStream(stream), true)
    })
})

test('should promisify `simple-get` module and its methods', function (done) {
  var simpleGet = relikeAll(require('simple-get'))

  test.strictEqual(typeof simpleGet, 'function')
  test.strictEqual(typeof simpleGet.get, 'function')
  test.strictEqual(typeof simpleGet.post, 'function')

  simpleGet('http://ipecho.net/').then(function (stream) {
    test.strictEqual(isStream(stream), true)
    simpleGet.get('http://ipecho.net/').then(function (stream) {
      test.strictEqual(isStream(stream), true)
      done()
    }, done)
  }, done)
})

test('should promisify single function that is given', function () {
  var readFile = relikeAll(fs.readFile)

  return readFile('package.json', 'utf8').then(JSON.parse).then(function (data) {
    test.strictEqual(data.name, 'relike-all')
  })
})

test('should use `.promisify` method to promisify function', function () {
  return relikeAll.promisify(fs.stat)(__filename).then(function (stats) {
    test.strictEqual(typeof stats, 'object')
  })
})

test('should promisify only functions that match to given pattern', function (done) {
  // promisify only `fs.readFile` and `fs.readFileSync`
  var file = relikeAll(fs, 'readFile*')
  var stats = file.statSync('package.json')

  // so `stats` is object, not a promise
  test.strictEqual(isPromise(stats), false)
  test.strictEqual(typeof stats, 'object')

  // when executed promisified always return promise
  var promise = file.readFileSync('package.json')
  test.strictEqual(isPromise(promise), true)
  done()
})

test('should accept options as second argument if not third', function () {
  var pfs = relikeAll(fs, { dot: true })
  var stats = pfs.statSync('package.json')

  test.strictEqual(isPromise(stats), true)
  return stats.then(function (res) {
    test.strictEqual(typeof res, 'object')
  })
})
