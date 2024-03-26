import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

export {enableStatusOptions};