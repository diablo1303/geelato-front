import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.table.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.table.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'model.table.index.form.tableName',
    dataIndex: 'tableName'
  },
  {
    title: 'model.table.index.form.entityName',
    dataIndex: 'entityName'
  },
  {
    title: 'model.table.index.form.tableType',
    dataIndex: 'tableType'
  },

  {
    title: 'model.table.index.form.tableComment',
    dataIndex: 'tableComment'
  },
  {
    title: 'model.table.index.form.linked',
    dataIndex: 'linked'
  },
  {
    title: 'model.table.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'model.table.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.table.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.table.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const tableTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.table.index.form.tableType.table',
    value: 'table',
    disabled: false
  },
  {
    label: 'model.table.index.form.tableType.entity',
    value: 'entity',
    disabled: true
  },
  {
    label: "model.table.index.form.tableType.view",
    value: 'view',
    disabled: true
  },
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.table.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.table.index.form.enableStatus.0",
    value: 0,
  },
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.table.index.form.linked.1',
    value: 1,
  },
  {
    label: "model.table.index.form.linked.0",
    value: 0,
  },
]);
const sourceTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.table.index.form.sourceType.platform',
    value: 'platform',
  },
  {
    label: 'model.table.index.form.sourceType.system',
    value: 'system',
  },
  {
    label: 'model.table.index.form.sourceType.creation',
    value: 'creation',
  },
]);

export {columns, tableTypeOptions, enableStatusOptions, linkedOptions, sourceTypeOptions};