import {appExternalRoutes, appRoutes} from '../constants';

const mixinRoutes = [...appRoutes.value, ...appExternalRoutes.value];

const appClientMenus: any[] = mixinRoutes.map((el) => {
  const {name, path, meta, redirect, children} = el;
  return {
    name,
    path,
    meta,
    redirect,
    children,
  };
});

export default appClientMenus;