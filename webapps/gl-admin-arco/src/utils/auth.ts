const TOKEN_KEY = 'token';
const VALIDATE_USER = 'validate_user';

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

export {
  /* token */
  isLogin, getToken, setToken, clearToken,
  /* 通过 手机、邮箱、密码 进行用户验证 */
  isValidUser, getValidUser, setValidUser, clearValidUser
};
