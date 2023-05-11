import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.org.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.org.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'sercurity.org.index.form.code',
    dataIndex: 'code'
  },
  {
    title: 'sercurity.org.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'sercurity.org.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'sercurity.org.index.form.status',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: 'sercurity.org.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.org.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.org.index.form.status.1',
    value: 1,
  },
  {
    label: "sercurity.org.index.form.status.0",
    value: 0,
  },
]);
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.org.index.form.type.inside',
    value: 'inside',
  },
  {
    label: 'sercurity.org.index.form.type.outside',
    value: 'outside',
  },
]);

export {columns, statusOptions, typeOptions};