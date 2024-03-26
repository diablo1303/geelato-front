import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue';


const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);
const typeOptions = computed<SelectOptionData[]>(() => [
  {label: '应用级角色', value: 'app',},
  {label: '平台级角色', value: 'platform',},
]);

export {enableStatusOptions, typeOptions};