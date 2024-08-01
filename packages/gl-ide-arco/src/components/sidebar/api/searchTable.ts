import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const paramTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'Params', value: 'params', other: '0'},
  {label: "Body", value: 'body', other: '1'},
  {label: 'Headers', value: 'headers', other: '2'},
  {label: "Cookies", value: 'cookies', other: '3'},
]);

const dataTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'String', value: 'string'},
  {label: "Integer", value: 'integer'},
  {label: 'Boolean', value: 'boolean'},
  {label: "Number", value: 'number'},
  {label: 'Array', value: 'array'},
]);
const dataType2Options = computed<SelectOptionData[]>(() => [
  {label: 'String', value: 'string'},
  {label: "Integer", value: 'integer'},
  {label: 'Boolean', value: 'boolean'},
  {label: "Number", value: 'number'},
  {label: 'Array', value: 'array'},
  {label: 'Object', value: 'object'},
  {label: "File", value: 'file'},
]);

const dataTypeBooleanOptions = computed<SelectOptionData[]>(() => [
  {label: 'True', value: 'true',},
  {label: "False", value: 'false',},
]);

export {enableStatusOptions, paramTypeOptions, dataTypeOptions, dataType2Options, dataTypeBooleanOptions};