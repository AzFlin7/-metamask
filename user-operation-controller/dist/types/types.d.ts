import type { TransactionParams, TransactionType, UserFeeLevel } from '@metamask/transaction-controller';
/**
 * A complete user operation to be submitted to a bundler.
 * Defined in EIP-4337.
 */
export declare type UserOperation = {
    /** The data to pass to the sender during the main execution call. */
    callData: string;
    /** The amount of gas to allocate the main execution call. */
    callGasLimit: string;
    /**
     * The initCode of the account.
     * Needed if and only if the account is not yet on-chain and needs to be created.
     */
    initCode: string;
    /**
     * Maximum fee per gas.
     * Similar to EIP-1559 max_fee_per_gas.
     */
    maxFeePerGas: string;
    /**
     * Maximum priority fee per gas.
     * Similar to EIP-1559 max_priority_fee_per_gas.
     */
    maxPriorityFeePerGas: string;
    /** Anti-replay parameter. */
    nonce: string;
    /**
     * Address of paymaster sponsoring the transaction, followed by extra data to send to the paymaster.
     * Empty for self-sponsored transactions.
     */
    paymasterAndData: string;
    /** The amount of gas to pay to compensate the bundler for pre-verification execution, calldata and any gas overhead that cannot be tracked on-chain. */
    preVerificationGas: string;
    /** The account making the operation. */
    sender: string;
    /** Data passed into the account along with the nonce during the verification step. */
    signature: string;
    /** The amount of gas to allocate for the verification step. */
    verificationGasLimit: string;
};
/**
 * The possible statuses of a single user operation.
 */
export declare enum UserOperationStatus {
    Unapproved = "unapproved",
    Approved = "approved",
    Signed = "signed",
    Submitted = "submitted",
    Failed = "failed",
    Confirmed = "confirmed"
}
/** Information concerning an error while creating a user operation. */
export declare type UserOperationError = {
    /**
     * A descriptive error name.
     */
    name: string;
    /**
     * A descriptive error message providing details about the encountered error.
     */
    message: string;
    /**
     * The stack trace associated with the error, if available.
     */
    stack: string | null;
    /**
     * An optional error code associated with the error.
     */
    code: string | null;
    /**
     * Additional information related to the error.
     */
    rpc: string | null;
};
/**
 * Metadata concerning a single user operation, stored in the client state.
 */
export declare type UserOperationMetadata = {
    /** Confirmed total cost of the gas for the user operation. */
    actualGasCost: string | null;
    /** Confirmed total amount of gas used by the user operation. */
    actualGasUsed: string | null;
    /** Base fee of the transaction block as a hex value. */
    baseFeePerGas: string | null;
    /** URL of the bundler that the operation was submitted to. */
    bundlerUrl: string | null;
    /** Hexadecimal chain ID of the target network. */
    chainId: string;
    /** An error that occurred while creating the operation. */
    error: UserOperationError | null;
    /** Hash of the user operation, generated by the bundler. */
    hash: string | null;
    /** A unique ID used to identify a user operation in the client. */
    id: string;
    /** The origin of the user operation, such as the hostname of a dApp. */
    origin: string;
    /** Current status of the user operation. */
    status: UserOperationStatus;
    /** Metadata specific to swap transactions. */
    swapsMetadata: SwapsMetadata | null;
    /** Timestamp of when the user operation was created. */
    time: number;
    /** Hash of the transaction that submitted the user operation to the entrypoint. */
    transactionHash: string | null;
    /** The initial transaction parameters that the user operation was created from. */
    transactionParams: Required<TransactionParams> | null;
    /** The type of transaction that the user operation will create. */
    transactionType: TransactionType | null;
    /** The origin of the gas fee values. */
    userFeeLevel: UserFeeLevel | null;
    /** Resulting user operation object to be submitted to the bundler. */
    userOperation: UserOperation;
};
/**
 * The data provided to the smart contract account when preparing a user operation.
 */
export declare type PrepareUserOperationRequest = {
    /** The hexadecimal chain ID of the target network. */
    chainId: string;
    /** The data to include in the resulting transaction.  */
    data?: string;
    /** Address of the account requesting the user operation. */
    from: string;
    /** The destination address of the resulting transaction. */
    to?: string;
    /** The value to send in the resulting transaction. */
    value?: string;
};
/**
 * The data provided to the smart contract account when updating a user operation.
 */
export declare type UpdateUserOperationRequest = {
    /** The user operation to update including the dummy signature and dummy paymasterAndData values. */
    userOperation: UserOperation;
};
/**
 * The data provided to the smart contract account when signing a user operation.
 */
