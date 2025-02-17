import type { JsonRpcParams, JsonRpcRequest } from '@metamask/utils';
export declare type RequestHeaders = Record<string, string>;
export declare type ExtendedJsonRpcRequest<Params extends JsonRpcParams> = JsonRpcRequest<Params> & {
    origin?: string;
};
/**
 * These are networks:
 *
 * 1. for which Infura has released official, production support (see <https://docs.infura.io>)
 * 2. which support the JSON-RPC 2.0 protocol
 */
export declare type InfuraJsonRpcSupportedNetwork = 'mainnet' | 'goerli' | 'sepolia' | 'filecoin' | 'polygon-mainnet' | 'polygon-mumbai' | 'palm-mainnet' | 'palm-testnet' | 'optimism-mainnet' | 'optimism-goerli' | 'arbitrum-mainnet' | 'arbitrum-goerli' | 'aurora-mainnet' | 'aurora-testnet' | 'avalanche-mainnet' | 'avalanche-fuji' | 'celo-mainnet' | 'celo-alfajores' | 'near-mainnet' | 'near-testnet' | 'starknet-mainnet' | 'starknet-goerli' | 'linea-goerli' | 'linea-sepolia' | 'linea-mainnet';
