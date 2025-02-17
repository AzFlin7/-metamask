"use strict";

var abi = require('ethjs-abi'); // eslint-disable-line
var keccak256 = require('js-sha3').keccak_256; // eslint-disable-line
var EthFilter = require('@metamask/ethjs-filter'); // eslint-disable-line
var getKeys = require('@metamask/ethjs-util').getKeys; // eslint-disable-line
var Contract = require('./contract');
var hasTransactionObject = require('./has-tx-object');
module.exports = EthContract;
function EthContract(query) {
  return function contractFactory(contractABI, contractBytecode, contractDefaultTxObject) {
    // validate params
    if (!Array.isArray(contractABI)) {
      throw new Error("[ethjs-contract] Contract ABI must be type Array, got type " + typeof contractABI);
    }
    if (typeof contractBytecode !== 'undefined' && typeof contractBytecode !== 'string') {
      throw new Error("[ethjs-contract] Contract bytecode must be type String, got type " + typeof contractBytecode);
    }
    if (typeof contractDefaultTxObject !== 'undefined' && typeof contractDefaultTxObject !== 'object') {
      throw new Error("[ethjs-contract] Contract default tx object must be type Object, got type " + typeof contractABI);
    }

    // build contract object
    var output = {};
    output.at = function contractAtAddress(address) {
      return new Contract({
        address: address,
        query: query,
        contractBytecode: contractBytecode,
        contractDefaultTxObject: contractDefaultTxObject,
        contractABI: contractABI
      });
    };
    output["new"] = function newContract() {
      var providedTxObject = {}; // eslint-disable-line
      var newMethodCallback = null; // eslint-disable-line
      var newMethodArgs = [].slice.call(arguments); // eslint-disable-line
      if (typeof newMethodArgs[newMethodArgs.length - 1] === 'function') newMethodCallback = newMethodArgs.pop();
      if (hasTransactionObject(newMethodArgs)) providedTxObject = newMethodArgs.pop();
      var constructorMethod = getConstructorFromABI(contractABI);
      var assembleTxObject = Object.assign({}, contractDefaultTxObject, providedTxObject);

      // set contract deploy bytecode
      if (contractBytecode) {
        assembleTxObject.data = contractBytecode;
      }

      // append encoded constructor arguments
      if (constructorMethod) {
        var constructorBytecode = abi.encodeParams(getKeys(constructorMethod.inputs, 'type'), newMethodArgs).substring(2); // eslint-disable-line
        assembleTxObject.data = "" + assembleTxObject.data + constructorBytecode;
      }
      return newMethodCallback ? query.sendTransaction(assembleTxObject, newMethodCallback) : query.sendTransaction(assembleTxObject);
    };
    return output;
  };
}
function getConstructorFromABI(contractABI) {
  return contractABI.filter(function (json) {
    return json.type === 'constructor';
  })[0];
}