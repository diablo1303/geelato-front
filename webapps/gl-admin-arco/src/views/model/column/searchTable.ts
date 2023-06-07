import {computed, ref} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {querySelectOptions} from "@/api/service/security_service";
import {RadioOption} from "@arco-design/web-vue/es/radio/interface";
import {queryDefaultMetas} from "@/api/service/model_service";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.column.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.column.index.form.mainTable',
    dataIndex: 'mainTable'
  },
  {
    title: 'model.column.index.form.mainTableCol',
    dataIndex: 'mainTableCol'
  },

  {
    title: 'model.column.index.form.columnTable',
    dataIndex: 'columnTable'
  },
  {
    title: 'model.column.index.form.columnTableCol',
    dataIndex: 'columnTableCol'
  },
  {
    title: 'model.column.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'model.column.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.column.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.column.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.column.index.form.enableStatus.0",
    value: 0,
  },
]);
const keyOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.key.1',
    value: '1',
  },
  {
    label: "model.column.index.form.key.0",
    value: '0',
  },
]);
const nullableOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.nullable.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.nullable.0',
    value: 0,
  },
]);
const numericSignedOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.numericSigned.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.numericSigned.0',
    value: 0,
  },
]);

const dataTypeOptions = ref<SelectOptionData[]>([]);
querySelectOptions("dbColumnDataType").then((data) => {
  dataTypeOptions.value = data;
});
// 主键、、单位、部门、创建时间、创建人员、更新时间、更新人员、是否删除、排序
const defaultColumnMetas = ref<string[]>([]);
queryDefaultMetas().then((data) => {
  defaultColumnMetas.value = data;
});

export {
  columns,
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  dataTypeOptions,
  numericSignedOptions,
  defaultColumnMetas
};