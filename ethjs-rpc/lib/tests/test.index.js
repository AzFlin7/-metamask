"use strict";

var _require = require('chai'),
  assert = _require.assert;
var TestRPC = require('ganache-cli');
var HTTPProvider = require('@metamask/ethjs-provider-http');
var EthRPC = require('../index.js');
var provider = TestRPC.provider({});
var provider2 = TestRPC.provider({});
describe('ethjs-rpc', function () {
  describe('construction', function () {
    it('should construct normally', function () {
      var eth = new EthRPC(provider);
      assert.equal(typeof eth, 'object');
      assert.equal(typeof eth.currentProvider, 'object');
      assert.equal(typeof eth.options, 'object');
    });
    it('should throw when invalid construction params', function () {
      assert["throws"](function () {
        return EthRPC(provider);
      }, Error); // eslint-disable-line
    });
  });

  describe('setProvider', function () {
    it('should change provider', function (done) {
      var eth = new EthRPC(provider);
      eth.sendAsync({
        method: 'eth_accounts'
      }, function (err, accounts1) {
        assert.equal(err, null);
        eth.setProvider(provider2);
        eth.sendAsync({
          method: 'eth_accounts'
        }, function (err2, accounts2) {
          assert.equal(err2, null);
          assert.notDeepEqual(accounts1, accounts2);
          eth.sendAsync({
            method: 'eth_accounts'
          }).then(function (accounts3) {
            assert.deepEqual(accounts3, accounts2);
            done();
          })["catch"](function (error) {
            return console.log(error);
          }); // eslint-disable-line
        });
      });
    });

    it('should handle invalid provider', function () {
      assert["throws"](function () {
        return new EthRPC(23423);
      }, Error);
    });
  });
  describe('sendAsync', function () {
    it('should handle normal calls', function (done) {
      var eth = new EthRPC(provider);
      eth.sendAsync({
        method: 'eth_accounts'
      }, function (err, accounts1) {
        assert.equal(err, null);
        assert.equal(Array.isArray(accounts1), true);
        assert.equal(accounts1.length > 0, true);
        done();
      });
    });
    it('should handle invalid response', function (done) {
      var eth = new EthRPC({
        sendAsync: function sendAsync(payload, cb) {
          cb(null, {
            error: 'Some Error!!'
          });
        }
      });
      eth.sendAsync({
        method: 'eth_accounts'
      }, function (err, accounts1) {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });
    it('should handle invalid response from infura ropsten geth/parity nodes', function (done) {
      var infuraProvider = new HTTPProvider('https://ropsten.infura.io');
      var eth = new EthRPC(infuraProvider);
      eth.sendAsync({
        id: 8883061436998317,
        jsonrpc: '2.0',
        params: [{
          'gas': '0x2dc6c0',
          // eslint-disable-line
          'value': '0x00',
          // eslint-disable-line
          'from': '0x70ad465e0bab6504002ad58c744ed89c7da38524',
          // eslint-disable-line
          'to': '0xad7d27bc87dba2f5ebcaeb1e7670a1d18104087b',
          // eslint-disable-line
          'data': '0xd89b73d00000000000000000000000000000000000000000000000000000000000000000'
        }, 'latest'],
        // eslint-disable-line
        'method': 'eth_call' // eslint-disable-line
      }, function (err, accounts1) {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });
    it('should handle invalid errors', function (done) {
      var eth = new EthRPC({
        sendAsync: function sendAsync(payload, cb) {
          cb('Some error!');
        }
      });
      eth.sendAsync({
        method: 'eth_accounts'
      }, function (err, accounts1) {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });
  });
  describe('sendAsync - error handling', function () {
    // this test relies on disabling mocha's default handling of "uncaughtException"
    // see https://github.com/mochajs/mocha/issues/2452

    var uncaughtExceptionListeners;
    before(function () {
      // Stop Mocha from handling uncaughtExceptions.
      uncaughtExceptionListeners = process.listeners('uncaughtException');
      process.removeAllListeners('uncaughtException');
    });
    after(function () {
      // Resume normal Mocha handling of uncaughtExceptions.
      uncaughtExceptionListeners.forEach(function (listener) {
        process.on('uncaughtException', listener);
      });
    });
    it('should call the callback only once', function (done) {
      var eth = new EthRPC(provider);
      var errorMessage = 'boom!';
      var callbackCalled = 0;
      var uncaughtException;
      process.prependOnceListener('uncaughtException', function (err) {
        uncaughtException = err;
      });
      eth.sendAsync({
        method: 'eth_accounts'
      }, function () {
        callbackCalled++;
        throw new Error(errorMessage);
      });
      setTimeout(function () {
        assert.equal(callbackCalled, 1, 'callback called only once.');
        assert.equal(uncaughtException.message, errorMessage, 'saw expected uncaughtException');
        done();
      }, 200);
    });
  });
});