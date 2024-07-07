const opt = Object.prototype.toString;

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === '[object Array]';
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return opt.call(obj) === '[object Object]';
}

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]';
}

export function isNumber(obj: any): obj is number {
  return opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
}

export function isRegExp(obj: any) {
  return opt.call(obj) === '[object RegExp]';
}

export function isFile(obj: any): obj is File {
  return opt.call(obj) === '[object File]';
}

export function isBlob(obj: any): obj is Blob {
  return opt.call(obj) === '[object Blob]';
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === 'function';
}

export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0;
}

export function isExist(obj: any): boolean {
  return obj || obj === 0;
}

export function isWindow(el: any): el is Window {
  return el === window;
}

/**
 * 字符串是为空[null，'']
 * @param s
 * @returns {boolean}
 */
export function isEmpty(s: string) {
  return s == null || s.length === 0;
}

/**
 * 字符串不为空
 * @param s
 * @returns {boolean}
 */
export function isNotEmpty(s: string) {
  return !isEmpty(s);
}

/**
 * 字符串是空白的
 * @param s
 */
export function isBlank(s: string) {
  if (isNotEmpty(s)) {
    return s.trim().length === 0;
  }
  return true;
}

/**
 * 字符串不是空白的
 * @param s
 * @returns {boolean}
 */
export function isNotBlank(s: string) {
  return !isBlank(s);
}

export function isJSON(val: string) {
  let isJ = false;
  try {
    if (typeof val === 'string' && val) {
      const obj = JSON.parse(val);
      if (typeof obj === 'object' && obj) {
        isJ = true;
      }
    }
  } catch (e) {
    isJ = false;
  }
  return isJ;
}