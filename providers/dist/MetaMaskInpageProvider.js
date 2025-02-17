"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _MetaMaskInpageProvider_networkVersion;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMaskInpageProvider = exports.MetaMaskInpageProviderStreamName = void 0;
const rpc_errors_1 = require("@metamask/rpc-errors");
const messages_1 = __importDefault(require("./messages"));
const siteMetadata_1 = require("./siteMetadata");
const StreamProvider_1 = require("./StreamProvider");
const utils_1 = require("./utils");
/**
 * The name of the stream consumed by {@link MetaMaskInpageProvider}.
 */
exports.MetaMaskInpageProviderStreamName = 'metamask-provider';
class MetaMaskInpageProvider extends StreamProvider_1.AbstractStreamProvider {
    /**
     * Creates a new `MetaMaskInpageProvider`.
     *
     * @param connectionStream - A Node.js duplex stream.
     * @param options - An options bag.
     * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
     * Default: `metamask-provider`.
     * @param options.logger - The logging API to use. Default: `console`.
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100.
     * @param options.shouldSendMetadata - Whether the provider should
     * send page metadata. Default: `true`.
     */
    constructor(connectionStream, { jsonRpcStreamName = exports.MetaMaskInpageProviderStreamName, logger = console, maxEventListeners = 100, shouldSendMetadata, } = {}) {
        super(connectionStream, {
            jsonRpcStreamName,
            logger,
            maxEventListeners,
            rpcMiddleware: (0, utils_1.getDefaultExternalMiddleware)(logger),
        });
        this._sentWarnings = {
            // properties
            chainId: false,
            networkVersion: false,
            selectedAddress: false,
            // methods
            enable: false,
            experimentalMethods: false,
            send: false,
            // events
            events: {
                close: false,
                data: false,
                networkChanged: false,
                notification: false,
            },
        };
        _MetaMaskInpageProvider_networkVersion.set(this, void 0);
        // We shouldn't perform asynchronous work in the constructor, but at one
        // point we started doing so, and changing this class isn't worth it at
        // the time of writing.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initializeStateAsync();
        __classPrivateFieldSet(this, _MetaMaskInpageProvider_networkVersion, null, "f");
        this.isMetaMask = true;
        this._sendSync = this._sendSync.bind(this);
        this.enable = this.enable.bind(this);
        this.send = this.send.bind(this);
        this.sendAsync = this.sendAsync.bind(this);
        this._warnOfDeprecation = this._warnOfDeprecation.bind(this);
        this._metamask = this._getExperimentalApi();
        // handle JSON-RPC notifications
        this._jsonRpcConnection.events.on('notification', (payload) => {
            const { method } = payload;
            if (utils_1.EMITTED_NOTIFICATIONS.includes(method)) {
                // deprecated
                // emitted here because that was the original order
                this.emit('data', payload);
                // deprecated
                this.emit('notification', payload.params.result);
            }
        });
        // send website metadata
        if (shouldSendMetadata) {
            if (document.readyState === 'complete') {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                (0, siteMetadata_1.sendSiteMetadata)(this._rpcEngine, this._log);
            }
            else {
                const domContentLoadedHandler = () => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    (0, siteMetadata_1.sendSiteMetadata)(this._rpcEngine, this._log);
                    window.removeEventListener('DOMContentLoaded', domContentLoadedHandler);
                };
                window.addEventListener('DOMContentLoaded', domContentLoadedHandler);
            }
        }
    }
    //====================
    // Deprecated Properties
    //====================
    get chainId() {
        if (!this._sentWarnings.chainId) {
            this._log.warn(messages_1.default.warnings.chainIdDeprecation);
            this._sentWarnings.chainId = true;
        }
        return super.chainId;
    }
    get networkVersion() {
        if (!this._sentWarnings.networkVersion) {
            this._log.warn(messages_1.default.warnings.networkVersionDeprecation);
            this._sentWarnings.networkVersion = true;
        }
        return __classPrivateFieldGet(this, _MetaMaskInpageProvider_networkVersion, "f");
    }
    get selectedAddress() {
        if (!this._sentWarnings.selectedAddress) {
            this._log.warn(messages_1.default.warnings.selectedAddressDeprecation);
            this._sentWarnings.selectedAddress = true;
        }
        return super.selectedAddress;
    }
    //====================
    // Public Methods
    //====================
    /**
     * Submits an RPC request per the given JSON-RPC request object.
     *
     * @param payload - The RPC request object.
     * @param callback - The callback function.
     */
    sendAsync(payload, callback) {
        this._rpcRequest(payload, callback);
    }
    /**
     * We override the following event methods so that we can warn consumers
     * about deprecated events:
     * `addListener`, `on`, `once`, `prependListener`, `prependOnceListener`.
     */
    addListener(eventName, listener) {
        this._warnOfDeprecation(eventName);
        return super.addListener(eventName, listener);
    }
    on(eventName, listener) {
        this._warnOfDeprecation(eventName);
        return super.on(eventName, listener);
    }
    once(eventName, listener) {
        this._warnOfDeprecation(eventName);
        return super.once(eventName, listener);
    }
    prependListener(eventName, listener) {
        this._warnOfDeprecation(eventName);
        return super.prependListener(eventName, listener);
    }
    prependOnceListener(eventName, listener) {
        this._warnOfDeprecation(eventName);
        return super.prependOnceListener(eventName, listener);
    }
    //====================
    // Private Methods
    //====================
    /**
     * When the provider becomes disconnected, updates internal state and emits
     * required events. Idempotent with respect to the isRecoverable parameter.
     *
     * Error codes per the CloseEvent status codes as required by EIP-1193:
     * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes.
     *
     * @param isRecoverable - Whether the disconnection is recoverable.
     * @param errorMessage - A custom error message.
     * @fires BaseProvider#disconnect - If the disconnection is not recoverable.
     */
    _handleDisconnect(isRecoverable, errorMessage) {
        super._handleDisconnect(isRecoverable, errorMessage);
        if (__classPrivateFieldGet(this, _MetaMaskInpageProvider_networkVersion, "f") && !isRecoverable) {
            __classPrivateFieldSet(this, _MetaMaskInpageProvider_networkVersion, null, "f");
        }
    }
    /**
     * Warns of deprecation for the given event, if applicable.
     *
     * @param eventName - The name of the event.
     */
    _warnOfDeprecation(eventName) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (this._sentWarnings?.events[eventName] === false) {
            this._log.warn(messages_1.default.warnings.events[eventName]);
            this._sentWarnings.events[eventName] = true;
        }
    }
    //====================
    // Deprecated Methods
    //====================
    /**
     * Equivalent to: `ethereum.request('eth_requestAccounts')`.
     *
     * @deprecated Use request({ method: 'eth_requestAccounts' }) instead.
     * @returns A promise that resolves to an array of addresses.
     */
    async enable() {
        if (!this._sentWarnings.enable) {
            this._log.warn(messages_1.default.warnings.enableDeprecation);
            this._sentWarnings.enable = true;
        }
        return new Promise((resolve, reject) => {
            try {
                this._rpcRequest({ method: 'eth_requestAccounts', params: [] }, (0, utils_1.getRpcPromiseCallback)(resolve, reject));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    send(methodOrPayload, callbackOrArgs) {
        if (!this._sentWarnings.send) {
            this._log.warn(messages_1.default.warnings.sendDeprecation);
            this._sentWarnings.send = true;
        }
        if (typeof methodOrPayload === 'string' &&
            (!callbackOrArgs || Array.isArray(callbackOrArgs))) {
            return new Promise((resolve, reject) => {
                try {
                    this._rpcRequest({ method: methodOrPayload, params: callbackOrArgs }, (0, utils_1.getRpcPromiseCallback)(resolve, reject, false));
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        else if (methodOrPayload &&
            typeof methodOrPayload === 'object' &&
            typeof callbackOrArgs === 'function') {
            return this._rpcRequest(methodOrPayload, callbackOrArgs);
        }
        return this._sendSync(methodOrPayload);
    }
    /**
     * Internal backwards compatibility method, used in send.
     *
     * @param payload - A JSON-RPC request object.
     * @returns A JSON-RPC response object.
     * @deprecated
     */
    _sendSync(payload) {
        let result;
        switch (payload.method) {
            case 'eth_accounts':
                result = this.selectedAddress ? [this.selectedAddress] : [];
                break;
            case 'eth_coinbase':
                result = this.selectedAddress ?? null;
                break;
            case 'eth_uninstallFilter':
                this._rpcRequest(payload, utils_1.NOOP);
                result = true;
                break;
            case 'net_version':
                result = __classPrivateFieldGet(this, _MetaMaskInpageProvider_networkVersion, "f") ?? null;
                break;
            default:
                throw new Error(messages_1.default.errors.unsupportedSync(payload.method));
        }
        return {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result,
        };
    }
    /**
     * Constructor helper.
     *
     * Gets the experimental _metamask API as Proxy, so that we can warn consumers
     * about its experimental nature.
     *
     * @returns The experimental _metamask API.
     */
    _getExperimentalApi() {
        return new Proxy({
            /**
             * Determines if MetaMask is unlocked by the user.
             *
             * @returns Promise resolving to true if MetaMask is currently unlocked.
             */
            isUnlocked: async () => {
                if (!this._state.initialized) {
                    await new Promise((resolve) => {
                        this.on('_initialized', () => resolve());
                    });
                }
                return this._state.isUnlocked;
            },
            /**
             * Make a batch RPC request.
             *
             * @param requests - The RPC requests to make.
             */
            requestBatch: async (requests) => {
                if (!Array.isArray(requests)) {
                    throw rpc_errors_1.rpcErrors.invalidRequest({
                        message: 'Batch requests must be made with an array of request objects.',
                        data: requests,
                    });
                }
                return new Promise((resolve, reject) => {
                    this._rpcRequest(requests, (0, utils_1.getRpcPromiseCallback)(resolve, reject));
                });
            },
        }, {
            get: (obj, prop, ...args) => {
                if (!this._sentWarnings.experimentalMethods) {
                    this._log.warn(messages_1.default.warnings.experimentalMethods);
                    this._sentWarnings.experimentalMethods = true;
                }
                return Reflect.get(obj, prop, ...args);
            },
        });
    }
    /**
     * Upon receipt of a new chainId and networkVersion, emits corresponding
     * events and sets relevant public state. Does nothing if neither the chainId
     * nor the networkVersion are different from existing values.
     *
     * @fires MetamaskInpageProvider#networkChanged
     * @param networkInfo - An object with network info.
     * @param networkInfo.chainId - The latest chain ID.
     * @param networkInfo.networkVersion - The latest network ID.
     */
    _handleChainChanged({ chainId, networkVersion, } = {}) {
        // This will validate the params and disconnect the provider if the
        // networkVersion is 'loading'.
        super._handleChainChanged({ chainId, networkVersion });
        if (this._state.isConnected && networkVersion !== __classPrivateFieldGet(this, _MetaMaskInpageProvider_networkVersion, "f")) {
            __classPrivateFieldSet(this, _MetaMaskInpageProvider_networkVersion, networkVersion, "f");
            if (this._state.initialized) {
                this.emit('networkChanged', __classPrivateFieldGet(this, _MetaMaskInpageProvider_networkVersion, "f"));
            }
        }
    }
}
exports.MetaMaskInpageProvider = MetaMaskInpageProvider;
_MetaMaskInpageProvider_networkVersion = new WeakMap();
//# sourceMappingURL=MetaMaskInpageProvider.js.map