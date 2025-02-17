"use strict";

var Ganache = require('ganache-cli');
var provider = Ganache.provider();
var Eth = require('@metamask/ethjs-query');
var _require = require('chai'),
  assert = _require.assert;
var sha3 = require('ethjs-sha3'); // eslint-disable-line
var abi = require('ethjs-abi'); // eslint-disable-line
var EthFilter = require('../index');
console.warn = function warn() {}; // eslint-disable-line

describe('EthFilter', function () {
  describe('constructor', function () {
    it('should construct properly', function () {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      assert.equal(typeof filters.Filter, 'function');
      assert.equal(typeof filters.BlockFilter, 'function');
      assert.equal(typeof filters.PendingTransactionFilter, 'function');
    });
    it('should throw under bad construction', function () {
      assert["throws"](function () {
        new EthFilter(4354); // eslint-disable-line
      }, Error);
      assert["throws"](function () {
        EthFilter({}); // eslint-disable-line
      }, Error);
      assert["throws"](function () {
        EthFilter(); // eslint-disable-line
      }, Error);
    });
  });
  describe('Filter', function () {
    it('should construct the Filter object properly', function () {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      assert.equal(typeof filter, 'object');
      assert.equal(typeof filter.at, 'function');
      assert.equal(typeof filter["new"], 'function');
      assert.equal(typeof filter.watch, 'function');
      assert.equal(typeof filter.uninstall, 'function');
    });
    it('should set filter id properly with the .at method', function () {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter.at(7);
      assert.equal(filter.filterId, 7);
    });
    it('setup filter with custom delay', function () {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter({
        delay: 400
      });
      filter.at(7);
      assert.equal(filter.options.delay, 400);
    });
    it('should setup a new filter and uninstall with callbacks', function (done) {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter["new"](function (error, result) {
        assert.equal(error, null);
        assert.equal(typeof result, 'object');
        assert.equal(filter.filterId.toNumber(10) >= 0, true);
        filter.uninstall(function (uninstallError, uninstallResult) {
          assert.equal(uninstallError, null);
          assert.equal(typeof uninstallResult, 'boolean');
          done();
        });
      });
    });
    it('should setup a new filter and uninstall with callbacks and custom object', function (done) {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter["new"]({
        fromBlock: 0
      }, function (error, result) {
        assert.equal(error, null);
        assert.equal(typeof result, 'object');
        assert.equal(filter.filterId.toNumber(10) >= 0, true);
        filter.uninstall(function (uninstallError, uninstallResult) {
          assert.equal(uninstallError, null);
          assert.equal(typeof uninstallResult, 'boolean');
          done();
        });
      });
    });
    it('should setup a new filter and handle error', function (done) {
      function FakeProvider() {
        var self = this;
        self.provider = provider;
      }
      FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
        var self = this;
        if (payload.method === 'eth_newFilter') {
          var fakeEventLog = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            error: 'invalid data!',
            result: [2442384289]
          };
          self.provider.sendAsync(fakeEventLog, callback);
        } else {
          self.provider.sendAsync(payload, callback);
        }
      };
      var eth = new Eth(new FakeProvider());
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter["new"]({
        fromBlock: 0
      }, function (error, result) {
        assert.equal(typeof error, 'object');
        assert.equal(result, null);
        done();
      });
    });
    it('should setup a uninstall filter and handle error', function (done) {
      function FakeProvider() {
        var self = this;
        self.provider = provider;
      }
      FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
        var self = this;
        if (payload.method === 'eth_uninstallFilter') {
          var fakeEventLog = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            error: 'invalid data!',
            result: [2442384289]
          };
          self.provider.sendAsync(fakeEventLog, callback);
        } else {
          self.provider.sendAsync(payload, callback);
        }
      };
      var eth = new Eth(new FakeProvider());
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter["new"]({
        fromBlock: 0
      }, function (error, result) {
        assert.equal(error, null);
        assert.equal(typeof result, 'object');
        assert.equal(filter.filterId.toNumber(10) >= 0, true);
        filter.uninstall(function (uninstallError, uninstallResult) {
          assert.equal(typeof uninstallError, 'object');
          assert.equal(uninstallResult, null);
          done();
        });
      });
    });
    it('should setup a uninstall BlockFilter and handle error', function (done) {
      function FakeProvider() {
        var self = this;
        self.provider = provider;
      }
      FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
        var self = this;
        if (payload.method === 'eth_uninstallFilter') {
          var fakeEventLog = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            error: 'invalid data!',
            result: [2442384289]
          };
          self.provider.sendAsync(fakeEventLog, callback);
        } else {
          self.provider.sendAsync(payload, callback);
        }
      };
      var eth = new Eth(new FakeProvider());
      var filters = new EthFilter(eth);
      var filter = new filters.BlockFilter();
      filter["new"]({
        fromBlock: 0
      }, function (error, result) {
        assert.equal(error, null);
        assert.equal(typeof result, 'object');
        assert.equal(filter.filterId.toNumber(10) >= 0, true);
        filter.uninstall(function (uninstallError, uninstallResult) {
          assert.equal(typeof uninstallError, 'object');
          assert.equal(uninstallResult, null);
          done();
        });
      });
    });
    it('should setup a new filter and uninstall with promise and custom object', function (done) {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      var filter = new filters.Filter();
      filter["new"]({
        fromBlock: 0
      })["catch"](function (error) {
        assert.equal(error, null);
      }).then(function (result) {
        assert.equal(typeof result, 'object');
        assert.equal(filter.filterId.toNumber(10) >= 0, true);
        filter.uninstall()["catch"](function (uninstallError) {
          assert.equal(uninstallError, null);
        }).then(function (uninstallResult) {
          assert.equal(typeof uninstallResult, 'boolean');
          done();
        });
      });
    });
    it('Filter watch should catch thrown decoder error', function (done) {
      function FakeProvider() {
        var self = this;
        self.provider = provider;
      }
      FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
        var self = this;
        if (payload.method === 'eth_getFilterChanges') {
          callback(null, {
            result: [{
              logIndex: '0x0',
              blockNumber: '0x1b4',
              blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d54',
              transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dc23f',
              transactionIndex: '0x0',
              address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
              data: '0x0000000000000000000000000000000000000000000000000000000000001194000000000000000000000000ca35b7d915458ef540ade6068dfe2f44e8fa733c',
              topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5']
            }]
          });
        } else {
          self.provider.sendAsync(payload, callback);
        }
      };
      var eth = new Eth(new FakeProvider());
      var filters = new EthFilter(eth);
      eth.accounts(function (accountsError, accounts) {
        var count = 0; // eslint-disable-line

        var filter = new filters.Filter({
          decoder: function decoder() {
            throw new Error('invalid data!!!');
          }
        });
        filter["new"]({
          fromBlock: 0,
          toBlock: 'latest',
          address: accounts[0]
        })["catch"](function (filterError) {
          assert.equal(filterError, null);
        }).then(function (filterId) {
          assert.equal(typeof filterId, 'object');
          filter.watch(function (watchError, watchResult) {
            assert.equal(typeof watchError, 'object');
            assert.equal(watchResult, null);

            /*
            filter.uninstall()
            .then((result) => {
              assert.equal(typeof result, 'boolean');
              done();
            })
            .catch(err => assert.isOk(err)); */
          });

          done();
        });
      });
    });
    it('Filter watch and stopWatching should function properly', function (done) {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      eth.accounts(function (accountsError, accounts) {
        var count = 0; // eslint-disable-line

        var filter = new filters.Filter();
        filter["new"]({
          fromBlock: 0,
          toBlock: 'latest',
          address: accounts[0]
        })["catch"](function (filterError) {
          assert.equal(filterError, null);
        }).then(function (filterId) {
          assert.equal(typeof filterId, 'object');
          var watcher = filter.watch(function (watchError, watchResult) {
            assert.equal(watchError, null);
            assert.equal(Array.isArray(watchResult), true);
          });
          setTimeout(function () {
            watcher.stopWatching();
            done();
          }, 1400);
          eth.sendTransaction({
            from: accounts[0],
            to: accounts[1],
            value: 3000,
            gas: 3000000,
            data: '0x'
          }, function (txError, txResult) {
            assert.equal(txError, null);
            assert.equal(typeof txResult, 'string');
          });
        });
      });
    });
    it('Filter watch and uninstall should function properly', function (done) {
      var eth = new Eth(provider);
      var filters = new EthFilter(eth);
      eth.accounts(function (accountsError, accounts) {
        var count = 0; // eslint-disable-line

        var filter = new filters.Filter();
        filter["new"]({
          fromBlock: 0,
          toBlock: 'latest',
          address: accounts[0]
        })["catch"](function (filterError) {
          assert.equal(filterError, null);
        }).then(function (filterId) {
          assert.equal(typeof filterId, 'object');
          filter.watch(function (watchError, watchResult) {
            assert.equal(watchError, null);
            assert.equal(Array.isArray(watchResult), true);
          });
          setTimeout(function () {
            assert.equal(Object.keys(filter.watchers).length, 1);
            filter.uninstall().then(function (uninstallResult) {
              assert.equal(typeof uninstallResult, 'boolean');
              assert.equal(Object.keys(filter.watchers).length, 0);
              done();
            });
          }, 1400);
          eth.sendTransaction({
            from: accounts[0],
            to: accounts[1],
            value: 3000,
            gas: 3000000,
            data: '0x'
          }, function (txError, txResult) {
            assert.equal(txError, null);
            assert.equal(typeof txResult, 'string');
          });
        });
      });
    });
    it('Filter watch and uninstall should function properly with logs', function (done) {
      function FakeProvider() {
        var self = this;
        self.provider = provider;
      }
      FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
        var self = this;
        if (payload.method === 'eth_getFilterChanges') {
          callback(null, {
            result: [{
              logIndex: '0x0',
              blockNumber: '0x1b4',
              blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d54',
              transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dc23f',
              transactionIndex: '0x0',
              address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
              data: '0x0000000000000000000000000000000000000000000000000000000000001194000000000000000000000000ca35b7d915458ef540ade6068dfe2f44e8fa733c',
              topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5']
            }]
          });
        } else {
          self.provider.sendAsync(payload, callback);
        }
      };
      var eth = new Eth(new FakeProvider());
      var filters = new EthFilter(eth);
      eth.accounts(function (accountsError, accounts) {
        var count = 0; // eslint-disable-line

        var filter = new filters.Filter();
        filter["new"]({
          fromBlock: 0,
          toBlock: 'latest',
          address: accounts[0]
        })["catch"](function (filterError) {
          assert.equal(filterError, null);
        }).then(function (filterId) {
          assert.equal(typeof filterId, 'object');
          filter.watch(function (watchError, watchResult) {
            assert.equal(watchError, null);
            assert.equal(Array.isArray(watchResult), true);
            assert.equal(watchResult.length, 1);
            assert.equal(watchResult[0].logIndex.toNumber(10) >= 0, true);
          });
          setTimeout(function () {
            assert.equal(Object.keys(filter.watchers).length, 1);
            filter.uninstall().then(function (uninstallResult) {
              assert.equal(typeof uninstallResult, 'boolean');
              assert.equal(Object.keys(filter.watchers).length, 0);
              done();
            });
          }, 1400);
          eth.sendTransaction({
            from: accounts[0],
            to: accounts[1],
            value: 3000,
            gas: 3000000,
            data: '0x'
          }, function (txError, txResult) {
            assert.equal(txError, null);
            assert.equal(typeof txResult, 'string');
          });
        });
      });
    });
  });
});