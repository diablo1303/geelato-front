import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.dictItem.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.dictItem.index.form.itemText',
    dataIndex: 'itemText'
  },
  {
    title: 'sercurity.dictItem.index.form.itemCode',
    dataIndex: 'itemCode'
  },
  {
    title: 'sercurity.dictItem.index.form.dataRemark',
    dataIndex: 'dataRemark'
  },
  {
    title: 'sercurity.dictItem.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'sercurity.dictItem.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'sercurity.dictItem.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.dictItem.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.dictItem.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "sercurity.dictItem.index.form.enableStatus.0",
    value: 0,
  },
]);

export {columns, enableStatusOptions};