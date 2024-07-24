const TOKEN_KEY = 'token';
const VALIDATE_USER = 'validate_user';
const ARCO_LOCALE = 'arco-locale';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const isValidUser = () => {
  return !!localStorage.getItem(VALIDATE_USER);
};

const getValidUser = () => {
  return localStorage.getItem(VALIDATE_USER);
};

const setValidUser = (value: string) => {
  localStorage.setItem(VALIDATE_USER, value);
};

const clearValidUser = () => {
  localStorage.removeItem(VALIDATE_USER);
};

const getArcoLocale = () => {
  return localStorage.getItem(ARCO_LOCALE) || 'zh-CN';
}

const setArcoLocale = (value: string) => {
  localStorage.setItem(ARCO_LOCALE, value);
}

const getCurrentLocale = () => {
  return getArcoLocale() === 'en-US' ? 'en' : 'cn';
}

type TargetContext = '_self' | '_parent' | '_blank' | '_top';

const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any }
) => {
  const {target = '_blank', ...others} = opts || {};
  window.open(
    url,
    target,
    // @ts-ignore
    Object.entries(others)
      .reduce((preValue: string[], curValue: [any, any]) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(',')
  );
};

const regexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
);

export {
  /* token */
  isLogin, getToken, setToken, clearToken,
  /* 通过 手机、邮箱、密码 进行用户验证 */
  isValidUser, getValidUser, setValidUser, clearValidUser,
  /* 中英文 */
  getArcoLocale, setArcoLocale, getCurrentLocale,
  /* 打开新窗口 */
  openWindow,
  /* 验证 url */
  regexUrl
};
