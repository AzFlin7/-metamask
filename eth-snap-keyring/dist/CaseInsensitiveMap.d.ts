/**
 * A case-insensitive map that stores key-value pairs.
 */
export declare class CaseInsensitiveMap<Value> extends Map<string, Value> {
    /**
     * Create a new case-insensitive map from a plain object.
     *
     * @param obj - An object with entries to initialize the map with.
     * @returns A new case-insensitive map with all entries from `obj`.
     */
    static fromObject<Value>(obj: Record<string, Value>): CaseInsensitiveMap<Value>;
    /**
     * Return a plain object with all entries from this map.
     *
     * @returns A plain object with all entries from this map.
     */
    toObject(): Record<string, Value>;
    /**
     * Return the value associated to the given key, or `undefined` if the key is
     * not found.
     *
     * @param key - The key to get the value for.
     * @returns The value associated to the given key, or `undefined` if the key
     * is not found.
     */
    get(key: string): Value | undefined;
    /**
     * Return the value associated with the given key, or throw an error if the
     * key is not found.
     *
     * @param key - The key to look up in the map.
     * @param name - Optional name of the key to include in the error message.
     * @returns The value associated with the given key.
     */
    getOrThrow(key: string, name?: string): Value;
    /**
     * Check whether the given key is present in the map.
     *
     * @param key - The key to check for.
     * @returns `true` if the key is present in the map, `false` otherwise.
     */
    has(key: string): boolean;
    /**
     * Set the value for the given key. If the key already exists in the map, its
     * value will be updated.
     *
     * The key is converted to lowercase before being stored in the map to ensure
     * case-insensitivity.
     *
     * @param key - The key to set the value for.
     * @param value - The value to set.
     * @returns The map instance.
     */
    set(key: string, value: Value): this;
    /**
     * Delete the entry for the given key.
     *
     * @param key - The key to delete the entry for.
     * @returns `true` if the entry was present in the map, `false` otherwise.
     */
    delete(key: string): boolean;
}
