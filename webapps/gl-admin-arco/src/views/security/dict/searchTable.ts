import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.dict.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.dict.index.form.dictName',
    dataIndex: 'dictName'
  },
  {
    title: 'security.dict.index.form.dictCode',
    dataIndex: 'dictCode'
  },
  {
    title: 'security.dict.index.form.tenantCode',
    dataIndex: 'tenantCode'
  },
  {
    title: 'security.dict.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'security.dict.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.dict.index.form.createAt',
    dataIndex: 'createAt'
  },

  {
    title: 'security.dict.index.form.dictRemark',
    dataIndex: 'dictRemark'
  },
  {
    title: 'security.dict.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.dict.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.dict.index.form.enableStatus.0",
    value: 0,
  },
]);

export {columns, enableStatusOptions};