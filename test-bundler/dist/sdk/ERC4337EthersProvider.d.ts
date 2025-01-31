import type { EntryPoint, UserOperationStruct } from '@account-abstraction/contracts';
import type { Network } from '@ethersproject/networks';
import type { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { BaseProvider } from '@ethersproject/providers';
import type { Signer } from 'ethers';
import type { BaseAccountAPI } from './BaseAccountAPI';
import type { ClientConfig } from './ClientConfig';
import { ERC4337EthersSigner } from './ERC4337EthersSigner';
import type { HttpRpcClient } from './HttpRpcClient';
export declare class ERC4337EthersProvider extends BaseProvider {
    readonly chainId: number;
    readonly config: ClientConfig;
    readonly originalSigner: Signer;
    readonly originalProvider: BaseProvider;
    readonly httpRpcClient: HttpRpcClient;
    readonly entryPoint: EntryPoint;
    readonly smartAccountAPI: BaseAccountAPI;
    initializedBlockNumber: number;
    readonly signer: ERC4337EthersSigner;
    constructor(chainId: number, config: ClientConfig, originalSigner: Signer, originalProvider: BaseProvider, httpRpcClient: HttpRpcClient, entryPoint: EntryPoint, smartAccountAPI: BaseAccountAPI);
    /**
     * finish intializing the provider.
     * MUST be called after construction, before using the provider.
     */
    init(): Promise<this>;
    getSigner(): ERC4337EthersSigner;
    perform(method: string, params: any): Promise<any>;
    getTransaction(transactionHash: string | Promise<string>): Promise<TransactionResponse>;
    getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt>;
    getSenderAccountAddress(): Promise<string>;
    waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>;
    constructUserOpTransactionResponse(userOp1: UserOperationStruct): Promise<TransactionResponse>;
    detectNetwork(): Promise<Network>;
}
