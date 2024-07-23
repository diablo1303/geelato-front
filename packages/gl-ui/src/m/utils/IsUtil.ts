export class IsUtil {
  opt = Object.prototype.toString;

  constructor() {
  }

  isArray(obj: any): obj is any[] {
    return this.opt.call(obj) === '[object Array]';
  }


  isObject(obj: any): obj is { [key: string]: any } {
    return this.opt.call(obj) === '[object Object]';
  }


  isString(obj: any): obj is string {
    return this.opt.call(obj) === '[object String]';
  }


  isNumber(obj: any): obj is number {
    return this.opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
  }


  isRegExp(obj: any) {
    return this.opt.call(obj) === '[object RegExp]';
  }


  isFile(obj: any): obj is File {
    return this.opt.call(obj) === '[object File]';
  }


  isBlob(obj: any): obj is Blob {
    return this.opt.call(obj) === '[object Blob]';
  }


  isUndefined(obj: any): obj is undefined {
    return obj === undefined;
  }


  isNull(obj: any): obj is null {
    return obj === null;
  }


  is(obj: any): obj is (...args: any[]) => any {
    // @ts-ignore
    return typeof obj === '';
  }


  isEmptyObject(obj: any): boolean {
    return this.isObject(obj) && Object.keys(obj).length === 0;
  }


  isExist(obj: any): boolean {
    return obj || obj === 0;
  }


  isWindow(el: any): el is Window {
    return el === window;
  }

  /**
   * 字符串是为空[null，'']
   * @param s
   * @returns {boolean}
   */
  isEmpty(s: string) {
    return s == null || s.length === 0;
  }

  /**
   * 字符串不为空
   * @param s
   * @returns {boolean}
   */
  isNotEmpty(s: string) {
    return !this.isEmpty(s);
  }

  /**
   * 字符串是空白的
   * @param s
   */
  isBlank(s: string) {
    if (this.isNotEmpty(s)) {
      return s.trim().length === 0;
    }
    return true;
  }

  /**
   * 字符串不是空白的
   * @param s
   * @returns {boolean}
   */
  isNotBlank(s: string) {
    return !this.isBlank(s);
  }

  /**
   * 字符串是否是json字符串
   * @param val
   */
  isJSON(val: string) {
    let isJ = false
    try {
      if (typeof val === 'string' && val) {
        const obj = JSON.parse(val)
        if (typeof obj === 'object' && obj) {
          isJ = true
        }
      }
    } catch (e) {
      isJ = false
    }
    return isJ
  }
}

const isUtil = new IsUtil()
export default isUtil