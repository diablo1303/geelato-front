import {formatModules} from "@/api/user";
import type {RouteRecordNormalized} from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true,
});

const formatExternalModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

// @ts-ignore
export const appRoutes: RouteRecordNormalized[] = await formatModules(modules, []);

export const appExternalRoutes: RouteRecordNormalized[] = formatExternalModules(externalModules, []);
