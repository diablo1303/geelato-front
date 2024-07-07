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

export {
  /* token */
  isLogin, getToken, setToken, clearToken,
  /* 通过 手机、邮箱、密码 进行用户验证 */
  isValidUser, getValidUser, setValidUser, clearValidUser,
  /* 中英文 */
  getArcoLocale, setArcoLocale, getCurrentLocale
};
