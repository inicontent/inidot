import { isArrayOfObjects, isNumber } from "inibase/utils";
/**
 * Disallowed keys.
 */
const disallowed: string[] = ["__proto__", "prototype", "constructor"];

/**
 * Converts keys of an object to dot notation recursively.
 *
 * @param object - The input object to convert.
 * @param prefix - The prefix to use for the current level of recursion (default is an empty string).
 * @returns A new object with keys converted to dot notation.
 */
export const toDotNotation = (object: any, prefix?: string): any =>
  Object.keys(object || {}).reduce((acc, key) => {
    const value = object[key];
    const outputKey = prefix ? `${prefix}.${key}` : `${key}`;

    // NOTE: remove `&& (!Array.isArray(value) || value.length)` to exclude empty arrays from the output
    if (
      value &&
      typeof value === "object" &&
      (!Array.isArray(value) || value.length)
    )
      return { ...acc, ...toDotNotation(value, outputKey) };

    return { ...acc, [outputKey]: value };
  }, {});

/**
 * Get object property value.
 *
 * @param obj Object to get value from.
 * @param path Dot notation string.
 * @param value Optional default value to return if path is not found.
 */
export function getProperty(obj: any, path: string, value?: any): any {
  const defaultValue: any = value !== undefined ? value : undefined;

  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  for (const key of parts) {
    if (key === "*") continue;

    if (Array.isArray(obj) && !isNumber(key)) obj = extractArray(obj, key);
    else obj = obj[key];

    if (obj === undefined || obj === null) break;
  }

  return obj === undefined ? defaultValue : obj;
}

/**
 * Set object property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 * @param value Value to set at path.
 */
export function setProperty(obj: any, path: string, value: any): void {
  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  const len: number = parts.length;

  for (let i: number = 0; i < len; i++) {
    const key: string = parts[i];

    // last part in path
    if (i === len - 1) {
      (obj as any)[key] = value;
      return;
    }

    if (key === "*" && Array.isArray(obj)) {
      const remaining: string = parts.slice(i + 1).join(".");

      // recurse to array objects
      for (const item of obj) setProperty(item, remaining, value);

      return;
    }

    if (obj[key] === undefined) obj[key] = {};

    obj = obj[key];
  }
}

/**
 * Check if object has property value.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
export function hasProperty(obj: object, path: string): boolean {
  const value: any = getProperty(obj, path);
  return value !== undefined;
}

/**
 * Delete a property from an object.
 *
 * @param obj Object to set value for.
 * @param path Dot notation string.
 */
export function deleteProperty(obj: any, path: string): void {
  const parts: string[] = getParts(path);

  if (parts.length === 0) return;

  const len: number = parts.length;

  for (let i: number = 0; i < len; i++) {
    const key: string = parts[i];

    if (key === "*") {
      if (isArrayOfObjects(obj))
        obj.forEach((_: any, index: number) => {
          deleteProperty(obj[index], parts.slice(i + 1).join("."));
        });

      continue;
    }

    // last part in path
    if (i === len - 1) {
      if (obj) {
        if (isNumber(key) && Array.isArray(obj)) obj.splice(Number(key), 1);
        else if (typeof obj === "object") delete obj[key];
      }
      return;
    }

    obj = obj[key];
  }
}

/**
 * Get all dot notations paths from an object.
 *
 * @param obj Object to get paths for.
 */
export function paths(obj: object): string[] {
  return _paths(obj, []);
}

/**
 * Split a dot notation string into parts.
 *
 * Examples:
 * - `obj.value` => `['obj', 'value']`
 * - `obj.ary.0.value` => `['obj', 'ary', '0', 'value']`
 * - `obj.ary.0.va\\.lue` => `['obj', 'ary', '0', 'va.lue']`
 * - `obj.ary.*.value` => `['obj', 'ary', '*', 'value']`
 *
 * @param path Dot notation string.
 */
function getParts(path: string): string[] {
  const parts: string[] = path
    .split(/(?<!\\)\./)
    .map((segment) => segment.replace(/\\./g, "."))
    .filter((item) => !!item);

  if (parts.some((x) => disallowed.indexOf(x) !== -1)) return [];

  return parts;
}

/**
 * Internal recursive method to navigate assemble possible paths.
 *
 * @param obj Object to get paths for.
 * @param lead Array of leading parts for the current iteration.
 */
function _paths(obj: any, lead: string[]): string[] {
  let output: string[] = [];

  for (const key in obj) {
    if (obj[key] === undefined) continue;
    else if (
      typeof obj[key] === "object" &&
      Object.prototype.toString.call(obj[key]) === "[object Object]"
    ) {
      // recurse to child object
      lead.push(key);
      output = output.concat(_paths(obj[key], lead));

      // reset path lead for next object
      lead.pop();
    } else {
      const path: string = lead.length ? `${lead.join(".")}.${key}` : key;
      output.push(path);
    }
  }

  return output;
}

const extractArray = (arr: any[], key: string): any => {
  return arr.map((item) => {
    if (item === undefined || item === null) return item as null | undefined;
    else if (Array.isArray(item)) return extractArray(item, key);
    else return item[key];
  });
};

export default class Inidots {
  static toDotNotation = toDotNotation;
  static getProperty = getProperty;
  static setProperty = setProperty;
  static deleteProperty = deleteProperty;
  static hasProperty = hasProperty;
}
