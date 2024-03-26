import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const viewTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '默认视图', value: 'default',},
  {label: '自定义视图', value: 'custom',},
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {label: '已连接', value: 1,},
  {label: "未连接", value: 0,},
]);

export {viewTypeOptions, enableStatusOptions, linkedOptions};