export const URL_PREFIX = import.meta.env.VITE_WEB_PREFIX_URL;

export const WHITE_LIST = [
  {name: 'notFound', children: []},
  {name: 'login', children: []},
];

export const NOT_FOUND = {
  name: 'notFound',
};

export const REDIRECT_ROUTE_NAME = 'Redirect';

export const DEFAULT_ROUTE = {title: 'model.dataBase.index.menu.list', name: 'appList', fullPath: `/dev/appList`, params: {}};

export const ACCOUNT_ROUTE_PATH = '/account/user';