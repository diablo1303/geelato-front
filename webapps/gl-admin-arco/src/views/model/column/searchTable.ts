import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';
import {RadioOption} from "@arco-design/web-vue/es/radio/interface";

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.column.index.form.enableStatus.1', value: 1,},
  {label: "model.column.index.form.enableStatus.0", value: 0,},
]);

const keyOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.key.1', value: 1,},
  {label: "model.column.index.form.key.0", value: 0,},
]);

const uniquedOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.uniqued.1', value: 1,},
  {label: "model.column.index.form.uniqued.0", value: 0,},
]);

const encryptedOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.encrypted.1', value: 1,},
  {label: "model.column.index.form.encrypted.0", value: 0,},
]);

const nullableOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.nullable.1', value: 1,},
  {label: 'model.column.index.form.nullable.0', value: 0,},
]);

const autoIncrementOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.autoIncrement.1', value: 1,},
  {label: 'model.column.index.form.autoIncrement.0', value: 0,},
]);

const numericSignedOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.numericSigned.1', value: 1,},
  {label: 'model.column.index.form.numericSigned.0', value: 0,},
]);

const markerOptions = computed<RadioOption[]>(() => [
  {label: 'model.column.index.form.marker.id', value: 'id',},
  {label: 'model.column.index.form.marker.title', value: 'title',},
  // {label: 'model.column.index.form.marker.name', value: 'name',},
  // {label: 'model.column.index.form.marker.code', value: 'code',},
  // {label: 'model.column.index.form.marker.type', value: 'type',},
  // {label: 'model.column.index.form.marker.status', value: 'status',},
  {label: 'model.column.index.form.marker.remark', value: 'remark',},
]);

const columnPermissionOptions = computed<SelectOptionData[]>(() => [
  {label: "model.column.permission.columnPermission.0", value: "0",},
  {label: 'model.column.permission.columnPermission.1', value: "1",},
  {label: 'model.column.permission.columnPermission.2', value: "2",},
]);

export {
  columns,
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  uniquedOptions,
  encryptedOptions,
  autoIncrementOptions,
  numericSignedOptions,
  markerOptions,
  columnPermissionOptions,
};