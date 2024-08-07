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
const drawedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);
const markerOptions = computed<RadioOption[]>(() => [
  {label: '无', value: '',},
  {label: '主键', value: 'id',},
  {label: '标题', value: 'title',},
  // {label: '名称', value: 'name',},
  // {label: '编码', value: 'code',},
  // {label: '类型', value: 'type',},
  // {label: '状态', value: 'status',},
  {label: '备注', value: 'remark',},
]);
const columnPermissionOptions = computed<SelectOptionData[]>(() => [
  {label: "可编辑", value: "0",},
  {label: '不可编辑', value: "1",},
  {label: '不可查看', value: "2",},
]);

const extraMapOptions = computed<SelectOptionData[]>(() => [
  {label: '一对一', value: "0",},
  {label: '一对多', value: "1",},
  {label: '多对一', value: "2",},
  {label: '多对多', value: "3",},
]);

export {
  enableStatusOptions,
  keyOptions,
  markerOptions,
  nullableOptions,
  uniquedOptions,
  encryptedOptions,
  autoIncrementOptions,
  numericSignedOptions,
  columnPermissionOptions,
  extraMapOptions,
  drawedOptions,
};