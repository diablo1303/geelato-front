import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

// eslint-disable-next-line import/prefer-default-export
export const columns = computed<TableColumnData[]>(() => [
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
    title: 'security.permission.index.form.text',
    dataIndex: 'text'
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