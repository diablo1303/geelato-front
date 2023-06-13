export default class GenerateUtil {
  /**
   * @param prefix 用于区分gid的类型，如node、div、component
   * @param maxLength 加上prefix和连接符“_”总的gid长度，默认为16
   */
  static gid(prefix?: string, maxLength?: number) {
    if (prefix) {
      return `${prefix}_${GenerateUtil.uuid(
        maxLength || 20 - prefix.length - 1
      )}`;
    }
    return GenerateUtil.uuid(20);
  }

  static uuid(len: number, radix?: number) {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      );
    const uuid = [];
    let i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      // eslint-disable-next-line no-plusplus,no-bitwise
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      let r;
      // rfc4122 requires these characters
      uuid[8] = '-';
      uuid[13] = '-';
      uuid[18] = '-';
      uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          // eslint-disable-next-line no-bitwise
          r = 0 | (Math.random() * 16);
          // eslint-disable-next-line no-bitwise
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
}
