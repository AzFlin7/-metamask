"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkVJZI4VSJjs = require('./chunk-VJZI4VSJ.js');


var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/services/node-js/NodeProcessExecutionService.ts
var _postmessagestream = require('@metamask/post-message-stream');
var _child_process = require('child_process');
var NodeProcessExecutionService = class extends _chunkVJZI4VSJjs.AbstractExecutionService {
  async initEnvStream() {
    const worker = _child_process.fork.call(void 0, 
      _chunkEXN2TFDJjs.__require.resolve(
        "@metamask/snaps-execution-environments/dist/browserify/node-process/bundle.js"
      ),
      {
        stdio: "pipe"
      }
    );
    worker.stdout?.on("data", (data) => {
      console.log(data.toString());
    });
    worker.stderr?.on("data", (data) => {
      console.error(data.toString());
    });
    const stream = new (0, _postmessagestream.ProcessParentMessageStream)({ process: worker });
    return Promise.resolve({ worker, stream });
  }
  terminateJob(jobWrapper) {
    jobWrapper.worker.kill();
  }
};



exports.NodeProcessExecutionService = NodeProcessExecutionService;
//# sourceMappingURL=chunk-WFADRL7I.js.map