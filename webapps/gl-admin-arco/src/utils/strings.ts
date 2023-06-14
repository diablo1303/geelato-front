/**
 * 字符串是为空[null，'']
 * @param s
 * @returns {boolean}
 */
const isEmpty = (s: string): boolean => {
  return s == null || s.length === 0;
}

/**
 * 字符串不为空
 * @param s
 * @returns {boolean}
 */
const isNotEmpty = (s: string): boolean => {
  return !isEmpty(s);
}
/**
 * 字符串是空白的
 * @param s
 */
const isBlank = (s: string): boolean => {
  if (isNotEmpty(s)) {
    const matches = s.match(/\s+/g);
    if (matches && matches.length === s.length) {
      return true;
    }
  }
  return false;
}
/**
 * 字符串不是空白的
 * @param s
 * @returns {boolean}
 */
const isNotBlank = (s: string): boolean => {
  return !isBlank(s);
}

/**
 * 将特定字符串转为驼峰字符串
 * @param s
 */
const toCamelCase = (s: string): string => {
  if (isNotBlank(s) && s.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
    return s.replace(/_([a-zA-Z])/g, (match, c) => c.toUpperCase());
  }
  return '';
}

export {isEmpty, isNotEmpty, isBlank, isNotBlank, toCamelCase};