import {Message} from "@arco-design/web-vue";
import {isBlank, isNotBlank} from '@/utils/is';

/**
 * 将特定字符串转为驼峰字符串
 * @param s
 */
const toCamelCase = (s: string): string => {
  if (isNotBlank(s) && s.match(/^[a-zA-Z0-9][a-zA-Z0-9_]*$/)) {
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

/**
 * 生成随机数
 * @param extent
 * @constructor
 */
const generateRandom = function (extent?: number) {
  extent = extent && extent > 0 ? extent : 32;
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < extent; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/**
 * 日期格式化
 * @param date
 * @param format
 */
const formatTime = function (date: Date, format?: string) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  if (format) {
    return format.replace('yyyy', String(year)).replace('yy', String(year).substring(2, 4))
      .replace('MM', month).replace('dd', day).replace('HH', hours)
      .replace('mm', minutes).replace('ss', seconds);
  }
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export {toCamelCase, formatSeparator, buildUrl, copyToClipboard, generateRandom, formatTime};