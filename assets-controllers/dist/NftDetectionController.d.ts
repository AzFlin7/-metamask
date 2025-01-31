import type { BaseConfig, BaseState } from '@metamask/base-controller';
import type { NetworkClientId, NetworkController, NetworkState, NetworkClient } from '@metamask/network-controller';
import { StaticIntervalPollingControllerV1 } from '@metamask/polling-controller';
import type { PreferencesState } from '@metamask/preferences-controller';
import type { Hex } from '@metamask/utils';
import { type NftController, type NftState } from './NftController';
/**
 * @type ApiNft
 *
 * NFT object coming from OpenSea api
 * @property token_id - The NFT identifier
 * @property num_sales - Number of sales
 * @property background_color - The background color to be displayed with the item
 * @property image_url - URI of an image associated with this NFT
 * @property image_preview_url - URI of a smaller image associated with this NFT
 * @property image_thumbnail_url - URI of a thumbnail image associated with this NFT
 * @property image_original_url - URI of the original image associated with this NFT
 * @property animation_url - URI of a animation associated with this NFT
 * @property animation_original_url - URI of the original animation associated with this NFT
 * @property name - The NFT name
 * @property description - The NFT description
 * @property external_link - External link containing additional information
 * @property assetContract - The NFT contract information object
 * @property creator - The NFT owner information object
 * @property lastSale - When this item was last sold
 */
export interface ApiNft {
    token_id: string;
    num_sales: number | null;
    background_color: string | null;
    image_url: string | null;
    image_preview_url: string | null;
    image_thumbnail_url: string | null;
    image_original_url: string | null;
    animation_url: string | null;
    animation_original_url: string | null;
    name: string | null;
    description: string | null;
    external_link: string | null;
    asset_contract: ApiNftContract;
    creator: ApiNftCreator;
    last_sale: ApiNftLastSale | null;
}
/**
 * @type ApiNftContract
 *
 * NFT contract object coming from OpenSea api
 * @property address - Address of the NFT contract
 * @property asset_contract_type - The NFT type, it could be `semi-fungible` or `non-fungible`
 * @property created_date - Creation date
 * @property collection - Object containing the contract name and URI of an image associated
 * @property schema_name - The schema followed by the contract, it could be `ERC721` or `ERC1155`
 * @property symbol - The NFT contract symbol
 * @property total_supply - Total supply of NFTs
 * @property description - The NFT contract description
 * @property external_link - External link containing additional information
 */
export interface ApiNftContract {
    address: string;
    asset_contract_type: string | null;
    created_date: string | null;
    schema_name: string | null;
    symbol: string | null;
    total_supply: string | null;
    description: string | null;
    external_link: string | null;
    collection: {
        name: string | null;
        image_url?: string | null;
    };
}
/**
 * @type ApiNftLastSale
 *
 * NFT sale object coming from OpenSea api
 * @property event_timestamp - Object containing a `username`
 * @property total_price - URI of NFT image associated with this owner
 * @property transaction - Object containing transaction_hash and block_hash
 */
export interface ApiNftLastSale {
    event_timestamp: string;
    total_price: string;
    transaction: {
        transaction_hash: string;
        block_hash: string;
    };
}
/**
 * @type ApiNftCreator
 *
 * NFT creator object coming from OpenSea api
 * @property user - Object containing a `username`
 * @property profile_img_url - URI of NFT image associated with this owner
 * @property address - The owner address
 */
export interface ApiNftCreator {
    user: {
        username: string;
    };
    profile_img_url: string;
    address: string;
}
/**
 * @type NftDetectionConfig
 *
 * NftDetection configuration
 * @property interval - Polling interval used to fetch new token rates
 * @property chainId - Current chain ID
 * @property selectedAddress - Vault selected address
 */
export interface NftDetectionConfig extends BaseConfig {
    interval: number;
    chainId: Hex;
    selectedAddress: string;
}
/**
 * Controller that passively polls on a set interval for NFT auto detection
 */
export declare class NftDetectionController extends StaticIntervalPollingControllerV1<NftDetectionConfig, BaseState> {
    private intervalId?;
    private getOwnerNftApi;
    private getOwnerNfts;
    /**
     * Name of this controller used during composition
     */
    name: string;
    private readonly getOpenSeaApiKey;
    private readonly addNft;
    private readonly getNftApi;
    private readonly getNftState;
    private readonly getNetworkClientById;
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
    constructor({ chainId: initialChainId, getNetworkClientById, onPreferencesStateChange, onNetworkStateChange, getOpenSeaApiKey, addNft, getNftApi, getNftState, }: {
        chainId: Hex;
        getNetworkClientById: NetworkController['getNetworkClientById'];
        onNftsStateChange: (listener: (nftsState: NftState) => void) => void;
        onPreferencesStateChange: (listener: (preferencesState: PreferencesState) => void) => void;
        onNetworkStateChange: (listener: (networkState: NetworkState) => void) => void;
        getOpenSeaApiKey: () => string | undefined;
        addNft: NftController['addNft'];
        getNftApi: NftController['getNftApi'];
        getNftState: () => NftState;
    }, config?: Partial<NftDetectionConfig>, state?: Partial<BaseState>);
    _executePoll(networkClientId: string, options: {
        address: string;
    }): Promise<void>;
    /**
     * Start polling for the currency rate.
     */
    start(): Promise<void>;
    /**
     * Stop polling for the currency rate.
     */
    stop(): void;
    private stopPolling;
    /**
     * Starts a new polling interval.
     *
     * @param interval - An interval on which to poll.
     */
    private startPolling;
    /**
     * Checks whether network is mainnet or not.
     *
     * @returns Whether current network is mainnet.
     */
    isMainnet: () => boolean;
    isMainnetByNetworkClientId: (networkClient: NetworkClient) => boolean;
    /**
     * Triggers asset ERC721 token auto detection on mainnet. Any newly detected NFTs are
     * added.
     *
     * @param options - Options bag.
     * @param options.networkClientId - The network client ID to detect NFTs on.
     * @param options.userAddress - The address to detect NFTs for.
     */
    detectNfts({ networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress: string;
    }): Promise<void>;
}
export default NftDetectionController;
//# sourceMappingURL=NftDetectionController.d.ts.map