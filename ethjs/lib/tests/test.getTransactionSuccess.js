"use strict";

var _require = require('chai'),
  assert = _require.assert;
var TestRPC = require('ganache-cli');
var provider = TestRPC.provider();
var Eth = require('../index.js');
describe('getTransactionSuccess.js', function () {
  it('should get tx receipt properly', function (done) {
    var eth = new Eth(provider);
    eth.accounts(function (accErr, accounts) {
      assert.isNotOk(accErr);
      var defaultTxObject = {
        from: accounts[0],
        to: accounts[1],
        value: new Eth.BN('4500'),
        data: '0x',
        gas: 300000
      };
      eth.sendTransaction(defaultTxObject, function (txErr, txHash) {
        assert.isNotOk(txErr);
        eth.getTransactionSuccess(txHash, function (succErr, successResult) {
          assert.isNotOk(succErr);
          assert.isOk(successResult);
          done();
        });
      });
    });
  });
  it('should trigger errors', function (done) {
    var eth = new Eth(provider);
    eth.getTransactionSuccess(33, function (succErr) {
      assert.isOk(succErr);
      done();
    });
  });
  it('should timeout', function (done) {
    var eth = new Eth(provider, {
      timeout: 1000,
      interval: 100
    });
    eth.getTransactionSuccess('0xec66b273967d58c9611ae8dace378d550ccbd453e9815c78f8d1ffe5bb2aff1c', function (succErr) {
      assert.isOk(succErr);
      done();
    });
  });
});