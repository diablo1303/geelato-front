import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.dict.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.dict.index.form.dicName',
    dataIndex: 'dicName'
  },
  {
    title: 'sercurity.dict.index.form.dicCode',
    dataIndex: 'dicCode'
  },
  {
    title: 'sercurity.dict.index.form.tenantCode',
    dataIndex: 'tenantCode'
  },
  {
    title: 'sercurity.dict.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'sercurity.dict.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'sercurity.dict.index.form.createAt',
    dataIndex: 'createAt'
  },

  {
    title: 'sercurity.dict.index.form.dicRemark',
    dataIndex: 'dicRemark'
  },
  {
    title: 'sercurity.dict.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.dict.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "sercurity.dict.index.form.enableStatus.0",
    value: 0,
  },
]);

export {columns, enableStatusOptions};