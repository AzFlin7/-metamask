import type { InterfaceState } from '../interface';
/**
 * The request parameters for the `snap_getInterfaceState` method.
 *
 * @property id - The interface id.
 */
export declare type GetInterfaceStateParams = {
    id: string;
};
/**
 * The result returned by the `snap_getInterfaceState` method, which is the state of the interface.
 */
export declare type GetInterfaceStateResult = InterfaceState;
