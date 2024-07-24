import isUtil from './IsUtil'

export class StringUtil {
  constructor() {
  }

  /**
   * 将特定字符串转为驼峰字符串
   * @param s
   */
  toCamelCase(s: string) {
    if (isUtil.isNotBlank(s) && s.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
      return s.replace(/_([a-zA-Z])/g, (match, c) => c.toUpperCase());
    }
    return '';
  }

  /**
   * 去除字符串中的 se，如‘ zhang he   wang ’ to ‘[zhang,he,wang]’
   * @param s1 字符串
   * @param s2 分隔符
   */
  formatSeparator(s1: string, s2: string) {
    const cs = isUtil.isBlank(s1) ? '' : s1;
    const csArr: string[] = [];
    const sArr = cs.trim().split(s2);
    for (let i = 0; i < sArr.length; i += 1) {
      if (isUtil.isNotBlank(sArr[i])) {
        csArr.push(sArr[i]);
      }
    }

    return csArr;
  }

  /**
   * 日期格式化
   * @param date
   * @param format
   */
  formatTime(date: Date, format?: string) {
    const year = date.getFullYear();
    // @ts-ignore
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // @ts-ignore
    const day = date.getDate().toString().padStart(2, '0');
    // @ts-ignore
    const hours = date.getHours().toString().padStart(2, '0');
    // @ts-ignore
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // @ts-ignore
    const seconds = date.getSeconds().toString().padStart(2, '0');
    if (format) {
      return format.replace('yyyy', String(year)).replace('yy', String(year).substring(2, 4))
        .replace('MM', month).replace('dd', day).replace('HH', hours)
        .replace('mm', minutes).replace('ss', seconds);
    }
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * 特殊字符串缩略处理
   * @param value
   * @param type 1: 电话，2：邮箱
   */
  abbreviateValue(value: string, type: string) {
    if (value) {
      if (type === '1') {
        value = `${value.substring(0, 3)}******${value.substring(value.length - 3)}`
      } else if (type === '2') {
        value = `${value.substring(0, 3)}****${value.substring(value.lastIndexOf('@'))}`;
      }
    }
    return value;
  }
}

const stringUtil = new StringUtil()
export default stringUtil