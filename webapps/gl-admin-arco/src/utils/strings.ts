import {Message} from "@arco-design/web-vue";

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

const buildUrl = (url: string, params: any): string => {
  params = params || {};
  let rootUrl = "";
  const urlParams = {};
  if (url) {
    const qIndex = url.indexOf('?');
    if (qIndex !== -1) {
      rootUrl = url.substring(0, qIndex);
      const u1 = url.substring(qIndex + 1).split("&");
      for (let i = 0; i < u1.length; i += 1) {
        const u2 = u1[i].split("=");
        // @ts-ignore
        urlParams[u2[0]] = u2[1] === 'null' ? '' : u2[1];
      }
    } else {
      rootUrl = url.endsWith("/") ? url.substring(0, url.length - 1) : url;
    }
  }
  params = Object.assign(urlParams, params);
  const paramArr = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in params) {
    if (params[key] && params[key].trim() && params[key] !== 'null') {
      paramArr.push(`${key}=${params[key]}`);
    }
  }
  url = paramArr.length > 0 ? `${rootUrl}?${paramArr.join("&")}` : rootUrl;

  return url;
}

/**
 * 复制
 * @param value
 */
const textareaCopy = (value: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * Clipboard Api
 * @param value
 */
const copyToClipboard = async (value: string, successMsg?: string, failMsg?: string) => {
  try {
    await navigator.clipboard.writeText(value);
    if (successMsg) Message.success({content: successMsg, duration: 3 * 1000});
  } catch (err) {
    console.log(err);
    if (failMsg) Message.error({content: failMsg, duration: 3 * 1000});
  }
}

export {isEmpty, isNotEmpty, isBlank, isNotBlank, toCamelCase, formatSeparator, buildUrl, copyToClipboard};