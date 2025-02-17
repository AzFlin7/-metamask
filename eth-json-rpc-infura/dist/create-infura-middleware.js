"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfuraMiddleware = void 0;
const json_rpc_engine_1 = require("@metamask/json-rpc-engine");
const rpc_errors_1 = require("@metamask/rpc-errors");
// eslint-disable-next-line @typescript-eslint/no-shadow
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetch_config_from_req_1 = require("./fetch-config-from-req");
const logging_utils_1 = require("./logging-utils");
const log = (0, logging_utils_1.createModuleLogger)(logging_utils_1.projectLogger, 'create-infura-middleware');
const RETRIABLE_ERRORS = [
    // ignore server overload errors
    'Gateway timeout',
    'ETIMEDOUT',
    'ECONNRESET',
    // ignore server sent html error pages
    // or truncated json responses
    'SyntaxError',
];
/**
 * Builds [`@metamask/json-rpc-engine`](https://github.com/MetaMask/@metamask/json-rpc-engine)-compatible middleware designed
 * for interfacing with Infura's JSON-RPC endpoints.
 * @param opts - The options.
 * @param opts.network - A network that Infura supports; plugs into
 * `https://${network}.infura.io` (default: 'mainnet').
 * @param opts.maxAttempts - The number of times a request to Infura should be
 * retried in the case of failure (default: 5).
 * @param opts.source - A descriptor for the entity making the request; tracked
 * by Infura for analytics purposes.
 * @param opts.projectId - The Infura project id.
 * @param opts.headers - Extra headers that will be used to make the request.
 * @returns The `@metamask/json-rpc-engine`-compatible middleware.
 */
function createInfuraMiddleware({ network = 'mainnet', maxAttempts = 5, source, projectId, headers = {}, }) {
    // validate options
    if (!projectId || typeof projectId !== 'string') {
        throw new Error(`Invalid value for 'projectId': "${projectId}"`);
    }
    if (!headers || typeof headers !== 'object') {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid value for 'headers': "${headers}"`);
    }
    if (!maxAttempts) {
        throw new Error(`Invalid value for 'maxAttempts': "${maxAttempts}" (${typeof maxAttempts})`);
    }
    return (0, json_rpc_engine_1.createAsyncMiddleware)(async (req, res) => {
        // retry MAX_ATTEMPTS times, if error matches filter
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                // attempt request
                log('Attempting request to Infura. network = %o, projectId = %s, headers = %o, req = %o', network, projectId, headers, req);
                await performFetch(network, projectId, headers, req, res, source);
                // request was successful
                break;
            }
            catch (err) {
                // an error was caught while performing the request
                // if not retriable, resolve with the encountered error
                if (!isRetriableError(err)) {
                    // abort with error
                    log('Non-retriable request error encountered. req = %o, res = %o, error = %o', req, res, err);
                    throw err;
                }
                // if no more attempts remaining, throw an error
                const remainingAttempts = maxAttempts - attempt;
                if (!remainingAttempts) {
                    log('Retriable request error encountered, but exceeded max attempts. req = %o, res = %o, error = %o', req, res, err);
                    const errMsg = `InfuraProvider - cannot complete request. All retries exhausted.\nOriginal Error:\n${err.toString()}\n\n`;
                    const retriesExhaustedErr = new Error(errMsg);
                    throw retriesExhaustedErr;
                }
                // otherwise, ignore error and retry again after timeout
                log('Retriable request error encountered. req = %o, res = %o, error = %o', req, res, err);
                log('Waiting 1 second to try again...');
                await timeout(1000);
            }
        }
        // request was handled correctly, end
    });
}
exports.createInfuraMiddleware = createInfuraMiddleware;
/**
 * Makes a request to Infura, updating the given response object if the response
 * has a "successful" status code or throwing an error otherwise.
 * @param network - A network that Infura supports; plugs into
 * `https://${network}.infura.io`.
 * @param projectId - The Infura project id.
 * @param extraHeaders - Extra headers that will be used to make the request.
 * @param req - The original request object obtained via the middleware stack.
 * @param res - The original response object obtained via the middleware stack.
 * @param source - A descriptor for the entity making the request;
 * tracked by Infura for analytics purposes.
 * @throws an error with a detailed message if the HTTP status code is anywhere
 * outside 2xx, and especially if it is 405, 429, 503, or 504.
 */
async function performFetch(network, projectId, extraHeaders, req, res, source) {
    const { fetchUrl, fetchParams } = (0, fetch_config_from_req_1.fetchConfigFromReq)({
        network,
        projectId,
        extraHeaders,
        req,
        source,
    });
    const response = await (0, node_fetch_1.default)(fetchUrl, fetchParams);
    const rawData = await response.text();
    // handle errors
    if (!response.ok) {
        switch (response.status) {
            case 405:
                throw rpc_errors_1.rpcErrors.methodNotFound();
            case 429:
                throw createRatelimitError();
            case 503:
            case 504:
                throw createTimeoutError();
            default:
                throw createInternalError(rawData);
        }
    }
    // special case for now
    if (req.method === 'eth_getBlockByNumber' && rawData === 'Not Found') {
        // TODO Would this be more correct?
        // delete res.result;
        res.result = null;
        return;
    }
    // parse JSON
    const data = JSON.parse(rawData);
    // finally return result
    res.result = data.result;
    res.error = data.error;
}
/**
 * Builds a JSON-RPC 2.0 internal error object describing a rate-limiting
 * error.
 * @returns The error object.
 */
function createRatelimitError() {
    const msg = `Request is being rate limited.`;
    return createInternalError(msg);
}
/**
 * Builds a JSON-RPC 2.0 internal error object describing a timeout error.
 * @returns The error object.
 */
function createTimeoutError() {
    let msg = `Gateway timeout. The request took too long to process. `;
    msg += `This can happen when querying logs over too wide a block range.`;
    return createInternalError(msg);
}
/**
 * Builds a JSON-RPC 2.0 internal error object.
 * @param msg - The message.
 * @returns The error object.
 */
function createInternalError(msg) {
    return rpc_errors_1.rpcErrors.internal(msg);
}
/**
 * Upon making a request, we may get an error that is temporary and
 * intermittent. In these cases we can attempt the request again with the
 * assumption that the error is unlikely to occur again. Here we determine if we
 * have received such an error.
 * @param err - The error object.
 * @returns Whether the request that produced the error can be retried.
 */
function isRetriableError(err) {
    const errMessage = err.toString();
    return RETRIABLE_ERRORS.some((phrase) => errMessage.includes(phrase));
}
/**
 * A utility function that promisifies `setTimeout`.
 * @param length - The number of milliseconds to wait.
 * @returns A promise that resolves after the given time has elapsed.
 */
async function timeout(length) {
    return new Promise((resolve) => {
        setTimeout(resolve, length);
    });
}
//# sourceMappingURL=create-infura-middleware.js.map