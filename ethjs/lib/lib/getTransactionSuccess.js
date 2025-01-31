"use strict";

module.exports = function (eth) {
  return function (txHash, callback) {
    var count = 0;
    var timeout = eth.options.timeout || 800000;
    var interval = eth.options.interval || 7000;
    var prom = new Promise(function (resolve, reject) {
      var txInterval = setInterval(function () {
        eth.getTransactionReceipt(txHash, function (err, result) {
          if (err) {
            clearInterval(txInterval);
            reject(err);
          }
          if (!err && result) {
            clearInterval(txInterval);
            resolve(result);
          }
        });
        if (count >= timeout) {
          clearInterval(txInterval);
          var errMessage = "Receipt timeout waiting for tx hash: " + txHash;
          reject(errMessage);
        }
        count += interval;
      }, interval);
    });
    if (callback) {
      prom.then(function (res) {
        return callback(null, res);
      })["catch"](function (err) {
        return callback(err, null);
      });
    }
    return callback ? null : prom;
  };
};