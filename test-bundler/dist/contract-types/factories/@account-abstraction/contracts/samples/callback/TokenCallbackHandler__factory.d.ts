import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { TokenCallbackHandler, TokenCallbackHandlerInterface } from "../../../../../@account-abstraction/contracts/samples/callback/TokenCallbackHandler";
type TokenCallbackHandlerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TokenCallbackHandler__factory extends ContractFactory {
    constructor(...args: TokenCallbackHandlerConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TokenCallbackHandler>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TokenCallbackHandler;
    connect(signer: Signer): TokenCallbackHandler__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506104a6806100206000396000f3fe608060405234801561001057600080fd5b50600436106100565760003560e01c806223de291461005b57806301ffc9a714610075578063150b7a021461009d578063bc197c81146100d5578063f23a6e61146100f7575b600080fd5b6100736100693660046101ce565b5050505050505050565b005b610088610083366004610279565b610117565b60405190151581526020015b60405180910390f35b6100bc6100ab3660046102aa565b630a85bd0160e11b95945050505050565b6040516001600160e01b03199091168152602001610094565b6100bc6100e336600461035e565b63bc197c8160e01b98975050505050505050565b6100bc6101053660046103f8565b63f23a6e6160e01b9695505050505050565b60006001600160e01b03198216630a85bd0160e11b148061014857506001600160e01b03198216630271189760e51b145b8061016357506001600160e01b031982166301ffc9a760e01b145b92915050565b80356001600160a01b038116811461018057600080fd5b919050565b60008083601f84011261019757600080fd5b50813567ffffffffffffffff8111156101af57600080fd5b6020830191508360208285010111156101c757600080fd5b9250929050565b60008060008060008060008060c0898b0312156101ea57600080fd5b6101f389610169565b975061020160208a01610169565b965061020f60408a01610169565b955060608901359450608089013567ffffffffffffffff8082111561023357600080fd5b61023f8c838d01610185565b909650945060a08b013591508082111561025857600080fd5b506102658b828c01610185565b999c989b5096995094979396929594505050565b60006020828403121561028b57600080fd5b81356001600160e01b0319811681146102a357600080fd5b9392505050565b6000806000806000608086880312156102c257600080fd5b6102cb86610169565b94506102d960208701610169565b935060408601359250606086013567ffffffffffffffff8111156102fc57600080fd5b61030888828901610185565b969995985093965092949392505050565b60008083601f84011261032b57600080fd5b50813567ffffffffffffffff81111561034357600080fd5b6020830191508360208260051b85010111156101c757600080fd5b60008060008060008060008060a0898b03121561037a57600080fd5b61038389610169565b975061039160208a01610169565b9650604089013567ffffffffffffffff808211156103ae57600080fd5b6103ba8c838d01610319565b909850965060608b01359150808211156103d357600080fd5b6103df8c838d01610319565b909650945060808b013591508082111561025857600080fd5b60008060008060008060a0878903121561041157600080fd5b61041a87610169565b955061042860208801610169565b94506040870135935060608701359250608087013567ffffffffffffffff81111561045257600080fd5b61045e89828a01610185565b979a969950949750929593949250505056fea264697066735822122015109a332660543acb877253007ead9ddc633a906d8cdd82f13d67c6d5f2884164736f6c634300080f0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155BatchReceived";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC721Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "tokensReceived";
        readonly outputs: readonly [];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): TokenCallbackHandlerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TokenCallbackHandler;
}
export {};
