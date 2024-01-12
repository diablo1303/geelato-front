import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";

// eslint-disable-next-line import/prefer-default-export
const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.permission.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.permission.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'security.permission.index.form.code',
    dataIndex: 'code'
  },
  {
    title: 'security.permission.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'security.permission.index.form.object',
    dataIndex: 'object'
  },
  {
    title: 'security.permission.index.form.rule',
    dataIndex: 'rule'
  },
  {
    title: 'security.permission.index.form.description',
    dataIndex: 'description'
  },
  {
    title: 'security.permission.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.permission.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.permission.index.form.type.dp',
    value: 'dp',
  },
  {
    label: 'security.permission.index.form.type.ep',
    value: 'ep',
  },
  {
    label: 'security.permission.index.form.type.mp',
    value: 'mp',
  },
  {
    label: 'security.permission.index.form.type.cp',
    value: 'cp',
  },
]);

export {columns, typeOptions}