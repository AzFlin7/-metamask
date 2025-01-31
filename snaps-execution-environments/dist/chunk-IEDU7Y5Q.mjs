import {
  BaseSnapExecutor
} from "./chunk-DTUHBZ7B.mjs";
import {
  log
} from "./chunk-5DEV3QQU.mjs";

// src/webworker/executor/WebWorkerSnapExecutor.ts
import ObjectMultiplex from "@metamask/object-multiplex";
import { WebWorkerPostMessageStream } from "@metamask/post-message-stream";
import { logError, SNAP_STREAM_NAMES } from "@metamask/snaps-utils";
import { pipeline } from "readable-stream";
var WebWorkerSnapExecutor = class _WebWorkerSnapExecutor extends BaseSnapExecutor {
  /**
   * Initialize the WebWorkerSnapExecutor. This creates a post message stream
   * from and to the parent window, for two-way communication with the iframe.
   *
   * @param stream - The stream to use for communication.
   * @returns An instance of `WebWorkerSnapExecutor`, with the initialized post
   * message streams.
   */
  static initialize(stream = new WebWorkerPostMessageStream()) {
    log("Worker: Connecting to parent.");
    const mux = new ObjectMultiplex();
    pipeline(stream, mux, stream, (error) => {
      if (error) {
        logError(`Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(SNAP_STREAM_NAMES.JSON_RPC);
    return new _WebWorkerSnapExecutor(commandStream, rpcStream);
  }
};

export {
  WebWorkerSnapExecutor
};
//# sourceMappingURL=chunk-IEDU7Y5Q.mjs.map