"use strict";

var _require = require('chai'),
  assert = _require.assert;
var TestRPC = require('ganache-cli');
var provider = TestRPC.provider();
var provider2 = TestRPC.provider();
var Eth = require('../index.js');
describe('eth.js', function () {
  describe('constructor', function () {
    it('should construct properly', function () {
      var eth = new Eth(provider);
      assert.equal(typeof Eth, 'function');
      assert.equal(typeof eth, 'object');
      assert.equal(typeof eth.currentProvider, 'object');
      assert.equal(typeof eth.setProvider, 'function');
    });
    it('should throw under invalid construction', function () {
      assert["throws"](function () {
        return Eth(provider);
      }, Error); // eslint-disable-line
    });

    it('should throw under invalid provider construction', function () {
      assert["throws"](function () {
        return new Eth(Eth.HttpProvider(''));
      }, Error); // eslint-disable-line
    });
  });

  describe('setProvider', function () {
    it('should function normally', function (done) {
      var eth = new Eth(provider);
      assert.equal(typeof eth.setProvider, 'function');
      eth.accounts(function (err, accounts1) {
        assert.equal(err, null);
        assert.equal(Array.isArray(accounts1), true);
        eth.setProvider(provider2);
        eth.accounts(function (err2, accounts2) {
          assert.equal(err2, null);
          assert.equal(Array.isArray(accounts2), true);
          assert.notEqual(accounts1[0], accounts2[0]);
          done();
        });
      });
    });
  });
  describe('BN', function () {
    it('should function normally', function () {
      var val = '435348973849579834789378934';
      assert.equal(typeof Eth.BN, 'function');
      assert.equal(new Eth.BN(val).toString(10), val);
    });
  });
  describe('isAddress', function () {
    it('should function normally', function () {
      var addr = '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78';
      var addr1 = '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78'.toLowerCase();
      var invalid1 = 'sjhsdf';
      var invalid2 = 24323;
      var invalid3 = null;
      var invalid4 = '6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78';
      var invalid5 = '6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f7';
      var invalid6 = '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f7';
      assert.equal(typeof Eth.isAddress, 'function');
      assert.equal(Eth.isAddress(addr), true);
      assert.equal(Eth.isAddress(addr1), true);
      assert.equal(Eth.isAddress(invalid1), false);
      assert.equal(Eth.isAddress(invalid2), false);
      assert.equal(Eth.isAddress(invalid3), false);
      assert.equal(Eth.isAddress(invalid4), false);
      assert.equal(Eth.isAddress(invalid5), false);
      assert.equal(Eth.isAddress(invalid6), false);
    });
  });
  describe('keccak256', function () {
    it('should function normally', function () {
      var val = '45666';
      var hashVal = '512635863c9f802993f66ea46be7d8c3af7a567b940fbda0313433f33c5cc699';
      var hexHashVal = "0x" + hashVal;
      assert.equal(typeof Eth.keccak256, 'function');
      assert.equal(Eth.keccak256(val), hexHashVal);
    });
  });
  describe('Buffer', function () {
    it('should function normally', function () {
      assert.equal(new Eth.Buffer('sjdfhj', 'utf8').toString('utf8'), 'sjdfhj');
    });
  });
  describe('isHexString', function () {
    it('should function normally', function () {
      var val1 = '0x';
      var val2 = '0xecbcd9838f7f2afa6e809df8d7cdae69aa5dfc14d563ee98e97effd3f6a652f2';
      var val3 = '0x0a';
      var invalid1 = 49824;
      var invalid2 = null;
      var invalid3 = 'jjjjj';
      assert.equal(typeof Eth.isHexString, 'function');
      assert.equal(Eth.isHexString(val1), true);
      assert.equal(Eth.isHexString(val2), true);
      assert.equal(Eth.isHexString(val3), true);
      assert.equal(Eth.isHexString(invalid1), false);
      assert.equal(Eth.isHexString(invalid2), false);
      assert.equal(Eth.isHexString(invalid3), false);
    });
  });
  describe('fromWei', function () {
    it('should function normally', function () {
      var val = '23489723849723897239842';
      assert.equal(typeof Eth.fromWei, 'function');
      assert.equal(Eth.fromWei(val, 'ether').toString(10), '23489.723849723897239842');
    });
  });
  describe('toWei', function () {
    it('should function normally', function () {
      var val = '687676';
      assert.equal(typeof Eth.toWei, 'function');
      assert.equal(Eth.toWei(val, 'ether').toString(10), '687676000000000000000000');
    });
  });
  describe('toBN', function () {
    it('should function normally', function () {
      var testCases = [{
        actual: 55,
        expected: new Eth.BN(55)
      }, {
        actual: '55',
        expected: new Eth.BN('55')
      }, {
        actual: '0x0a',
        expected: new Eth.BN('a', 16)
      }, {
        actual: '0a',
        expected: new Eth.BN('a', 16)
      }, {
        actual: 0,
        expected: new Eth.BN(0)
      }, {
        actual: 1,
        expected: new Eth.BN(1)
      }, {
        actual: -1,
        expected: new Eth.BN(-1)
      }, {
        actual: 3490853908345,
        expected: new Eth.BN(3490853908345)
      }, {
        actual: '238473873297432987489723234239728974',
        expected: new Eth.BN('238473873297432987489723234239728974')
      }, {
        actual: new Eth.BN(234023984),
        expected: new Eth.BN(234023984)
      }, {
        actual: new Eth.BN(0),
        expected: new Eth.BN(0)
      }];
      assert.equal(typeof Eth.toBN, 'function');
      testCases.forEach(function (testCase) {
        assert.deepEqual(Eth.toBN(testCase.actual).toString(10), testCase.expected.toString(10));
      });
    });
  });
  describe('fromAscii', function () {
    it('should function normally', function () {
      var testCases = [{
        actual: 'myString',
        expected: '0x6d79537472696e67'
      }, {
        actual: 'myString\x00',
        expected: '0x6d79537472696e6700'
      }, {
        actual: "\x03\0\0\x005\xE8\xC6\xD5L]\x12|\x9D\xCE\xBE\x9E\x1A7\xAB\x9B\x052\x11(\xD0\x97Y\n<\x10\0\0\0\0\0\0e!\xDFd/\xF1\xF5\xEC\f:z\xA6\xCE\xA6\xB1\xE7\xB7\xF7\xCD\xA2\xCB\xDF\x076*\x85\b\x8E\x97\xF1\x9E\xF9C1\xC9U\xC0\xE92\x1A\xD3\x86B\x8C",
        expected: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'
      }];
      assert.equal(typeof Eth.fromAscii, 'function');
      testCases.forEach(function (testCase) {
        assert.equal(Eth.fromAscii(testCase.actual), testCase.expected);
      });
    });
  });
  describe('toAscii', function () {
    it('should function normally', function () {
      var testCases = [{
        actual: '0x6d79537472696e67',
        expected: 'myString'
      }, {
        actual: '0x6d79537472696e6700',
        expected: "myString\0"
      }, {
        actual: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c',
        expected: "\x03\0\0\x005\xE8\xC6\xD5L]\x12|\x9D\xCE\xBE\x9E\x1A7\xAB\x9B\x052\x11(\xD0\x97Y\n<\x10\0\0\0\0\0\0e!\xDFd/\xF1\xF5\xEC\f:z\xA6\xCE\xA6\xB1\xE7\xB7\xF7\xCD\xA2\xCB\xDF\x076*\x85\b\x8E\x97\xF1\x9E\xF9C1\xC9U\xC0\xE92\x1A\xD3\x86B\x8C"
      }];
      assert.equal(typeof Eth.toAscii, 'function');
      testCases.forEach(function (testCase) {
        assert.equal(Eth.toAscii(testCase.actual), testCase.expected);
      });
    });
  });
  describe('fromUtf8', function () {
    it('should function normally', function () {
      var testCases = [{
        actual: 'myString',
        expected: '0x6d79537472696e67'
      }, {
        actual: 'myString\x00',
        expected: '0x6d79537472696e67'
      }, {
        actual: "expected value\0\0\0",
        expected: '0x65787065637465642076616c7565'
      }];
      assert.equal(typeof Eth.fromUtf8, 'function');
      testCases.forEach(function (testCase) {
        assert.equal(Eth.fromUtf8(testCase.actual), testCase.expected);
      });
    });
  });
  describe('toUtf8', function () {
    it('should function normally', function () {
      var testCases = [{
        actual: '0x6d79537472696e67',
        expected: 'myString'
      }, {
        actual: '0x6d79537472696e6700',
        expected: 'myString'
      }, {
        actual: '0x65787065637465642076616c7565000000000000000000000000000000000000',
        expected: 'expected value'
      }];
      assert.equal(typeof Eth.toUtf8, 'function');
      testCases.forEach(function (testCase) {
        assert.equal(Eth.toUtf8(testCase.actual), testCase.expected);
      });
    });
  });
  describe('HttpProvider', function () {
    it('should function normally', function () {
      assert.equal(typeof Eth.HttpProvider, 'function');
    });
  });
  describe('filter', function () {
    it('should function normally', function (done) {
      var eth = new Eth(provider);
      assert.equal(typeof eth.filter, 'object');
      done();
    });
  });
  describe('contract', function () {
    it('should function normally', function (done) {
      var eth = new Eth(provider);
      assert.equal(typeof eth.contract, 'function');
      done();
    });
  });
  describe('accounts', function () {
    it('should function normally', function (done) {
      var eth = new Eth(provider);
      assert.equal(typeof eth.accounts, 'function');
      eth.accounts().then(function (accounts) {
        assert.equal(Array.isArray(accounts), true);
        done();
      });
    });
  });
  describe('getBalance', function () {
    it('should function normally', function (done) {
      var eth = new Eth(provider);
      assert.equal(typeof eth.getBalance, 'function');
      eth.accounts(function (err, accounts) {
        eth.getBalance(accounts[0]).then(function (balance) {
          assert.equal(balance.gt(100), true);
          done();
        });
      });
    });
  });
});