import type { Web3Provider } from '@ethersproject/providers';
import type * as BN from 'bn.js';
export declare class ERC1155Standard {
    private readonly provider;
    constructor(provider: Web3Provider);
    /**
     * Query if contract implements ERC1155 URI Metadata interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements ERC1155 URI Metadata interface.
     */
    contractSupportsURIMetadataInterface(address: string): Promise<boolean>;
    /**
     * Query if contract implements ERC1155 Token Receiver interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements ERC1155 Token Receiver interface.
     */
    contractSupportsTokenReceiverInterface(address: string): Promise<boolean>;
    /**
     * Query if contract implements ERC1155 interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements the base ERC1155 interface.
     */
    contractSupportsBase1155Interface(address: string): Promise<boolean>;
    /**
     * Query for tokenURI for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @param tokenId - ERC1155 asset identifier.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getTokenURI(address: string, tokenId: string): Promise<string>;
    /**
     * Query for balance of a given ERC1155 token.
     *
     * @param contractAddress - ERC1155 asset contract address.
     * @param address - Wallet public address.
     * @param tokenId - ERC1155 asset identifier.
     * @returns Promise resolving to the 'balanceOf'.
     */
    getBalanceOf(contractAddress: string, address: string, tokenId: string): Promise<BN>;
    /**
     * Transfer single ERC1155 token.
     * When minting/creating tokens, the from arg MUST be set to 0x0 (i.e. zero address).
     * When burning/destroying tokens, the to arg MUST be set to 0x0 (i.e. zero address).
     *
     * @param operator - ERC1155 token address.
     * @param from - ERC1155 token holder.
     * @param to - ERC1155 token recipient.
     * @param id - ERC1155 token id.
     * @param value - Number of tokens to be sent.
     * @returns Promise resolving to the 'transferSingle'.
     */
    transferSingle(operator: string, from: string, to: string, id: string, value: string): Promise<void>;
    /**
     * Query for symbol for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to the 'symbol'.
     */
    getAssetSymbol(address: string): Promise<string>;
    /**
     * Query for name for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to the 'name'.
     */
    getAssetName(address: string): Promise<string>;
    /**
     * Query if a contract implements an interface.
     *
     * @param address - ERC1155 asset contract address.
     * @param interfaceId - Interface identifier.
     * @returns Promise resolving to whether the contract implements `interfaceID`.
     */
    private contractSupportsInterface;
    /**
     * Query if a contract implements an interface.
     *
     * @param address - Asset contract address.
     * @param ipfsGateway - The user's preferred IPFS gateway.
     * @param tokenId - tokenId of a given token in the contract.
     * @returns Promise resolving an object containing the standard, tokenURI, symbol and name of the given contract/tokenId pair.
     */
    getDetails(address: string, ipfsGateway: string, tokenId?: string): Promise<{
        standard: string;
        tokenURI: string | undefined;
        image: string | undefined;
        name: string | undefined;
        symbol: string | undefined;
    }>;
}
//# sourceMappingURL=ERC1155Standard.d.ts.map