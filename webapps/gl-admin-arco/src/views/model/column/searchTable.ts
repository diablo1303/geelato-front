import {computed, ref} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";
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

const dataTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.dataType.BIT',
    value: 'BIT',
  },
  {
    label: 'model.column.index.form.dataType.VARCHAR',
    value: 'VARCHAR',
  },
  {
    label: 'model.column.index.form.dataType.TEXT',
    value: 'TEXT',
  },
  {
    label: 'model.column.index.form.dataType.LONGTEXT',
    value: 'LONGTEXT',
  },
  {
    label: 'model.column.index.form.dataType.TINYINT',
    value: 'TINYINT',
  },
  {
    label: 'model.column.index.form.dataType.INT',
    value: 'INT',
  },
  {
    label: 'model.column.index.form.dataType.BIGINT',
    value: 'BIGINT',
  },
  {
    label: 'model.column.index.form.dataType.DECIMAL',
    value: 'DECIMAL',
  },

  {
    label: 'model.column.index.form.dataType.YEAR',
    value: 'YEAR',
  },
  {
    label: 'model.column.index.form.dataType.DATE',
    value: 'DATE',
  },
  {
    label: 'model.column.index.form.dataType.TIME',
    value: 'TIME',
  },
  {
    label: 'model.column.index.form.dataType.DATETIME',
    value: 'DATETIME',
  },
  {
    label: 'model.column.index.form.dataType.TIMESTAMP',
    value: 'TIMESTAMP',
  },
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
    value: 1,
  },
  {
    label: "model.column.index.form.key.0",
    value: 0,
  },
]);

const uniquedOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.uniqued.1',
    value: 1,
  },
  {
    label: "model.column.index.form.uniqued.0",
    value: 0,
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
const autoIncrementOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.autoIncrement.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.autoIncrement.0',
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
  uniquedOptions,
  autoIncrementOptions,
  dataTypeOptions,
  numericSignedOptions,
  defaultColumnMetas
};