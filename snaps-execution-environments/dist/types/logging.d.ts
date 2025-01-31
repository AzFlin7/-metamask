/// <reference types="debug" />
/**
 * A logging function specific to this package. The log messages don't show up
 * by default, but they can be enabled by setting the environment variable:
 * - `DEBUG=metamask:snaps:snaps-execution-environments`, or
 * - `DEBUG=metamask:snaps:*` to enable all logs from `@metamask/snaps-*`.
 */
export declare const log: import("debug").Debugger;
