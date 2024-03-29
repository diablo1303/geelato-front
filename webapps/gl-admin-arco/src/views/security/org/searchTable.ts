import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.org.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.org.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'security.org.index.form.code',
    dataIndex: 'code'
  },
  {
    title: 'security.org.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'security.org.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'security.org.index.form.status',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: 'security.org.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.org.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.org.index.form.status.1',
    value: 1,
  },
  {
    label: "security.org.index.form.status.0",
    value: 0,
  },
]);
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.org.index.form.type.company',
    value: 'company',
  },
  {
    label: 'security.org.index.form.type.department',
    value: 'department',
  },
]);
const categoryOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.org.index.form.category.inside',
    value: 'inside',
  },
  {
    label: 'security.org.index.form.category.outside',
    value: 'outside',
  },
  {
    label: 'security.org.index.form.category.virtual',
    value: 'virtual',
  },
]);

export {columns, statusOptions, typeOptions, categoryOptions};