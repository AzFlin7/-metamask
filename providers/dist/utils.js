"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOOP = exports.isValidNetworkVersion = exports.isValidChainId = exports.getRpcPromiseCallback = exports.getDefaultExternalMiddleware = exports.EMITTED_NOTIFICATIONS = void 0;
const json_rpc_engine_1 = require("@metamask/json-rpc-engine");
const rpc_errors_1 = require("@metamask/rpc-errors");
const createRpcWarningMiddleware_1 = require("./middleware/createRpcWarningMiddleware");
// Constants
exports.EMITTED_NOTIFICATIONS = Object.freeze([
    'eth_subscription', // per eth-json-rpc-filters/subscriptionManager
]);
// Utility functions
/**
 * Gets the default middleware for external providers, consisting of an ID
 * remapping middleware and an error middleware.
 *
 * @param logger - The logger to use in the error middleware.
 * @returns An array of @metamask/json-rpc-engine middleware functions.
 */
const getDefaultExternalMiddleware = (logger = console) => [
    (0, json_rpc_engine_1.createIdRemapMiddleware)(),
    createErrorMiddleware(logger),
    (0, createRpcWarningMiddleware_1.createRpcWarningMiddleware)(logger),
];
exports.getDefaultExternalMiddleware = getDefaultExternalMiddleware;
/**
 * A `json-rpc-engine` middleware that logs RPC errors and validates the request
 * method.
 *
 * @param log - The logging API to use.
 * @returns A @metamask/json-rpc-engine middleware function.
 */
function createErrorMiddleware(log) {
    return (request, response, next) => {
        // json-rpc-engine will terminate the request when it notices this error
        if (typeof request.method !== 'string' || !request.method) {
            response.error = rpc_errors_1.rpcErrors.invalidRequest({
                message: `The request 'method' must be a non-empty string.`,
                data: request,
            });
        }
        next((done) => {
            const { error } = response;
            if (!error) {
                return done();
            }
            log.error(`MetaMask - RPC Error: ${error.message}`, error);
            return done();
        });
    };
}
// resolve response.result or response, reject errors
const getRpcPromiseCallback = (resolve, reject, unwrapResult = true) => (error, response) => {
    if (error || response.error) {
        reject(error || response.error);
    }
    else {
        !unwrapResult || Array.isArray(response)
            ? resolve(response)
            : resolve(response.result);
    }
};
exports.getRpcPromiseCallback = getRpcPromiseCallback;
/**
 * Checks whether the given chain ID is valid, meaning if it is non-empty,
 * '0x'-prefixed string.
 *
 * @param chainId - The chain ID to validate.
 * @returns Whether the given chain ID is valid.
 */
const isValidChainId = (chainId) => Boolean(chainId) && typeof chainId === 'string' && chainId.startsWith('0x');
exports.isValidChainId = isValidChainId;
/**
 * Checks whether the given network version is valid, meaning if it is non-empty
 * string.
 *
 * @param networkVersion - The network version to validate.
 * @returns Whether the given network version is valid.
 */
const isValidNetworkVersion = (networkVersion) => Boolean(networkVersion) && typeof networkVersion === 'string';
exports.isValidNetworkVersion = isValidNetworkVersion;
const NOOP = () => undefined;
exports.NOOP = NOOP;
//# sourceMappingURL=utils.js.map