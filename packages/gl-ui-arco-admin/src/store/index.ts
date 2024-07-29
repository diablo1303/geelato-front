import type {Pinia} from "pinia";
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTenantStore from "./modules/tenant";
import useTabBarStore from './modules/tab-bar';

let pinia: Pinia
const setPinia = (piniaInst: Pinia) => {
  pinia = piniaInst
}

const getPinia = () => {
  return pinia
}

export {useAppStore, useUserStore, useTenantStore, useTabBarStore, setPinia, getPinia};