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
exports.ERC721Standard = void 0;
const contracts_1 = require("@ethersproject/contracts");
const controller_utils_1 = require("@metamask/controller-utils");
const metamask_eth_abis_1 = require("@metamask/metamask-eth-abis");
const assetsUtil_1 = require("../../../assetsUtil");
class ERC721Standard {
    constructor(provider) {
        /**
         * Query if contract implements ERC721Metadata interface.
         *
         * @param address - ERC721 asset contract address.
         * @returns Promise resolving to whether the contract implements ERC721Metadata interface.
         */
        this.contractSupportsMetadataInterface = (address) => __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC721_METADATA_INTERFACE_ID);
        });
        /**
         * Query if contract implements ERC721Enumerable interface.
         *
         * @param address - ERC721 asset contract address.
         * @returns Promise resolving to whether the contract implements ERC721Enumerable interface.
         */
        this.contractSupportsEnumerableInterface = (address) => __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC721_ENUMERABLE_INTERFACE_ID);
        });
        /**
         * Query if contract implements ERC721 interface.
         *
         * @param address - ERC721 asset contract address.
         * @returns Promise resolving to whether the contract implements ERC721 interface.
         */
        this.contractSupportsBase721Interface = (address) => __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC721_INTERFACE_ID);
        });
        /**
         * Enumerate assets assigned to an owner.
         *
         * @param address - ERC721 asset contract address.
         * @param selectedAddress - Current account public address.
         * @param index - An NFT counter less than `balanceOf(selectedAddress)`.
         * @returns Promise resolving to token identifier for the 'index'th asset assigned to 'selectedAddress'.
         */
        this.getNftTokenId = (address, selectedAddress, index) => __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            return contract.tokenOfOwnerByIndex(selectedAddress, index);
        });
        /**
         * Query for tokenURI for a given asset.
         *
         * @param address - ERC721 asset contract address.
         * @param tokenId - ERC721 asset identifier.
         * @returns Promise resolving to the 'tokenURI'.
         */
        this.getTokenURI = (address, tokenId) => __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            const supportsMetadata = yield this.contractSupportsMetadataInterface(address);
            if (!supportsMetadata) {
                throw new Error('Contract does not support ERC721 metadata interface.');
            }
            return contract.tokenURI(tokenId);
        });
        /**
         * Query for name for a given asset.
         *
         * @param address - ERC721 asset contract address.
         * @returns Promise resolving to the 'name'.
         */
        this.getAssetName = (address) => __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            return contract.name();
        });
        /**
         * Query for symbol for a given asset.
         *
         * @param address - ERC721 asset contract address.
         * @returns Promise resolving to the 'symbol'.
         */
        this.getAssetSymbol = (address) => __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            return contract.symbol();
        });
        /**
         * Query if a contract implements an interface.
         *
         * @param address - Asset contract address.
         * @param interfaceId - Interface identifier.
         * @returns Promise resolving to whether the contract implements `interfaceID`.
         */
        this.contractSupportsInterface = (address, interfaceId) => __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            try {
                return yield contract.supportsInterface(interfaceId);
            }
            catch (err) {
                // Mirror previous implementation
                if (err instanceof Error &&
                    err.message.includes('call revert exception')) {
                    return false;
                }
                throw err;
            }
        });
        /**
         * Query if a contract implements an interface.
         *
         * @param address - Asset contract address.
         * @param ipfsGateway - The user's preferred IPFS gateway.
         * @param tokenId - tokenId of a given token in the contract.
         * @returns Promise resolving an object containing the standard, tokenURI, symbol and name of the given contract/tokenId pair.
         */
        this.getDetails = (address, ipfsGateway, tokenId) => __awaiter(this, void 0, void 0, function* () {
            const isERC721 = yield this.contractSupportsBase721Interface(address);
            if (!isERC721) {
                throw new Error("This isn't a valid ERC721 contract");
            }
            const [symbol, name, tokenURI] = yield Promise.all([
                (0, controller_utils_1.safelyExecute)(() => this.getAssetSymbol(address)),
                (0, controller_utils_1.safelyExecute)(() => this.getAssetName(address)),
                tokenId
                    ? (0, controller_utils_1.safelyExecute)(() => this.getTokenURI(address, tokenId).then((uri) => uri.startsWith('ipfs://')
                        ? (0, assetsUtil_1.getFormattedIpfsUrl)(ipfsGateway, uri, true)
                        : uri))
                    : undefined,
            ]);
            let image;
            if (tokenURI) {
                try {
                    const response = yield (0, controller_utils_1.timeoutFetch)(tokenURI);
                    const object = yield response.json();
                    image = object === null || object === void 0 ? void 0 : object.image;
                    if (image === null || image === void 0 ? void 0 : image.startsWith('ipfs://')) {
                        image = (0, assetsUtil_1.getFormattedIpfsUrl)(ipfsGateway, image, true);
                    }
                }
                catch (_a) {
                    // ignore
                }
            }
            return {
                standard: controller_utils_1.ERC721,
                tokenURI,
                symbol,
                name,
                image,
            };
        });
        this.provider = provider;
    }
    /**
     * Query for owner for a given ERC721 asset.
     *
     * @param address - ERC721 asset contract address.
     * @param tokenId - ERC721 asset identifier.
     * @returns Promise resolving to the owner address.
     */
    getOwnerOf(address, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC721, this.provider);
            return contract.ownerOf(tokenId);
        });
    }
}
exports.ERC721Standard = ERC721Standard;
//# sourceMappingURL=ERC721Standard.js.map