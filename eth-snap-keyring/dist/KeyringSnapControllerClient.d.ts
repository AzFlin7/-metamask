import { KeyringClient } from '@metamask/keyring-api';
import type { SnapController } from '@metamask/snaps-controllers';
import type { SnapId } from '@metamask/snaps-sdk';
import type { HandlerType } from '@metamask/snaps-utils';
/**
 * A `KeyringClient` that allows the communication with a snap through the
 * `SnapController`.
 */
export declare class KeyringSnapControllerClient extends KeyringClient {
    #private;
    /**
     * Create a new instance of `KeyringSnapControllerClient`.
     *
     * The `handlerType` argument has a hard-coded default `string` value instead
     * of a `HandlerType` value to prevent the `@metamask/snaps-utils` module
     * from being required at runtime.
     *
     * @param args - Constructor arguments.
     * @param args.controller - The `SnapController` instance to use.
     * @param args.snapId - The ID of the snap to use (default: `'undefined'`).
     * @param args.origin - The sender's origin (default: `'metamask'`).
     * @param args.handler - The handler type (default: `'onKeyringRequest'`).
     */
    constructor({ controller, snapId, origin, handler, }: {
        controller: SnapController;
        snapId?: SnapId;
        origin?: string;
        handler?: HandlerType;
    });
    /**
     * Create a new instance of `KeyringSnapControllerClient` with the specified
     * `snapId`.
     *
     * @param snapId - The ID of the snap to use in the new instance.
     * @returns A new instance of `KeyringSnapControllerClient` with the
     * specified snap ID.
     */
    withSnapId(snapId: SnapId): KeyringSnapControllerClient;
    /**
     * Get the `SnapController` instance used by this client.
     *
     * @returns The `SnapController` instance used by this client.
     */
    getController(): SnapController;
}
