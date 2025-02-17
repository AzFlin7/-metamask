// src/misc.ts
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
var hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
function getKnownPropertyNames(object) {
  return Object.getOwnPropertyNames(object);
}
var JsonSize = /* @__PURE__ */ ((JsonSize2) => {
  JsonSize2[JsonSize2["Null"] = 4] = "Null";
  JsonSize2[JsonSize2["Comma"] = 1] = "Comma";
  JsonSize2[JsonSize2["Wrapper"] = 1] = "Wrapper";
  JsonSize2[JsonSize2["True"] = 4] = "True";
  JsonSize2[JsonSize2["False"] = 5] = "False";
  JsonSize2[JsonSize2["Quote"] = 1] = "Quote";
  JsonSize2[JsonSize2["Colon"] = 1] = "Colon";
  JsonSize2[JsonSize2["Date"] = 24] = "Date";
  return JsonSize2;
})(JsonSize || {});
var ESCAPE_CHARACTERS_REGEXP = /"|\\|\n|\r|\t/gu;
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  try {
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
  } catch (_) {
    return false;
  }
}
function isASCII(character) {
  return character.charCodeAt(0) <= 127;
}
function calculateStringSize(value) {
  const size = value.split("").reduce((total, character) => {
    if (isASCII(character)) {
      return total + 1;
    }
    return total + 2;
  }, 0);
  return size + (value.match(ESCAPE_CHARACTERS_REGEXP) ?? []).length;
}
function calculateNumberSize(value) {
  return value.toString().length;
}

export {
  isNonEmptyArray,
  isNullOrUndefined,
  isObject,
  hasProperty,
  getKnownPropertyNames,
  JsonSize,
  ESCAPE_CHARACTERS_REGEXP,
  isPlainObject,
  isASCII,
  calculateStringSize,
  calculateNumberSize
};
//# sourceMappingURL=chunk-H4YFDLB7.mjs.map