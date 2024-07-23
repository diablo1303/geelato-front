import type {Pinia} from "pinia";
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTenantStore from "./modules/tenant";
import useTabBarStore from './modules/tab-bar';

let pinia
const setPinia = (piniaInst: Pinia) => {
  pinia = piniaInst
}

export {useAppStore, useUserStore, useTenantStore, useTabBarStore, setPinia};
export default pinia;