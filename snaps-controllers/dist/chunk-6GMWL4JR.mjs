// src/snaps/location/http.ts
import {
  VirtualFile,
  HttpSnapIdStruct,
  NpmSnapFileNames,
  createSnapManifest,
  normalizeRelative,
  parseJson
} from "@metamask/snaps-utils";
import { assert, assertStruct } from "@metamask/utils";
var HttpLocation = class {
  constructor(url, opts = {}) {
    // We keep contents separate because then we can use only one Blob in cache,
    // which we convert to Uint8Array when actually returning the file.
    //
    // That avoids deepCloning file contents.
    // I imagine ArrayBuffers are copy-on-write optimized, meaning
    // in most often case we'll only have one file contents in common case.
    this.cache = /* @__PURE__ */ new Map();
    assertStruct(url.toString(), HttpSnapIdStruct, "Invalid Snap Id: ");
    this.fetchFn = opts.fetch ?? globalThis.fetch.bind(globalThis);
    this.fetchOptions = opts.fetchOptions;
    this.url = url;
  }
  async manifest() {
    if (this.validatedManifest) {
      return this.validatedManifest.clone();
    }
    const canonicalPath = new URL(
      NpmSnapFileNames.Manifest,
      this.url
    ).toString();
    const response = await this.fetchFn(canonicalPath, this.fetchOptions);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch "${canonicalPath}". Status code: ${response.status}.`
      );
    }
    const contents = await response.text();
    const manifest = parseJson(contents);
    const vfile = new VirtualFile({
      value: contents,
      result: createSnapManifest(manifest),
      path: NpmSnapFileNames.Manifest,
      data: { canonicalPath }
    });
    this.validatedManifest = vfile;
    return this.manifest();
  }
  async fetch(path) {
    const relativePath = normalizeRelative(path);
    const cached = this.cache.get(relativePath);
    if (cached !== void 0) {
      const { file, contents } = cached;
      const value = new Uint8Array(await contents.arrayBuffer());
      const vfile2 = file.clone();
      vfile2.value = value;
      return vfile2;
    }
    const canonicalPath = this.toCanonical(relativePath).toString();
    const response = await this.fetchFn(canonicalPath, this.fetchOptions);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch "${canonicalPath}". Status code: ${response.status}.`
      );
    }
    const vfile = new VirtualFile({
      value: "",
      path: relativePath,
      data: { canonicalPath }
    });
    const blob = await response.blob();
    assert(
      !this.cache.has(relativePath),
      "Corrupted cache, multiple files with same path."
    );
    this.cache.set(relativePath, { file: vfile, contents: blob });
    return this.fetch(relativePath);
  }
  get root() {
    return new URL(this.url);
  }
  toCanonical(path) {
    assert(!path.startsWith("/"), "Tried to parse absolute path.");
    return new URL(path, this.url);
  }
};

export {
  HttpLocation
};
//# sourceMappingURL=chunk-6GMWL4JR.mjs.map