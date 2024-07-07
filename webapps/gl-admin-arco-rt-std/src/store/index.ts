import {createPinia} from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTenantStore from "./modules/tenant";
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();

export {useAppStore, useUserStore, useTabBarStore, useTenantStore};
export default pinia;
