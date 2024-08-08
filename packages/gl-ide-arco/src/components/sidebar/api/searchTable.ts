import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const paramTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'Params', value: 'params'},
  {label: "Body", value: 'body'},
  {label: 'Headers', value: 'headers'},
  {label: "Cookies", value: 'cookies'},
]);

const dataTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'String', value: 'string'},
  {label: "Integer", value: 'integer'},
  {label: 'Boolean', value: 'boolean'},
  {label: "Number", value: 'number'},
  {label: 'Array', value: 'array'},
]);

const dataTypeFormOptions = computed<SelectOptionData[]>(() => [
  {label: 'String', value: 'string'},
  {label: "Integer", value: 'integer'},
  {label: 'Boolean', value: 'boolean'},
  {label: "Number", value: 'number'},
  {label: 'Array', value: 'array'},
  {label: 'File', value: 'file'},
]);

const dataTypeRootOptions = computed<SelectOptionData[]>(() => [
  {label: 'Object', value: 'object'},
  {label: 'Array', value: 'array'},
]);

const dataTypeJsonOptions = computed<SelectOptionData[]>(() => [
  {label: 'String', value: 'string'},
  {label: "Integer", value: 'integer'},
  {label: 'Boolean', value: 'boolean'},
  {label: "Number", value: 'number'},
  {label: 'Array', value: 'array'},
  {label: 'Object', value: 'object'},
  {label: 'Null', value: 'null'},
  {label: 'Any', value: 'any'},
]);

const dataTypeBooleanOptions = computed<SelectOptionData[]>(() => [
  {label: 'True', value: 'true',},
  {label: "False", value: 'false',},
]);

export {enableStatusOptions, paramTypeOptions, dataTypeOptions, dataTypeFormOptions, dataTypeRootOptions, dataTypeJsonOptions, dataTypeBooleanOptions};