"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announceProvider = exports.requestProvider = void 0;
const utils_1 = require("@metamask/utils");
/**
 * Describes the possible EIP-6963 event names
 */
var EIP6963EventNames;
(function (EIP6963EventNames) {
    EIP6963EventNames["Announce"] = "eip6963:announceProvider";
    EIP6963EventNames["Request"] = "eip6963:requestProvider";
})(EIP6963EventNames || (EIP6963EventNames = {}));
// https://github.com/thenativeweb/uuidv4/blob/bdcf3a3138bef4fb7c51f389a170666f9012c478/lib/uuidv4.ts#L5
const UUID_V4_REGEX = /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;
// https://stackoverflow.com/a/20204811
const FQDN_REGEX = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/u;
/**
 * Intended to be used by a dapp. Forwards every announced provider to the
 * provided handler by listening for * {@link EIP6963AnnounceProviderEvent},
 * and dispatches an {@link EIP6963RequestProviderEvent}.
 *
 * @param handleProvider - A function that handles an announced provider.
 */
function requestProvider(handleProvider) {
    window.addEventListener(EIP6963EventNames.Announce, (event) => {
        if (!isValidAnnounceProviderEvent(event)) {
            throwErrorEIP6963(`Invalid EIP-6963 AnnounceProviderEvent object received from ${EIP6963EventNames.Announce} event.`);
        }
        handleProvider(event.detail);
    });
    window.dispatchEvent(new Event(EIP6963EventNames.Request));
}
exports.requestProvider = requestProvider;
/**
 * Intended to be used by a wallet. Announces a provider by dispatching
 * an {@link EIP6963AnnounceProviderEvent}, and listening for
 * {@link EIP6963RequestProviderEvent} to re-announce.
 *
 * @throws If the {@link EIP6963ProviderDetail} is invalid.
 * @param providerDetail - The {@link EIP6963ProviderDetail} to announce.
 * @param providerDetail.info - The {@link EIP6963ProviderInfo} to announce.
 * @param providerDetail.provider - The provider to announce.
 */
function announceProvider(providerDetail) {
    if (!isValidProviderDetail(providerDetail)) {
        throwErrorEIP6963('Invalid EIP-6963 ProviderDetail object.');
    }
    const { info, provider } = providerDetail;
    const _announceProvider = () => window.dispatchEvent(new CustomEvent(EIP6963EventNames.Announce, {
        detail: Object.freeze({ info: { ...info }, provider }),
    }));
    _announceProvider();
    window.addEventListener(EIP6963EventNames.Request, (event) => {
        if (!isValidRequestProviderEvent(event)) {
            throwErrorEIP6963(`Invalid EIP-6963 RequestProviderEvent object received from ${EIP6963EventNames.Request} event.`);
        }
        _announceProvider();
    });
}
exports.announceProvider = announceProvider;
/**
 * Validates an {@link EIP6963RequestProviderEvent} object.
 *
 * @param event - The {@link EIP6963RequestProviderEvent} to validate.
 * @returns Whether the {@link EIP6963RequestProviderEvent} is valid.
 */
function isValidRequestProviderEvent(event) {
    return event instanceof Event && event.type === EIP6963EventNames.Request;
}
/**
 * Validates an {@link EIP6963AnnounceProviderEvent} object.
 *
 * @param event - The {@link EIP6963AnnounceProviderEvent} to validate.
 * @returns Whether the {@link EIP6963AnnounceProviderEvent} is valid.
 */
function isValidAnnounceProviderEvent(event) {
    return (event instanceof CustomEvent &&
        event.type === EIP6963EventNames.Announce &&
        Object.isFrozen(event.detail) &&
        isValidProviderDetail(event.detail));
}
/**
 * Validates an {@link EIP6963ProviderDetail} object.
 *
 * @param providerDetail - The {@link EIP6963ProviderDetail} to validate.
 * @returns Whether the {@link EIP6963ProviderDetail} is valid.
 */
function isValidProviderDetail(providerDetail) {
    if (!(0, utils_1.isObject)(providerDetail) ||
        !(0, utils_1.isObject)(providerDetail.info) ||
        !(0, utils_1.isObject)(providerDetail.provider)) {
        return false;
    }
    const { info } = providerDetail;
    return (typeof info.uuid === 'string' &&
        UUID_V4_REGEX.test(info.uuid) &&
        typeof info.name === 'string' &&
        Boolean(info.name) &&
        typeof info.icon === 'string' &&
        info.icon.startsWith('data:image') &&
        typeof info.rdns === 'string' &&
        FQDN_REGEX.test(info.rdns));
}
/**
 * Throws an error with link to EIP-6963 specifications.
 *
 * @param message - The message to include.
 * @throws a friendly error with a link to EIP-6963.
 */
function throwErrorEIP6963(message) {
    throw new Error(`${message} See https://eips.ethereum.org/EIPS/eip-6963 for requirements.`);
}
//# sourceMappingURL=EIP6963.js.map