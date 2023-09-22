import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.dictItem.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.dictItem.index.form.itemName',
    dataIndex: 'itemName'
  },
  {
    title: 'security.dictItem.index.form.itemCode',
    dataIndex: 'itemCode'
  },
  {
    title: 'security.dictItem.index.form.itemRemark',
    dataIndex: 'itemRemark'
  },
  {
    title: 'security.dictItem.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'security.dictItem.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.dictItem.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.dictItem.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.dictItem.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.dictItem.index.form.enableStatus.0",
    value: 0,
  },
]);

export {columns, enableStatusOptions};