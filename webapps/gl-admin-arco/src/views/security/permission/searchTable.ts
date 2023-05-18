import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

// eslint-disable-next-line import/prefer-default-export
export const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.permission.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.permission.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'sercurity.permission.index.form.text',
    dataIndex: 'text'
  },
  {
    title: 'sercurity.permission.index.form.description',
    dataIndex: 'description'
  },
  {
    title: 'sercurity.permission.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.permission.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);