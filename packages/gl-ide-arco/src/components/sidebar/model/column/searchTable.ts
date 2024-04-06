import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";
import type {RadioOption} from "@arco-design/web-vue/es/radio/interface";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const keyOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const uniquedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const encryptedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const nullableOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);
const autoIncrementOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);
const numericSignedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const columnPermissionOptions = computed<SelectOptionData[]>(() => [
  {label: "可编辑", value: "0",},
  {label: '不可编辑', value: "1",},
  {label: '不可查看', value: "2",},
]);

export {
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  uniquedOptions,
  encryptedOptions,
  autoIncrementOptions,
  numericSignedOptions,
  columnPermissionOptions
};