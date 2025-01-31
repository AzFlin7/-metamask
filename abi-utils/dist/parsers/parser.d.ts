export declare type DynamicFunction = (type: string) => boolean;
export declare type EncodeArgs<Value> = {
    /**
     * The bytes to encode the value in.
     */
    buffer: Uint8Array;
    /**
     * The type of the value to encode.
     */
    type: string;
    /**
     * The value to encode.
     */
    value: Value;
    /**
     * Whether to use the non-standard packed mode.
     */
    packed: boolean;
    /**
     * Whether to use tight packing mode. Only applicable when `packed` is true.
     */
    tight: boolean;
};
export declare type DecodeArgs = {
    /**
     * The type of the value to decode.
     */
    type: string;
    /**
     * The value to decode.
     */
    value: Uint8Array;
    /**
     * A function to skip a certain number of bytes for parsing. This is currently only used by static tuple types.
     *
     * @param length - The number of bytes to skip.
     */
    skip(length: number): void;
};
export declare type Parser<EncodeValue = unknown, DecodeValue = EncodeValue> = {
    isDynamic: boolean | DynamicFunction;
    isType(type: string): boolean;
    getByteLength(type: string): number;
    encode(value: EncodeArgs<EncodeValue>): Uint8Array;
    decode(args: DecodeArgs): DecodeValue;
};
