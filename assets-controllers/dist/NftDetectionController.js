"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftDetectionController = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const polling_controller_1 = require("@metamask/polling-controller");
const assetsUtil_1 = require("./assetsUtil");
const constants_1 = require("./constants");
const NftController_1 = require("./NftController");
const DEFAULT_INTERVAL = 180000;
/**
 * Controller that passively polls on a set interval for NFT auto detection
 */
class NftDetectionController extends polling_controller_1.StaticIntervalPollingControllerV1 {
    /**
     * Creates an NftDetectionController instance.
     *
     * @param options - The controller options.
     * @param options.chainId - The chain ID of the current network.
     * @param options.onNftsStateChange - Allows subscribing to assets controller state changes.
     * @param options.onPreferencesStateChange - Allows subscribing to preferences controller state changes.
     * @param options.onNetworkStateChange - Allows subscribing to network controller state changes.
     * @param options.getOpenSeaApiKey - Gets the OpenSea API key, if one is set.
     * @param options.addNft - Add an NFT.
     * @param options.getNftApi - Gets the URL to fetch an NFT from OpenSea.
     * @param options.getNftState - Gets the current state of the Assets controller.
     * @param options.getNetworkClientById - Gets the network client by ID, from the NetworkController.
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     */
    constructor({ chainId: initialChainId, getNetworkClientById, onPreferencesStateChange, onNetworkStateChange, getOpenSeaApiKey, addNft, getNftApi, getNftState, }, config, state) {
        super(config, state);
        /**
         * Name of this controller used during composition
         */
        this.name = 'NftDetectionController';
        /**
         * Checks whether network is mainnet or not.
         *
         * @returns Whether current network is mainnet.
         */
        this.isMainnet = () => this.config.chainId === controller_utils_1.ChainId.mainnet;
        this.isMainnetByNetworkClientId = (networkClient) => {
            return networkClient.configuration.chainId === controller_utils_1.ChainId.mainnet;
        };
        this.defaultConfig = {
            interval: DEFAULT_INTERVAL,
            chainId: initialChainId,
            selectedAddress: '',
            disabled: true,
        };
        this.initialize();
        this.getNftState = getNftState;
        this.getNetworkClientById = getNetworkClientById;
        onPreferencesStateChange(({ selectedAddress, useNftDetection }) => {
            const { selectedAddress: previouslySelectedAddress, disabled } = this.config;
            if (selectedAddress !== previouslySelectedAddress ||
                !useNftDetection !== disabled) {
                this.configure({ selectedAddress, disabled: !useNftDetection });
                if (useNftDetection) {
                    this.start();
                }
                else {
                    this.stop();
                }
            }
        });
        onNetworkStateChange(({ providerConfig }) => {
            this.configure({
                chainId: providerConfig.chainId,
            });
        });
        this.getOpenSeaApiKey = getOpenSeaApiKey;
        this.addNft = addNft;
        this.getNftApi = getNftApi;
        this.setIntervalLength(this.config.interval);
    }
    getOwnerNftApi({ address, next, }) {
        return `${controller_utils_1.OPENSEA_PROXY_URL}/chain/${NftController_1.OpenSeaV2ChainIds.ethereum}/account/${address}/nfts?limit=200&next=${next !== null && next !== void 0 ? next : ''}`;
    }
    getOwnerNfts(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let nftApiResponse;
            let nfts = [];
            let next;
            do {
                nftApiResponse = yield (0, controller_utils_1.fetchWithErrorHandling)({
                    url: this.getOwnerNftApi({ address, next }),
                    timeout: 15000,
                });
                if (!nftApiResponse) {
                    return nfts;
                }
                const newNfts = yield Promise.all(nftApiResponse.nfts.map((nftV2) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const nftV1 = (0, assetsUtil_1.mapOpenSeaNftV2ToV1)(nftV2);
                    // If the image hasn't been processed into OpenSea's CDN, the image_url will be null.
                    // Try fetching the NFT individually, which returns the original image url from metadata if available.
                    if (!nftV1.image_url && nftV2.metadata_url) {
                        const nftDetails = yield (0, controller_utils_1.safelyExecute)(() => (0, controller_utils_1.timeoutFetch)(this.getNftApi({
                            contractAddress: nftV2.contract,
                            tokenId: nftV2.identifier,
                        }), undefined, 1000).then((r) => r.json()));
                        nftV1.image_original_url = (_b = (_a = nftDetails === null || nftDetails === void 0 ? void 0 : nftDetails.nft) === null || _a === void 0 ? void 0 : _a.image_url) !== null && _b !== void 0 ? _b : null;
                    }
                    return nftV1;
                })));
                nfts = [...nfts, ...newNfts];
            } while ((next = nftApiResponse.next));
            return nfts;
        });
    }
    _executePoll(networkClientId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.detectNfts({ networkClientId, userAddress: options.address });
        });
    }
    /**
     * Start polling for the currency rate.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isMainnet() || this.disabled) {
                return;
            }
            yield this.startPolling();
        });
    }
    /**
     * Stop polling for the currency rate.
     */
    stop() {
        this.stopPolling();
    }
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    /**
     * Starts a new polling interval.
     *
     * @param interval - An interval on which to poll.
     */
    startPolling(interval) {
        return __awaiter(this, void 0, void 0, function* () {
            interval && this.configure({ interval }, false, false);
            this.stopPolling();
            yield this.detectNfts();
            this.intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield this.detectNfts();
            }), this.config.interval);
        });
    }
    /**
     * Triggers asset ERC721 token auto detection on mainnet. Any newly detected NFTs are
     * added.
     *
     * @param options - Options bag.
     * @param options.networkClientId - The network client ID to detect NFTs on.
     * @param options.userAddress - The address to detect NFTs for.
     */
    detectNfts({ networkClientId, userAddress, } = { userAddress: this.config.selectedAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            /* istanbul ignore if */
            if (!this.isMainnet() || this.disabled) {
                return;
            }
            /* istanbul ignore else */
            if (!userAddress) {
                return;
            }
            const apiNfts = yield this.getOwnerNfts(userAddress);
            const addNftPromises = apiNfts.map((nft) => __awaiter(this, void 0, void 0, function* () {
                const { token_id, num_sales, background_color, image_url, image_preview_url, image_thumbnail_url, image_original_url, animation_url, animation_original_url, name, description, external_link, creator, asset_contract: { address, schema_name }, last_sale, } = nft;
                let ignored;
                /* istanbul ignore else */
                const { ignoredNfts } = this.getNftState();
                if (ignoredNfts.length) {
                    ignored = ignoredNfts.find((c) => {
                        /* istanbul ignore next */
                        return (c.address === (0, controller_utils_1.toChecksumHexAddress)(address) &&
                            c.tokenId === token_id);
                    });
                }
                /* istanbul ignore else */
                if (!ignored) {
                    /* istanbul ignore next */
                    const nftMetadata = Object.assign({}, { name }, creator && { creator }, description && { description }, image_url && { image: image_url }, num_sales && { numberOfSales: num_sales }, background_color && { backgroundColor: background_color }, image_preview_url && { imagePreview: image_preview_url }, image_thumbnail_url && { imageThumbnail: image_thumbnail_url }, image_original_url && { imageOriginal: image_original_url }, animation_url && { animation: animation_url }, animation_original_url && {
                        animationOriginal: animation_original_url,
                    }, schema_name && { standard: schema_name }, external_link && { externalLink: external_link }, last_sale && { lastSale: last_sale });
                    yield this.addNft(address, token_id, {
                        nftMetadata,
                        userAddress,
                        source: constants_1.Source.Detected,
                        networkClientId,
                    });
                }
            }));
            yield Promise.all(addNftPromises);
        });
    }
}
exports.NftDetectionController = NftDetectionController;
exports.default = NftDetectionController;
//# sourceMappingURL=NftDetectionController.js.map