export declare type SignUserOperationRequest = {
    /** The user operation to sign including the dummy signature and final paymasterAndData values. */
    userOperation: UserOperation;
    /** The hexadecimal chain ID of the target network. */
    chainId: string;
};
/**
 * The data returned by the smart contract account when preparing a user operation.
 */
export declare type PrepareUserOperationResponse = {
    /** The URL of the bundler to submit the user operation to. */
    bundler: string;
    /** The data to pass to the sender during the main execution call. */
    callData: string;
    /**
     * A dummy paymasterAndData value required to estimate gas using the bundler.
     * Only required if the smart contract account is not providing gas values.
     */
    dummyPaymasterAndData?: string;
    /**
     * A dummy signature value required to estimate gas using the bundler.
     * Only required if the smart contract account is not providing gas values.
     */
    dummySignature?: string;
    /**
     * The estimated gas limits for the user operation.
     * Gas is automatically estimated using the bundler if not provided.
     */
    gas?: {
        /** The amount of gas to allocate to the main execution call. */
        callGasLimit: string;
        /** The amount of gas to pay to compensate the bundler for pre-verification execution, calldata and any gas overhead that cannot be tracked on-chain. */
        preVerificationGas: string;
        /** The amount of gas to allocate for the verification step. */
        verificationGasLimit: string;
    };
    /**
     * The initCode to include in the user operation.
     * Required only if the smart contract is not yet deployed.
     */
    initCode?: string;
    /**
     * The nonce to include in the user operation, specific to the smart contract account.
     */
    nonce: string;
    /**
     * The address of the smart contract account creating the user operation.
     */
    sender: string;
};
/**
 * The data returned by the smart contract account when updating a user operation.
 */
export declare type UpdateUserOperationResponse = {
    /**
     * The final paymasterAndData to include in the user operation.
     * Not required if a paymaster is not sponsoring the transaction.
     */
    paymasterAndData?: string;
};
/**
 * The data returned by the smart contract account when signing a user operation.
 */
export declare type SignUserOperationResponse = {
    /** The final signature of the user operation. */
    signature: string;
};
/**
 * An abstraction to provide smart contract and paymaster specific data when creating a user operation.
 * This will typically communicate with an account snap installed in the client.
 */
export declare type SmartContractAccount = {
    /**
     * Retrieve the initial values required to create a user operation.
     * @param request - The data needed by the smart contract account to provide the initial user operation values.
     * @returns The initial values required to create a user operation.
     */
    prepareUserOperation: (request: PrepareUserOperationRequest) => Promise<PrepareUserOperationResponse>;
    /**
     * Retrieve additional data required to create a user operation, such as the paymasterAndData value.
     * If gas values were not provided in the prepare response, this will be called after estimating gas using the bundler.
     * @param request - The data needed by the smart contract account to provide the additional user operation values.
     * @returns The additional values required to create a user operation.
     */
    updateUserOperation: (request: UpdateUserOperationRequest) => Promise<UpdateUserOperationResponse>;
    /**
     * Sign the final user operation.
     * @param request - The data needed by the smart contract account to generate the signature.
     * @returns The final values required to sign a user operation.
     */
    signUserOperation: (request: SignUserOperationRequest) => Promise<SignUserOperationResponse>;
};
/**
 * Response from the `eth_getUserOperationReceipt` bundler method.
 * Includes the status of a completed user operation and the receipt of the transaction that submitted it.
 */
export declare type UserOperationReceipt = {
    /** Confirmed total cost of the gas for the user operation. */
    actualGasCost: string;
    /** Confirmed total amount of gas used by the user operation. */
    actualGasUsed: string;
    /** True if the user operation was successfully confirmed on chain. */
    success: boolean;
    /** Receipt for the associated transaction. */
    receipt: {
        /** Hash of the block the transaction was added to. */
        blockHash: string;
        /** Hash of the confirmed transaction. */
        transactionHash: string;
    };
};
/** Information specific to user operations created from swap transactions. */
export declare type SwapsMetadata = {
    /** ID of the associated approval transaction. */
    approvalTxId: string | null;
    /** Address of the destination token. */
    destinationTokenAddress: string | null;
    /** Number of decimals of the destination token. */
    destinationTokenDecimals: number | null;
    /** Symbol of the destination token. */
    destinationTokenSymbol: string | null;
    /** Estimated base fee of the swap. */
    estimatedBaseFee: string | null;
    /** Symbol of the source token. */
    sourceTokenSymbol: string | null;
    /** Untyped raw metadata values. */
    swapMetaData: Record<string, never> | null;
    /** Value of the token being swapped. */
    swapTokenValue: string | null;
};
//# sourceMappingURL=types.d.ts.map