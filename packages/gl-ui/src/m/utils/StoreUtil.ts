export default class StoreUtil {
  /**
   * 基于sessionStorage存储
   * @param key
   * @param json 默认返回{}
   */
  static session(key: string, json: object) {
    if (arguments.length === 2) {
      if (json) {
        sessionStorage.setItem(key, JSON.stringify(json));
      } else {
        sessionStorage.removeItem(key);
      }
    } else if (arguments.length === 1) {
      const value = sessionStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return {};
    } else {
      console.error('参数不正确。');
    }
    return {};
  }
}
