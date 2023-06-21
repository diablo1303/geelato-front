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
    return s.trim().length === 0;
  }
  return true;
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

/**
 * 去除字符串中的 se，如‘ zhang he   wang ’ to ‘[zhang,he,wang]’
 * @param s1 字符串
 * @param s2 分隔符
 */
const formatSeparator = (s1: string, s2: string): string[] => {
  const cs = isBlank(s1) ? '' : s1;
  const csArr: string[] = [];
  const sArr = cs.trim().split(s2);
  for (let i = 0; i < sArr.length; i += 1) {
    if (isNotBlank(sArr[i])) {
      csArr.push(sArr[i]);
    }
  }

  return csArr;
}

export {isEmpty, isNotEmpty, isBlank, isNotBlank, toCamelCase, formatSeparator};