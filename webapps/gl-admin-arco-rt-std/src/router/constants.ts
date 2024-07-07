export const URL_PREFIX = import.meta.env.VITE_WEB_PREFIX_URL;

export const WHITE_LIST = [
  {name: 'notFound', children: []},
  {name: 'login', children: []},
];

export const NOT_FOUND = {
  name: 'notFound',
};

export const REDIRECT_ROUTE_NAME = 'Redirect';

export const DEFAULT_ROUTE = {title: '默认页面', name: '', fullPath: '', params: {}};

export const ACCOUNT_ROUTE_PATH = '/account/user';

export const DEFAULT_ROUTE_ACCOUNT = {title: 'model.application.index.menu.list', name: 'userAccount', fullPath: ACCOUNT_ROUTE_PATH, params: {}};