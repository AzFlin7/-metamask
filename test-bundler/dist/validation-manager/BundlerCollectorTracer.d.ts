import type { LogTracer } from './GethTracer';
/**
 * return type of our BundlerCollectorTracer.
 * collect access and opcodes, split into "levels" based on NUMBER opcode
 * keccak, calls and logs are collected globally, since the levels are unimportant for them.
 */
export type BundlerTracerResult = {
    /**
     * storage and opcode info, collected on top-level calls from EntryPoint
     */
    callsFromEntryPoint: TopLevelCallInfo[];
    /**
     * values passed into KECCAK opcode
     */
    keccak: string[];
    calls: (ExitInfo | MethodInfo)[];
    logs: LogInfo[];
    debug: any[];
};
export type MethodInfo = {
    type: string;
    from: string;
    to: string;
    method: string;
    value: any;
    gas: number;
};
export type ExitInfo = {
    type: 'REVERT' | 'RETURN';
    gasUsed: number;
    data: string;
};
export type TopLevelCallInfo = {
    topLevelMethodSig: string;
    topLevelTargetAddress: string;
    opcodes: {
        [opcode: string]: number;
    };
    access: {
        [address: string]: AccessInfo;
    };
    contractSize: {
        [addr: string]: ContractSizeInfo;
    };
    extCodeAccessInfo: {
        [addr: string]: string;
    };
    oog?: boolean;
};
/**
 * It is illegal to access contracts with no code in validation even if it gets deployed later.
 * This means we need to store the {@link contractSize} of accessed addresses at the time of access.
 */
export type ContractSizeInfo = {
    opcode: string;
    contractSize: number;
};
export type AccessInfo = {
    reads: {
        [slot: string]: string;
    };
    writes: {
        [slot: string]: number;
    };
};
export type LogInfo = {
    topics: string[];
    data: string;
};
type RelevantStepData = {
    opcode: string;
    stackTop3: any[];
};
/**
 * type-safe local storage of our collector. contains all return-value properties.
 * (also defines all "trace-local" variables and functions)
 */
type BundlerCollectorTracer = {
    lastOp: string;
    lastThreeOpcodes: RelevantStepData[];
    stopCollectingTopic: string;
    stopCollecting: boolean;
    currentLevel: TopLevelCallInfo;
    topLevelCallCounter: number;
    countSlot: (list: {
        [key: string]: number | undefined;
    }, key: any) => void;
} & LogTracer & BundlerTracerResult;
/**
 * tracer to collect data for opcode banning.
 * this method is passed as the "tracer" for eth_traceCall (note, the function itself)
 *
 * returned data:
 *  numberLevels: opcodes and memory access, split on execution of "number" opcode.
 *  keccak: input data of keccak opcode.
 *  calls: for each call, an array of [type, from, to, value]
 *  slots: accessed slots (on any address)
 */
export declare function bundlerCollectorTracer(): BundlerCollectorTracer;
export {};
