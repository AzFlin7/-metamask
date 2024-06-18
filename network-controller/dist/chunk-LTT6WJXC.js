"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkNFRLCZQIjs = require('./chunk-NFRLCZQI.js');

// src/create-auto-managed-network-client.ts
var REFLECTIVE_PROPERTY_NAME = "__target__";
var UNINITIALIZED_TARGET = { __UNINITIALIZED__: true };
function createAutoManagedNetworkClient(networkClientConfiguration) {
  let networkClient;
  const providerProxy = new Proxy(UNINITIALIZED_TARGET, {
    // TODO: Replace `any` with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(_target, propertyName, receiver) {
      if (propertyName === REFLECTIVE_PROPERTY_NAME) {
        return networkClient?.provider;
      }
      networkClient ?? (networkClient = _chunkNFRLCZQIjs.createNetworkClient.call(void 0, networkClientConfiguration));
      if (networkClient === void 0) {
        throw new Error(
          "It looks like `createNetworkClient` didn't return anything. Perhaps it's being mocked?"
        );
      }
      const { provider } = networkClient;
      if (propertyName in provider) {
        const value = provider[propertyName];
        if (typeof value === "function") {
          return function(...args) {
            return value.apply(this === receiver ? provider : this, args);
          };
        }
        return value;
      }
      return void 0;
    },
    // TODO: Replace `any` with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    has(_target, propertyName) {
      if (propertyName === REFLECTIVE_PROPERTY_NAME) {
        return true;
      }
      networkClient ?? (networkClient = _chunkNFRLCZQIjs.createNetworkClient.call(void 0, networkClientConfiguration));
      const { provider } = networkClient;
      return propertyName in provider;
    }
  });
  const blockTrackerProxy = new Proxy(
    UNINITIALIZED_TARGET,
    {
      // TODO: Replace `any` with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(_target, propertyName, receiver) {
        if (propertyName === REFLECTIVE_PROPERTY_NAME) {
          return networkClient?.blockTracker;
        }
        networkClient ?? (networkClient = _chunkNFRLCZQIjs.createNetworkClient.call(void 0, networkClientConfiguration));
        if (networkClient === void 0) {
          throw new Error(
            "It looks like createNetworkClient returned undefined. Perhaps it's mocked?"
          );
        }
        const { blockTracker } = networkClient;
        if (propertyName in blockTracker) {
          const value = blockTracker[propertyName];
          if (typeof value === "function") {
            return function(...args) {
              return value.apply(this === receiver ? blockTracker : this, args);
            };
          }
          return value;
        }
        return void 0;
      },
      // TODO: Replace `any` with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      has(_target, propertyName) {
        if (propertyName === REFLECTIVE_PROPERTY_NAME) {
          return true;
        }
        networkClient ?? (networkClient = _chunkNFRLCZQIjs.createNetworkClient.call(void 0, networkClientConfiguration));
        const { blockTracker } = networkClient;
        return propertyName in blockTracker;
      }
    }
  );
  const destroy = () => {
    networkClient?.destroy();
  };
  return {
    configuration: networkClientConfiguration,
    provider: providerProxy,
    blockTracker: blockTrackerProxy,
    destroy
  };
}



exports.createAutoManagedNetworkClient = createAutoManagedNetworkClient;
//# sourceMappingURL=chunk-LTT6WJXC.js.map