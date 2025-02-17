"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventEmitterProxy = void 0;
const filterNoop = () => true;
const internalEvents = ['newListener', 'removeListener'];
const externalEventFilter = (name) => !internalEvents.includes(name);
/**
 * Creates a proxy object that initially points to the given object but whose
 * target can be substituted with another object later using its `setTarget`
 * method. In addition, when the target is changed, event listeners which have
 * been attached to the target will be detached and migrated to the new target.
 * Note that events attached to the eventEmitter (not the proxy) will not be
 * migrated or removed when calling `setTarget`.
 *
 * @template Type - An object that implements at least `eventNames`, `rawListeners`,
 * and `removeAllListeners` from [Node's EventEmitter interface](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/events.d.ts).
 * @param initialTarget - The initial object you want to wrap.
 * @param opts - The options.
 * @param opts.eventFilter - Usually, listeners for all events will be migrated
 * from old targets to new targets, but this function can be used to select
 * which events you want to migrate. If you pass `'skipInternal'`, then
 * `newListener` and `removeListener` will be excluded.
 * @returns The proxy object.
 */
function createEventEmitterProxy(initialTarget, { eventFilter: givenEventFilter = filterNoop, } = {}) {
    // parse options
    const eventFilter = givenEventFilter === 'skipInternal'
        ? externalEventFilter
        : givenEventFilter;
    if (typeof eventFilter !== 'function') {
        throw new Error('createEventEmitterProxy - Invalid eventFilter');
    }
    let eventsAdded = [];
    let target = initialTarget;
    /**
     * Changes the object that the proxy wraps.
     *
     * @param newTarget - The new object.
     */
    let setTarget = (newTarget) => {
        const oldTarget = target;
        target = newTarget;
        // migrate listeners
        eventsAdded.forEach(({ name, handler, addedWith, filtered }) => {
            if (!filtered) {
                newTarget[addedWith](name, handler);
            }
            oldTarget.off(name, handler);
        });
    };
    const removeEvent = (name, handler) => {
        eventsAdded = eventsAdded.filter((addedEvent) => name !== addedEvent.name ||
            (handler !== addedEvent.handler &&
                handler !== addedEvent.unwrappedHandler));
    };
    const proxy = new Proxy(target, {
        // @ts-expect-error We are providing a different signature than the `get`
        // option as defined in the Proxy interface; specifically, we've limited
        // `name` so that it can't be arbitrary. Theoretically this is inaccurate,
        // but because we've constrained what the `target` can be, that effectively
        // constraints the allowed properties as well.
        get(_target, name, receiver) {
            // override `setTarget` access
            if (name === 'setTarget') {
                return setTarget;
            }
            const value = target[name];
            if (typeof value === 'function') {
                return function (...args) {
                    const unwrappedHandler = args[1];
                    if (name === 'once') {
                        const wrappedHandler = (...handlerArgs) => {
                            removeEvent(args[0], wrappedHandler);
                            return unwrappedHandler(...handlerArgs);
                        };
                        args[1] = wrappedHandler;
                    }
                    if (name === 'on' ||
                        name === 'addListener' ||
                        name === 'prependListener' ||
                        name === 'once') {
                        eventsAdded.push({
                            addedWith: name,
                            name: args[0],
                            unwrappedHandler,
                            handler: args[1],
                            filtered: !eventFilter(args[0]),
                        });
                    }
                    else if (name === 'off' || name === 'removeListener') {
                        const eventAdded = eventsAdded.find(({ name: addedName, unwrappedHandler: addedUnwrappedHandler }) => addedName === args[0] && addedUnwrappedHandler === args[1]);
                        // this should never really happen unless you've called removeListener for something that is already not there.
                        if (eventAdded === undefined) {
                            return target;
                        }
                        removeEvent(args[0], args[1]);
                        args[1] = eventAdded.handler;
                    }
                    // This function may be either bound to something or nothing.
                    // eslint-disable-next-line no-invalid-this
                    return value.apply(this === receiver ? target : this, args);
                };
            }
            return value;
        },
        // @ts-expect-error We are providing a different signature than the `set`
        // option as defined in the Proxy interface; specifically, we've limited
        // `name` so that it can't be arbitrary. Theoretically this is inaccurate,
        // but because we've constrained what the `target` can be, that effectively
        // constraints the allowed properties as well.
        set(_target, name, 
        // This setter takes either the `setTarget` function, the value of a a
        // known property of Type, or something else. However, the type of this value
        // depends on the property given, and getting TypeScript to figure this
        // out is seriously difficult. It doesn't ultimately matter, however,
        // as the setter is not visible to consumers.
        value) {
            // allow `setTarget` overrides
            if (name === 'setTarget') {
                setTarget = value;
                return true;
            }
            target[name] = value;
            return true;
        },
    });
    // Typecast: The return type of the Proxy constructor is defined to be the
    // same as the provided type parameter. This is naive, however, as it does not
    // account for the proxy trapping and responding to arbitrary properties; in
    // our case, we trap `setTarget`, so this means our final proxy object
    // contains a property on top of the underlying object's properties.
    return proxy;
}
exports.createEventEmitterProxy = createEventEmitterProxy;
//# sourceMappingURL=createEventEmitterProxy.js.map