import type { SnapId } from '@metamask/snaps-sdk';
import type { SnapLocation } from './snaps';
import { Timer } from './snaps/Timer';
/**
 * Takes two objects and does a Set Difference of them.
 * Set Difference is generally defined as follows:
 * ```
 * 𝑥 ∈ A ∖ B ⟺ 𝑥 ∈ A ∧ 𝑥 ∉ B
 * ```
 * Meaning that the returned object contains all properties of A expect those that also
 * appear in B. Notice that properties that appear in B, but not in A, have no effect.
 *
 * @see [Set Difference]{@link https://proofwiki.org/wiki/Definition:Set_Difference}
 * @param objectA - The object on which the difference is being calculated.
 * @param objectB - The object whose properties will be removed from objectA.
 * @returns The objectA without properties from objectB.
 */
export declare function setDiff<ObjectA extends Record<any, unknown>, ObjectB extends Record<any, unknown>>(objectA: ObjectA, objectB: ObjectB): Diff<ObjectA, ObjectB>;
/**
 * A Promise that delays its return for a given amount of milliseconds.
 *
 * @param ms - Milliseconds to delay the execution for.
 * @param result - The result to return from the Promise after delay.
 * @returns A promise that is void if no result provided, result otherwise.
 * @template Result - The `result`.
 */
export declare function delay<Result = void>(ms: number, result?: Result): Promise<Result> & {
    cancel: () => void;
};
/**
 * A Promise that delays it's return by using a pausable Timer.
 *
 * @param timer - Timer used to control the delay.
 * @param result - The result to return from the Promise after delay.
 * @returns A promise that is void if no result provided, result otherwise.
 * @template Result - The `result`.
 */
export declare function delayWithTimer<Result = void>(timer: Timer, result?: Result): Promise<Result> & {
    cancel: () => void;
};
export declare const hasTimedOut: unique symbol;
/**
 * Executes the given Promise, if the Timer expires before the Promise settles, we return earlier.
 *
 * NOTE:** The given Promise is not cancelled or interrupted, and will continue to execute uninterrupted. We will just discard its result if it does not complete before the timeout.
 *
 * @param promise - The promise that you want to execute.
 * @param timerOrMs - The timer controlling the timeout or a ms value.
 * @returns The resolved `PromiseValue`, or the hasTimedOut symbol if
 * returning early.
 * @template PromiseValue - The value of the Promise.
 */
export declare function withTimeout<PromiseValue = void>(promise: Promise<PromiseValue>, timerOrMs: Timer | number): Promise<PromiseValue | typeof hasTimedOut>;
/**
 * Checks whether the type is composed of literal types
 *
 * @returns @type {true} if whole type is composed of literals, @type {false} if whole type is not literals, @type {boolean} if mixed
 * @example
 * ```
 * type t1 = IsLiteral<1 | 2 | "asd" | true>;
 * // t1 = true
 *
 * type t2 = IsLiteral<number | string>;
 * // t2 = false
 *
 * type t3 = IsLiteral<1 | string>;
 * // t3 = boolean
 *
 * const s = Symbol();
 * type t4 = IsLiteral<typeof s>;
 * // t4 = true
 *
 * type t5 = IsLiteral<symbol>
 * // t5 = false;
 * ```
 */
declare type IsLiteral<Type> = Type extends string | number | boolean | symbol ? Extract<string | number | boolean | symbol, Type> extends never ? true : false : false;
/**
 * Returns all keys of an object, that are literal, as an union
 *
 * @example
 * ```
 * type t1 = _LiteralKeys<{a: number, b: 0, c: 'foo', d: string}>
 * // t1 = 'b' | 'c'
 * ```
 * @see [Literal types]{@link https://www.typescriptlang.org/docs/handbook/literal-types.html}
 */
declare type LiteralKeys<Type> = NonNullable<{
    [Key in keyof Type]: IsLiteral<Key> extends true ? Key : never;
}[keyof Type]>;
/**
 * Returns all keys of an object, that are not literal, as an union
 *
 * @example
 * ```
 * type t1 = _NonLiteralKeys<{a: number, b: 0, c: 'foo', d: string}>
 * // t1 = 'a' | 'd'
 * ```
 * @see [Literal types]{@link https://www.typescriptlang.org/docs/handbook/literal-types.html}
 */
declare type NonLiteralKeys<Type> = NonNullable<{
    [Key in keyof Type]: IsLiteral<Key> extends false ? Key : never;
}[keyof Type]>;
/**
 * A set difference of two objects based on their keys
 *
 * @example
 * ```
 * type t1 = Diff<{a: string, b: string}, {a: number}>
 * // t1 = {b: string};
 * type t2 = Diff<{a: string, 0: string}, Record<string, unknown>>;
 * // t2 = { a?: string, 0: string};
 * type t3 = Diff<{a: string, 0: string, 1: string}, Record<1 | string, unknown>>;
 * // t3 = {a?: string, 0: string}
 * ```
 * @see {@link setDiff} for the main use-case
 */
