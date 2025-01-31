"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseController_internalState;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersistentState = exports.getAnonymizedState = exports.BaseController = void 0;
const immer_1 = require("immer");
(0, immer_1.enablePatches)();
/**
 * Controller class that provides state management, subscriptions, and state metadata
 */
class BaseController {
    /**
     * Creates a BaseController instance.
     *
     * @param options - Controller options.
     * @param options.messenger - Controller messaging system.
     * @param options.metadata - ControllerState metadata, describing how to "anonymize" the state, and which
     * parts should be persisted.
     * @param options.name - The name of the controller, used as a namespace for events and actions.
     * @param options.state - Initial controller state.
     */
    constructor({ messenger, metadata, name, state, }) {
        _BaseController_internalState.set(this, void 0);
        this.messagingSystem = messenger;
        this.name = name;
        __classPrivateFieldSet(this, _BaseController_internalState, state, "f");
        this.metadata = metadata;
        this.messagingSystem.registerActionHandler(`${name}:getState`, () => this.state);
        this.messagingSystem.registerInitialEventPayload({
            eventType: `${name}:stateChange`,
            getPayload: () => [this.state, []],
        });
    }
    /**
     * Retrieves current controller state.
     *
     * @returns The current state.
     */
    get state() {
        return __classPrivateFieldGet(this, _BaseController_internalState, "f");
    }
    set state(_) {
        throw new Error(`Controller state cannot be directly mutated; use 'update' method instead.`);
    }
    /**
     * Updates controller state. Accepts a callback that is passed a draft copy
     * of the controller state. If a value is returned, it is set as the new
     * state. Otherwise, any changes made within that callback to the draft are
     * applied to the controller state.
     *
     * @param callback - Callback for updating state, passed a draft state
     * object. Return a new state object or mutate the draft to update state.
     * @returns An object that has the next state, patches applied in the update and inverse patches to
     * rollback the update.
     */
    update(callback) {
        // We run into ts2589, "infinite type depth", if we don't cast
        // produceWithPatches here.
        const [nextState, patches, inversePatches] = immer_1.produceWithPatches(__classPrivateFieldGet(this, _BaseController_internalState, "f"), callback);
        __classPrivateFieldSet(this, _BaseController_internalState, nextState, "f");
        this.messagingSystem.publish(`${this.name}:stateChange`, nextState, patches);
        return { nextState, patches, inversePatches };
    }
    /**
     * Applies immer patches to the current state. The patches come from the
     * update function itself and can either be normal or inverse patches.
     *
     * @param patches - An array of immer patches that are to be applied to make
     * or undo changes.
     */
    applyPatches(patches) {
        const nextState = (0, immer_1.applyPatches)(__classPrivateFieldGet(this, _BaseController_internalState, "f"), patches);
        __classPrivateFieldSet(this, _BaseController_internalState, nextState, "f");
        this.messagingSystem.publish(`${this.name}:stateChange`, nextState, patches);
    }
    /**
     * Prepares the controller for garbage collection. This should be extended
     * by any subclasses to clean up any additional connections or events.
     *
     * The only cleanup performed here is to remove listeners. While technically
     * this is not required to ensure this instance is garbage collected, it at
     * least ensures this instance won't be responsible for preventing the
     * listeners from being garbage collected.
     */
    destroy() {
        this.messagingSystem.clearEventSubscriptions(`${this.name}:stateChange`);
    }
}
exports.BaseController = BaseController;
_BaseController_internalState = new WeakMap();
/**
 * Returns an anonymized representation of the controller state.
 *
 * By "anonymized" we mean that it should not contain any information that could be personally
 * identifiable.
 *
 * @param state - The controller state.
 * @param metadata - The controller state metadata, which describes how to derive the
 * anonymized state.
 * @returns The anonymized controller state.
 */
function getAnonymizedState(state, metadata) {
    return deriveStateFromMetadata(state, metadata, 'anonymous');
}
exports.getAnonymizedState = getAnonymizedState;
/**
 * Returns the subset of state that should be persisted.
 *
 * @param state - The controller state.
 * @param metadata - The controller state metadata, which describes which pieces of state should be persisted.
 * @returns The subset of controller state that should be persisted.
 */
function getPersistentState(state, metadata) {
    return deriveStateFromMetadata(state, metadata, 'persist');
}
exports.getPersistentState = getPersistentState;
/**
 * Use the metadata to derive state according to the given metadata property.
 *
 * @param state - The full controller state.
 * @param metadata - The controller metadata.
 * @param metadataProperty - The metadata property to use to derive state.
 * @returns The metadata-derived controller state.
 */
function deriveStateFromMetadata(state, metadata, metadataProperty) {
    return Object.keys(state).reduce((persistedState, key) => {
        try {
            const stateMetadata = metadata[key];
            if (!stateMetadata) {
                throw new Error(`No metadata found for '${String(key)}'`);
            }
            const propertyMetadata = stateMetadata[metadataProperty];
            const stateProperty = state[key];
            if (typeof propertyMetadata === 'function') {
                persistedState[key] = propertyMetadata(stateProperty);
            }
            else if (propertyMetadata) {
                persistedState[key] = stateProperty;
            }
            return persistedState;
        }
        catch (error) {
            // Throw error after timeout so that it is captured as a console error
            // (and by Sentry) without interrupting state-related operations
            setTimeout(() => {
                throw error;
            });
            return persistedState;
        }
    }, {});
}
//# sourceMappingURL=BaseControllerV2.js.map