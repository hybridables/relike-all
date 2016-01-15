/*!
 * relike-all <https://github.com/hybridables/relike-all>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var test = require('assertit')
var isArray = require('isarray')
var isBuffer = require('is-buffer')
var semver = require('semver')
var relikeAll = require('./index')

function noop () {}

function notSkipOne (one, two, cb) {
  cb(null, one, two, noop)
}

function notSkipTwo (one, two, cb) {
  cb(null, one, two, fs.readFileSync)
}

function multipleArgs (one, two, three, cb) {
  cb(null, one, two, three)
}

test('should not throw TypeError if falsey value given', function (done) {
  relikeAll(false).then(function (bool) {
    test.strictEqual(bool, false)
    return relikeAll(null).then(function (empty) {
      test.strictEqual(empty, null)
      done()
    })
  }, done)
})

test('should promisify a given string (only one argument)', function (done) {
  var promise = relikeAll('foo bar baz')
  promise.then(function (str) {
    test.strictEqual(str, 'foo bar baz')
    done()
  }, done)
})

test('should flatten multiple arguments given if first not a function', function (done) {
  var promise = relikeAll('foo', 123, [1, 2], {a: 'b'})
  promise.then(function (arr) {
    test.deepEqual(arr, ['foo', 123, [1, 2], {a: 'b'}])
    done()
  }, done)
})

test('should promisify with native Promise or Bluebird', function (done) {
  var promise = relikeAll(fs.readFile, './package.json', 'utf-8')

  promise.then(function (res) {
    test.ok(res.indexOf('"license": "MIT"') !== -1)
    if (semver.lt(process.version, '0.11.13')) {
      test.strictEqual(promise.___bluebirdPromise, true)
      test.strictEqual(promise.Prome.___bluebirdPromise, true)
    }
    done()
  }, done)
})

test('should promisify with promise module (pinkie) given in `relikeAll.promise`', function (done) {
  relikeAll.promise = require('pinkie')
  var promise = relikeAll(fs.readFile, 'package.json')

  promise.then(function (res) {
    test.strictEqual(isBuffer(res), true)
    if (semver.lt(process.version, '0.11.13')) {
      test.strictEqual(promise.___customPromise, true)
      test.strictEqual(promise.Prome.___customPromise, true)
    }
    done()
  }, done)
})

test('should flatten multiple arguments to array by default', function (done) {
  relikeAll(multipleArgs, 11, 22, 33).then(function (res) {
    test.strictEqual(isArray(res), true)
    test.deepEqual(res, [11, 22, 33])
    done()
  }, done)
})

test('should skip last argument only if it is `fn(foo, bar, cb)` (async fn)', function (done) {
  relikeAll(notSkipOne, 111, 222).then(function (res) {
    test.strictEqual(isArray(res), true)
    test.deepEqual(res, [111, 222, noop])
    done()
  })
})

test('should not skip last argument and work core api (fs.readFileSync)', function (done) {
  relikeAll(notSkipTwo, 333, 5555).then(function (res) {
    test.strictEqual(isArray(res), true)
    test.deepEqual(res, [333, 5555, fs.readFileSync])
    done()
  })
})

test('should not skip if pass callback fn, e.g. fn(err, res) as last argument', function (done) {
  function foo (_err, res) {}
  relikeAll(function (one, fn, cb) {
    cb(null, one, fn)
  }, 123, foo).then(function (res) {
    test.strictEqual(isArray(res), true)
    test.deepEqual(res, [123, foo])
    done()
  })
})

test('should promisify sync function `fs.readFileSync` and handle utf8 result', function (done) {
  var promise = relikeAll(fs.readFileSync, 'package.json', 'utf8')

  promise
    .then(JSON.parse)
    .then(function (res) {
      test.strictEqual(res.name, 'relike-all')
      done()
    }, done)
})

test('should promisify `fs.readFileSync` and handle buffer result', function (done) {
  relikeAll(fs.readFileSync, 'package.json').then(function (buf) {
    test.strictEqual(isBuffer(buf), true)
    done()
  }, done)
})

test('should catch errors from failing sync function', function (done) {
  var promise = relikeAll(fs.readFileSync, 'foobar.json', 'utf8')

  promise
    .catch(function (err) {
      test.strictEqual(err.code, 'ENOENT')
      test.strictEqual(/no such file or directory/.test(err.message), true)
      done()
    })
})