export declare type Diff<First, Second> = Omit<First, LiteralKeys<Second>> & Partial<Pick<First, Extract<keyof First, NonLiteralKeys<Second>>>>;
/**
 * Makes every specified property of the specified object type mutable.
 *
 * @template Type - The object whose readonly properties to make mutable.
 * @template TargetKey - The property key(s) to make mutable.
 */
export declare type Mutable<Type extends Record<string, unknown>, TargetKey extends string> = {
    -readonly [Key in keyof Pick<Type, TargetKey>]: Type[Key];
} & {
    [Key in keyof Omit<Type, TargetKey>]: Type[Key];
};
/**
 * Get all files in a Snap from an array of file paths.
 *
 * @param location - The location of the Snap.
 * @param files - The array of file paths.
 * @returns The array of files as {@link VirtualFile}s.
 */
export declare function getSnapFiles(location: SnapLocation, files?: string[] | undefined): Promise<import("@metamask/snaps-utils").VirtualFile<unknown>[]>;
/**
 * Fetch the Snap manifest, source code, and any other files from the given
 * location.
 *
 * @param snapId - The ID of the Snap to fetch.
 * @param location - The location of the Snap.
 * @returns The Snap files and location.
 * @throws If the Snap files are invalid, or if the Snap could not be fetched.
 */
export declare function fetchSnap(snapId: SnapId, location: SnapLocation): Promise<{
    manifest: import("@metamask/snaps-utils").VirtualFile<{
        description: string;
        version: import("@metamask/utils").SemVerVersion;
        source: {
            location: {
                npm: {
                    registry: "https://registry.npmjs.org" | "https://registry.npmjs.org/";
                    filePath: string;
                    packageName: string;
                    iconPath?: string | undefined;
                };
            };
            shasum: string;
            files?: string[] | undefined;
            locales?: string[] | undefined;
        };
        proposedName: string;
        initialPermissions: {
            snap_dialog?: {} | undefined;
            snap_getBip32Entropy?: {
                path: string[];
                curve: "ed25519" | "secp256k1";
            }[] | undefined;
            snap_getBip32PublicKey?: {
                path: string[];
                curve: "ed25519" | "secp256k1";
            }[] | undefined;
            snap_getBip44Entropy?: {
                coinType: number;
            }[] | undefined;
            snap_getEntropy?: {} | undefined;
            snap_getLocale?: {} | undefined;
            snap_manageAccounts?: {} | undefined;
            snap_manageState?: {} | undefined;
            snap_notify?: {} | undefined;
            wallet_snap?: Record<string, {
                version?: string | undefined;
            }> | undefined;
            'endowment:cronjob'?: {
                jobs: {
                    request: {
                        method: string;
                        id?: string | number | null | undefined;
                        jsonrpc?: "2.0" | undefined;
                        params?: Record<string, import("@metamask/snaps-sdk").Json> | import("@metamask/snaps-sdk").Json[] | undefined;
                    };
                    expression: string;
                }[];
                maxRequestTime?: number | undefined;
            } | undefined;
            'endowment:ethereum-provider'?: {} | undefined;
            'endowment:keyring'?: {
                allowedOrigins?: string[] | undefined;
                maxRequestTime?: number | undefined;
            } | undefined;
            'endowment:lifecycle-hooks'?: {
                maxRequestTime?: number | undefined;
            } | undefined;
            'endowment:name-lookup'?: {
                chains?: `${string}:${string}`[] | undefined;
                maxRequestTime?: number | undefined;
                matchers?: {
                    tlds: string[];
                } | {
                    schemes: string[];
                } | {
                    tlds: string[];
                    schemes: string[];
                } | undefined;
            } | undefined;
            'endowment:network-access'?: {} | undefined;
            'endowment:page-home'?: {
                maxRequestTime?: number | undefined;
            } | undefined;
            'endowment:rpc'?: {
                snaps?: boolean | undefined;
                dapps?: boolean | undefined;
                allowedOrigins?: string[] | undefined;
            } | undefined;
            'endowment:signature-insight'?: {
                maxRequestTime?: number | undefined;
                allowSignatureOrigin?: boolean | undefined;
            } | undefined;
            'endowment:transaction-insight'?: {
                maxRequestTime?: number | undefined;
                allowTransactionOrigin?: boolean | undefined;
            } | undefined;
            'endowment:webassembly'?: {} | undefined;
        };
        manifestVersion: "0.1";
        repository?: {
            type: string;
            url: string;
        } | undefined;
        initialConnections?: Record<string & URL, {}> | undefined;
        $schema?: string | undefined;
    }>;
    sourceCode: import("@metamask/snaps-utils").VirtualFile<unknown>;
    svgIcon: import("@metamask/snaps-utils").VirtualFile<unknown> | undefined;
    auxiliaryFiles: import("@metamask/snaps-utils").VirtualFile<unknown>[];
    localizationFiles: import("@metamask/snaps-utils").VirtualFile<{
        locale: string;
        messages: Record<string, {
            message: string;
            description?: string | undefined;
        }>;
    }>[];
}>;
export {};
