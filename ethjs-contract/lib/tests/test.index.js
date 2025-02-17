"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require('hard-rejection')();
var Eth = require('@metamask/ethjs-query');
var Ganache = require('ganache-cli');
var _require = require('chai'),
  assert = _require.assert;
var BN = require('bn.js'); // eslint-disable-line
var asyncWaterfall = require('async/waterfall');
var EthContract = require('../index');
var TestContracts = require('./test-contracts');
describe('EthContract', function () {
  var provider;
  beforeEach(function () {
    provider = Ganache.provider();
  });
  describe('should function normally', function () {
    it('should work normally with callbacks', function (done) {
      var eth = new Eth(provider);
      var contract = new EthContract(eth);
      assert.equal(typeof contract, 'function');
      var SimpleStore;
      var newResult;
      var simpleStore;
      var setResult;
      var setNumberValue;
      asyncWaterfall([function (cb) {
        eth.accounts(cb);
      }, function (accounts, cb) {
        assert.equal(Array.isArray(accounts), true);
        SimpleStore = contract(TestContracts.SimpleStore.abi, TestContracts.SimpleStore.bytecode, {
          from: accounts[0],
          gas: 300000
        });
        SimpleStore["new"](cb);
      }, function (_newResult, cb) {
        newResult = _newResult;
        assert.equal(typeof newResult, 'string');
        cb();
      }, function (cb) {
        eth.getTransactionReceipt(newResult, cb);
      }, function (receipt, cb) {
        assert.equal(typeof receipt, 'object');
        assert.equal(typeof receipt.contractAddress, 'string');
        setNumberValue = 4500;
        simpleStore = SimpleStore.at(receipt.contractAddress);
        assert.equal(typeof simpleStore.abi, 'object');
        assert.equal(typeof simpleStore.address, 'string');
        assert.equal(simpleStore.address, receipt.contractAddress);
        assert.equal(typeof simpleStore.set, 'function');
        assert.equal(typeof simpleStore.get, 'function');
        assert.equal(typeof simpleStore.SetComplete, 'function');
        simpleStore.set(setNumberValue, cb);
      }, function (_setResult, cb) {
        setResult = _setResult;
        assert.equal(typeof setResult, 'string');
        cb();
      }, function (cb) {
        eth.getTransactionReceipt(setResult, cb);
      }, function (setTxReceipt, cb) {
        assert.equal(typeof setTxReceipt, 'object');
        simpleStore.get(cb);
      }, function (getResult, cb) {
        assert.equal(typeof getResult, 'object');
        assert.equal(getResult[0].toNumber(10), setNumberValue);
        cb();
      }], done);
    });
    it('should work normally with promises', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var eth, _yield$deploySimpleSt, simpleStore, setNumberValue, setResult, setTxReceipt, getResult;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            eth = new Eth(provider);
            _context.next = 3;
            return deploySimpleStore({
              eth: eth
            });
          case 3:
            _yield$deploySimpleSt = _context.sent;
            simpleStore = _yield$deploySimpleSt.simpleStore;
            setNumberValue = 4500;
            _context.next = 8;
            return simpleStore.set(setNumberValue);
          case 8:
            setResult = _context.sent;
            assert.equal(typeof setResult, 'string');
            _context.next = 12;
            return eth.getTransactionReceipt(setResult);
          case 12:
            setTxReceipt = _context.sent;
            assert.equal(typeof setTxReceipt, 'object');
            _context.next = 16;
            return simpleStore.get();
          case 16:
            getResult = _context.sent;
            assert.equal(typeof getResult, 'object');
            assert.equal(getResult[0].toNumber(10), setNumberValue);
          case 19:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    it('should use events properly', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var FakeProvider, eth, _yield$deploySimpleSt2, simpleStore, _yield$simpleStorePer, watchPromise;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            FakeProvider = function _FakeProvider() {
              this.provider = provider;
            };
            FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
              var self = this;
              var parsedPayload = payload;
              if (parsedPayload.method === 'eth_getFilterChanges') {
                self.provider.sendAsync(payload, function () {
                  var fakeEventLog = {
                    id: parsedPayload.id,
                    jsonrpc: parsedPayload.jsonrpc,
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
                  };
                  callback(null, fakeEventLog);
                });
              } else {
                self.provider.sendAsync(payload, callback);
              }
            };
            eth = new Eth(new FakeProvider());
            _context2.next = 5;
            return deploySimpleStore({
              eth: eth
            });
          case 5:
            _yield$deploySimpleSt2 = _context2.sent;
            simpleStore = _yield$deploySimpleSt2.simpleStore;
            _context2.next = 9;
            return simpleStorePerformSetAndWatchOnce({
              simpleStore: simpleStore
            });
          case 9:
            _yield$simpleStorePer = _context2.sent;
            watchPromise = _yield$simpleStorePer.watchPromise;
            _context2.prev = 11;
            _context2.next = 14;
            return watchPromise;
          case 14:
            // expect to throw
            assert.fail();
            _context2.next = 21;
            break;
          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](11);
            assert.ok(_context2.t0);
            assert.equal(typeof _context2.t0, 'object');
          case 21:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[11, 17]]);
    })));
    it('should catch watch error under promise', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var FakeProvider, eth, _yield$deploySimpleSt3, simpleStore, _yield$simpleStorePer2, watchPromise;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            FakeProvider = function _FakeProvider2() {
              this.provider = provider;
            };
            FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
              var self = this;
              var parsedPayload = payload;
              if (parsedPayload.method === 'eth_getFilterChanges') {
                self.provider.sendAsync(payload, function () {
                  var fakeEventLog = {
                    id: parsedPayload.id,
                    jsonrpc: parsedPayload.jsonrpc,
                    error: 'invalid data'
                  };
                  callback(null, fakeEventLog);
                });
              } else {
                self.provider.sendAsync(payload, callback);
              }
            };
            eth = new Eth(new FakeProvider());
            _context3.next = 5;
            return deploySimpleStore({
              eth: eth
            });
          case 5:
            _yield$deploySimpleSt3 = _context3.sent;
            simpleStore = _yield$deploySimpleSt3.simpleStore;
            _context3.next = 9;
            return simpleStorePerformSetAndWatchOnce({
              simpleStore: simpleStore
            });
          case 9:
            _yield$simpleStorePer2 = _context3.sent;
            watchPromise = _yield$simpleStorePer2.watchPromise;
            _context3.prev = 11;
            _context3.next = 14;
            return watchPromise;
          case 14:
            // expect to throw
            assert.fail();
            _context3.next = 21;
            break;
          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](11);
            assert.ok(_context3.t0);
            assert.equal(typeof _context3.t0, 'object');
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[11, 17]]);
    })));
    it('should catch watch error under promise invalid decode', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var FakeProvider, eth, _yield$deploySimpleSt4, simpleStore, _yield$simpleStorePer3, watchPromise;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            FakeProvider = function _FakeProvider3() {
              this.provider = provider;
            };
            FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
              var self = this;
              var parsedPayload = payload;
              if (parsedPayload.method === 'eth_getFilterChanges') {
                self.provider.sendAsync(payload, function () {
                  var fakeEventLog = {
                    id: parsedPayload.id,
                    jsonrpc: parsedPayload.jsonrpc,
                    result: [{
                      logIndex: '0x0',
                      blockNumber: '0x1b4',
                      blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d54',
                      transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dc23f',
                      transactionIndex: '0x0',
                      address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
                      data: '0xkjdsfkjfskjs',
                      topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5']
                    }]
                  };
                  callback(null, fakeEventLog);
                });
              } else {
                self.provider.sendAsync(payload, callback);
              }
            };
            eth = new Eth(new FakeProvider());
            _context4.next = 5;
            return deploySimpleStore({
              eth: eth
            });
          case 5:
            _yield$deploySimpleSt4 = _context4.sent;
            simpleStore = _yield$deploySimpleSt4.simpleStore;
            _context4.next = 9;
            return simpleStorePerformSetAndWatchOnce({
              simpleStore: simpleStore
            });
          case 9:
            _yield$simpleStorePer3 = _context4.sent;
            watchPromise = _yield$simpleStorePer3.watchPromise;
            _context4.prev = 11;
            _context4.next = 14;
            return watchPromise;
          case 14:
            // expect to throw
            assert.fail();
            _context4.next = 21;
            break;
          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](11);
            assert.ok(_context4.t0);
            assert.equal(typeof _context4.t0, 'object');
          case 21:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[11, 17]]);
    })));
    it('should catch event watch error', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var FakeProvider, eth, _yield$deploySimpleSt5, simpleStore, _yield$simpleStorePer4, watchPromise;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            FakeProvider = function _FakeProvider4() {
              this.provider = provider;
            };
            FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
              var self = this;
              var parsedPayload = payload;
              if (parsedPayload.method === 'eth_getFilterChanges') {
                self.provider.sendAsync(payload, function () {
                  var fakeEventLog = {
                    id: parsedPayload.id,
                    jsonrpc: parsedPayload.jsonrpc,
                    error: 'invalid data'
                  };
                  callback(null, fakeEventLog);
                });
              } else {
                self.provider.sendAsync(payload, callback);
              }
            };
            eth = new Eth(new FakeProvider());
            _context5.next = 5;
            return deploySimpleStore({
              eth: eth
            });
          case 5:
            _yield$deploySimpleSt5 = _context5.sent;
            simpleStore = _yield$deploySimpleSt5.simpleStore;
            _context5.next = 9;
            return simpleStorePerformSetAndWatchOnce({
              simpleStore: simpleStore
            });
          case 9:
            _yield$simpleStorePer4 = _context5.sent;
            watchPromise = _yield$simpleStorePer4.watchPromise;
            _context5.prev = 11;
            _context5.next = 14;
            return watchPromise;
          case 14:
            // expect to throw
            assert.fail();
            _context5.next = 21;
            break;
          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](11);
            assert.ok(_context5.t0);
            assert.equal(typeof _context5.t0, 'object');
          case 21:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[11, 17]]);
    })));
    it('should handle invalid call data with error', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var FakeProvider, eth, _yield$deploySimpleSt6, simpleStore;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            FakeProvider = function _FakeProvider5() {
              this.provider = provider;
            };
            FakeProvider.prototype.sendAsync = function sendAsync(payload, callback) {
              var self = this;
              var parsedPayload = payload;
              if (parsedPayload.method === 'eth_call') {
                self.provider.sendAsync(payload, function () {
                  var fakeEventLog = {
                    id: parsedPayload.id,
                    jsonrpc: parsedPayload.jsonrpc,
                    result: '0xkfsdksdfkjfsdjk'
                  };
                  callback(null, fakeEventLog);
                });
              } else {
                self.provider.sendAsync(payload, callback);
              }
            };
            eth = new Eth(new FakeProvider());
            _context6.next = 5;
            return deploySimpleStore({
              eth: eth
            });
          case 5:
            _yield$deploySimpleSt6 = _context6.sent;
            simpleStore = _yield$deploySimpleSt6.simpleStore;
            _context6.prev = 7;
            _context6.next = 10;
            return simpleStore.get();
          case 10:
            // expect to throw
            assert.fail();
            _context6.next = 17;
            break;
          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](7);
            assert.ok(_context6.t0);
            assert.equal(typeof _context6.t0, 'object');
          case 17:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[7, 13]]);
    })));
    it('should construct properly with some overriding txObjects', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var eth, accounts, firstFrom, secondFrom, defaultTxObject, _yield$deploySimpleSt7, simpleStore, deployTx, setOpts, _yield$simpleStorePer5, setTx;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            eth = new Eth(provider);
            _context7.next = 3;
            return eth.accounts();
          case 3:
            accounts = _context7.sent;
            firstFrom = accounts[3];
            secondFrom = accounts[6];
            defaultTxObject = {
              from: firstFrom
            };
            _context7.next = 9;
            return deploySimpleStore({
              eth: eth,
              defaultTxObject: defaultTxObject
            });
          case 9:
            _yield$deploySimpleSt7 = _context7.sent;
            simpleStore = _yield$deploySimpleSt7.simpleStore;
            deployTx = _yield$deploySimpleSt7.deployTx;
            assert.equal(deployTx.from, firstFrom);
            setOpts = {
              from: secondFrom
            };
            _context7.next = 16;
            return simpleStorePerformSetAndGet({
              eth: eth,
              simpleStore: simpleStore,
              setOpts: setOpts
            });
          case 16:
            _yield$simpleStorePer5 = _context7.sent;
            setTx = _yield$simpleStorePer5.setTx;
            assert.equal(setTx.from, secondFrom);
          case 19:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })));
    it('should construct properly with hexed bytecode', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var eth, newOpts, _yield$deploySimpleSt8, simpleStore;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            eth = new Eth(provider);
            newOpts = {
              data: TestContracts.SimpleStore.bytecode
            };
            _context8.next = 4;
            return deploySimpleStore({
              eth: eth,
              newOpts: newOpts
            });
          case 4:
            _yield$deploySimpleSt8 = _context8.sent;
            simpleStore = _yield$deploySimpleSt8.simpleStore;
            _context8.next = 8;
            return simpleStorePerformSetAndGet({
              eth: eth,
              simpleStore: simpleStore
            });
          case 8:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })));
    it('should construct properly with no default tx bytecode', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var eth, newOpts, _yield$deploySimpleSt9, simpleStore;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            eth = new Eth(provider);
            newOpts = {
              data: TestContracts.SimpleStore.bytecode
            };
            _context9.next = 4;
            return deploySimpleStore({
              eth: eth,
              newOpts: newOpts,
              contractBytecode: null
            });
          case 4:
            _yield$deploySimpleSt9 = _context9.sent;
            simpleStore = _yield$deploySimpleSt9.simpleStore;
            _context9.next = 8;
            return simpleStorePerformSetAndGet({
              eth: eth,
              simpleStore: simpleStore
            });
          case 8:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })));
    it('should construct properly with no default tx object when specified in new', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var eth, accounts, newOpts, _yield$deploySimpleSt10, simpleStore;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            eth = new Eth(provider);
            _context10.next = 3;
            return eth.accounts();
          case 3:
            accounts = _context10.sent;
            newOpts = {
              from: accounts[0],
              gas: 300000
            };
            _context10.next = 7;
            return deploySimpleStore({
              eth: eth,
              defaultTxObject: null,
              newOpts: newOpts
            });
          case 7:
            _yield$deploySimpleSt10 = _context10.sent;
            simpleStore = _yield$deploySimpleSt10.simpleStore;
            _context10.next = 11;
            return simpleStorePerformSetAndGet({
              eth: eth,
              simpleStore: simpleStore,
              setOpts: newOpts
            });
          case 11:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    })));
    it('should construct properly constructor params', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var eth;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            eth = new Eth(provider);
            _context11.next = 3;
            return deployAndTestComplexStore({
              eth: eth
            });
          case 3:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    })));
    it('should construct properly constructor params and overriding tx object', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var eth, accounts, newTxParams, _yield$deployAndTestC, deployTx;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            eth = new Eth(provider);
            _context12.next = 3;
            return eth.accounts();
          case 3:
            accounts = _context12.sent;
            newTxParams = {
              from: accounts[3]
            };
            _context12.next = 7;
            return deployAndTestComplexStore({
              eth: eth,
              newTxParams: newTxParams
            });
          case 7:
            _yield$deployAndTestC = _context12.sent;
            deployTx = _yield$deployAndTestC.deployTx;
            assert.equal(deployTx.from, accounts[3]);
          case 10:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    })));
    it('should handle multi-type set and multi-type return', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var eth, contract, accounts, initalValue, initalAddressArray, SimpleStore, deployTxHash, setTxReceipt, extraComplexStore, args, multiTypeSetTxHash, multiSetReceipt, multiReturn;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            eth = new Eth(provider);
            contract = new EthContract(eth);
            _context13.next = 4;
            return eth.accounts();
          case 4:
            accounts = _context13.sent;
            initalValue = 730483222;
            initalAddressArray = [accounts[3], accounts[2], accounts[1]];
            SimpleStore = contract(TestContracts.ExtraComplexStore.abi, TestContracts.ExtraComplexStore.bytecode, {
              from: accounts[0],
              gas: 3000000
            });
            _context13.next = 10;
            return SimpleStore["new"](initalValue, initalAddressArray, {
              from: accounts[3]
            });
          case 10:
            deployTxHash = _context13.sent;
            assert.equal(typeof deployTxHash, 'string');
            _context13.next = 14;
            return eth.getTransactionReceipt(deployTxHash);
          case 14:
            setTxReceipt = _context13.sent;
            extraComplexStore = SimpleStore.at(setTxReceipt.contractAddress);
            args = [
            // int _val1
            453,
            // uint _val2
            new BN('289234972'),
            // address[] _val3
            [accounts[4], accounts[2]],
            // string _val4
            'some great string',
            // uint8 _val5
            55,
            // bytes32 _val6
            '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
            // bytes _val7
            '0x47173285a8d73bbfa254cb01fad3',
            // bytes8 _val8
            '0x47173285a8d73b3d',
            // int8 _val9
            2,
            // int16 _val10
            12,
            // uint256[] _val11
            [12342, 923849, new BN('249829233')]];
            _context13.next = 19;
            return extraComplexStore.multiTypeSet.apply(extraComplexStore, args);
          case 19:
            multiTypeSetTxHash = _context13.sent;
            _context13.next = 22;
            return eth.getTransactionReceipt(multiTypeSetTxHash);
          case 22:
            multiSetReceipt = _context13.sent;
            assert.equal(typeof multiSetReceipt, 'object');
            _context13.next = 26;
            return extraComplexStore.multiTypeReturn();
          case 26:
            multiReturn = _context13.sent;
            assert.equal(typeof multiReturn, 'object');
            assert.equal(multiReturn[0].toNumber(10), args[0]);
            assert.equal(multiReturn[1].toNumber(10), args[1].toNumber(10));
            assert.equal(multiReturn[2][0], args[2][0]);
            assert.equal(multiReturn[2][1], args[2][1]);
            assert.equal(multiReturn[3], args[3]);
            assert.equal(multiReturn[4].toNumber(10), args[4]);
            assert.equal(multiReturn[5], args[5]);
            assert.equal(multiReturn[6], args[6]);
            assert.equal(multiReturn[7], args[7]);
            assert.equal(multiReturn[8].toNumber(10), args[8]);
            assert.equal(multiReturn[9].toNumber(10), args[9]);
            assert.equal(multiReturn[10][0].toNumber(10), args[10][0]);
            assert.equal(multiReturn[10][1].toNumber(10), args[10][1]);
            assert.equal(multiReturn[10][2].toNumber(10), args[10][2].toNumber(10));
          case 42:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    })));
  });
});
function deploySimpleStore(_x) {
  return _deploySimpleStore.apply(this, arguments);
}
function _deploySimpleStore() {
  _deploySimpleStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(_ref14) {
    var eth, defaultTxObject, _ref14$newOpts, newOpts, contractBytecode, contract, accounts, finalDefaultTxObject, finalContractByteCode, SimpleStore, deployTxHash, deployTx, deployTxRx, simpleStore;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          eth = _ref14.eth, defaultTxObject = _ref14.defaultTxObject, _ref14$newOpts = _ref14.newOpts, newOpts = _ref14$newOpts === void 0 ? {} : _ref14$newOpts, contractBytecode = _ref14.contractBytecode;
          contract = new EthContract(eth);
          assert.equal(typeof contract, 'function');
          _context14.next = 5;
          return eth.accounts();
        case 5:
          accounts = _context14.sent;
          assert.equal(Array.isArray(accounts), true);

          // set `defaultTxObject` option to null to omit
          finalDefaultTxObject = defaultTxObject === null ? undefined : Object.assign({
            from: accounts[0],
            gas: 300000
          }, defaultTxObject); // set `contractBytecode` option to null to omit
          finalContractByteCode = contractBytecode === null ? undefined : contractBytecode || TestContracts.SimpleStore.bytecode;
          SimpleStore = contract(TestContracts.SimpleStore.abi, finalContractByteCode, finalDefaultTxObject);
          _context14.next = 12;
          return SimpleStore["new"](newOpts);
        case 12:
          deployTxHash = _context14.sent;
          assert.ok(deployTxHash);
          assert.equal(typeof deployTxHash, 'string');
          _context14.next = 17;
          return eth.getTransactionByHash(deployTxHash);
        case 17:
          deployTx = _context14.sent;
          assert.ok(deployTx);
          assert.equal(typeof deployTx, 'object');
          _context14.next = 22;
          return eth.getTransactionReceipt(deployTxHash);
        case 22:
          deployTxRx = _context14.sent;
          assert.equal(typeof deployTxRx, 'object');
          assert.equal(typeof deployTxRx.contractAddress, 'string');
          simpleStore = SimpleStore.at(deployTxRx.contractAddress);
          assert.equal(typeof simpleStore.abi, 'object');
          assert.equal(typeof simpleStore.address, 'string');
          assert.equal(simpleStore.address, deployTxRx.contractAddress);
          assert.equal(typeof simpleStore.set, 'function');
          assert.equal(typeof simpleStore.get, 'function');
          assert.equal(typeof simpleStore.SetComplete, 'function');
          return _context14.abrupt("return", {
            simpleStore: simpleStore,
            deployTx: deployTx,
            deployTxRx: deployTxRx
          });
        case 33:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return _deploySimpleStore.apply(this, arguments);
}
function watchEventOnce(_x2) {
  return _watchEventOnce.apply(this, arguments);
}
function _watchEventOnce() {
  _watchEventOnce = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(contractEvent) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          return _context15.abrupt("return", new Promise(function (resolve, reject) {
            contractEvent.watch(function (watchErr) {
              if (watchErr) {
                return reject(watchErr);
              }
              return contractEvent.uninstall(function (stopWatchingError) {
                if (stopWatchingError) {
                  return reject(stopWatchingError);
                }
                return resolve();
              });
            });
          }));
        case 1:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return _watchEventOnce.apply(this, arguments);
}
function simpleStorePerformSetAndWatchOnce(_x3) {
  return _simpleStorePerformSetAndWatchOnce.apply(this, arguments);
}
function _simpleStorePerformSetAndWatchOnce() {
  _simpleStorePerformSetAndWatchOnce = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(_ref15) {
    var simpleStore, setCompleteEvent, setCompleteFilterId, watchPromise, setTxHash;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          simpleStore = _ref15.simpleStore;
          setCompleteEvent = simpleStore.SetComplete(); // eslint-disable-line
          _context16.next = 4;
          return setCompleteEvent["new"]({
            fromBlock: 'earliest',
            toBlock: 'latest'
          });
        case 4:
          setCompleteFilterId = _context16.sent;
          assert.ok(setCompleteFilterId);
          assert.equal(typeof setCompleteFilterId, 'object');
          assert.equal(setCompleteFilterId.toString(10) > 0, true);
          watchPromise = watchEventOnce(setCompleteEvent);
          _context16.next = 11;
          return simpleStore.set(1337);
        case 11:
          setTxHash = _context16.sent;
          assert.equal(typeof setTxHash, 'string');
          return _context16.abrupt("return", {
            watchPromise: watchPromise
          });
        case 14:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return _simpleStorePerformSetAndWatchOnce.apply(this, arguments);
}
function simpleStorePerformSetAndGet(_x4) {
  return _simpleStorePerformSetAndGet.apply(this, arguments);
}
function _simpleStorePerformSetAndGet() {
  _simpleStorePerformSetAndGet = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(_ref16) {
    var eth, simpleStore, _ref16$setNumberValue, setNumberValue, _ref16$setOpts, setOpts, setTxHash, setTx, setTxReceipt, getResult;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          eth = _ref16.eth, simpleStore = _ref16.simpleStore, _ref16$setNumberValue = _ref16.setNumberValue, setNumberValue = _ref16$setNumberValue === void 0 ? 42 : _ref16$setNumberValue, _ref16$setOpts = _ref16.setOpts, setOpts = _ref16$setOpts === void 0 ? {} : _ref16$setOpts;
          _context17.next = 3;
          return simpleStore.set(setNumberValue, setOpts);
        case 3:
          setTxHash = _context17.sent;
          assert.equal(typeof setTxHash, 'string');
          _context17.next = 7;
          return eth.getTransactionByHash(setTxHash);
        case 7:
          setTx = _context17.sent;
          assert.ok(setTx);
          assert.equal(typeof setTx, 'object');
          _context17.next = 12;
          return eth.getTransactionReceipt(setTxHash);
        case 12:
          setTxReceipt = _context17.sent;
          assert.equal(typeof setTxReceipt, 'object');
          _context17.next = 16;
          return simpleStore.get();
        case 16:
          getResult = _context17.sent;
          assert.equal(typeof getResult, 'object');
          assert.equal(getResult[0].toNumber(10), setNumberValue);
          return _context17.abrupt("return", {
            setTx: setTx,
            setTxReceipt: setTxReceipt
          });
        case 20:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _simpleStorePerformSetAndGet.apply(this, arguments);
}
function deployAndTestComplexStore(_x5) {
  return _deployAndTestComplexStore.apply(this, arguments);
}
function _deployAndTestComplexStore() {
  _deployAndTestComplexStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(_ref17) {
    var eth, newTxParams, accounts, contract, defaultTxObject, ComplexStore, initialValue, initialAddressArray, deployTxHash, deployTx, deployTxRx, complexStore, addressResult0, addressResult1, addressResult2, someValue;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          eth = _ref17.eth, newTxParams = _ref17.newTxParams;
          _context18.next = 3;
          return eth.accounts();
        case 3:
          accounts = _context18.sent;
          contract = new EthContract(eth);
          defaultTxObject = {
            from: accounts[0],
            gas: 300000
          };
          ComplexStore = contract(TestContracts.ComplexStore.abi, TestContracts.ComplexStore.bytecode, defaultTxObject);
          initialValue = 730483222;
          initialAddressArray = [accounts[3], accounts[2], accounts[1]];
          if (!newTxParams) {
            _context18.next = 15;
            break;
          }
          _context18.next = 12;
          return ComplexStore["new"](initialValue, initialAddressArray, newTxParams);
        case 12:
          deployTxHash = _context18.sent;
          _context18.next = 18;
          break;
        case 15:
          _context18.next = 17;
          return ComplexStore["new"](initialValue, initialAddressArray);
        case 17:
          deployTxHash = _context18.sent;
        case 18:
          _context18.next = 20;
          return eth.getTransactionByHash(deployTxHash);
        case 20:
          deployTx = _context18.sent;
          _context18.next = 23;
          return eth.getTransactionReceipt(deployTxHash);
        case 23:
          deployTxRx = _context18.sent;
          complexStore = ComplexStore.at(deployTxRx.contractAddress);
          _context18.next = 27;
          return complexStore.addresses(0);
        case 27:
          addressResult0 = _context18.sent;
          assert.equal(addressResult0[0], initialAddressArray[0]);
          _context18.next = 31;
          return complexStore.addresses(1);
        case 31:
          addressResult1 = _context18.sent;
          assert.equal(addressResult1[0], initialAddressArray[1]);
          _context18.next = 35;
          return complexStore.addresses(2);
        case 35:
          addressResult2 = _context18.sent;
          assert.equal(addressResult2[0], initialAddressArray[2]);
          _context18.next = 39;
          return complexStore.someVal();
        case 39:
          someValue = _context18.sent;
          assert.equal(someValue[0].toNumber(10), initialValue);
          return _context18.abrupt("return", {
            deployTx: deployTx
          });
        case 42:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return _deployAndTestComplexStore.apply(this, arguments);
}