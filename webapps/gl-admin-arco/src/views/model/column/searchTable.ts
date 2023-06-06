import {computed, ref} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
import {querySelectOptions} from "@/api/service/sercurity_service";

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
const nullableOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.nullable.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.nullable.0',
    value: 0,
  },
]);
const numericSignedOptions = computed<SelectOptionData[]>(() => [
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
export {columns, enableStatusOptions, keyOptions, nullableOptions, dataTypeOptions, numericSignedOptions};