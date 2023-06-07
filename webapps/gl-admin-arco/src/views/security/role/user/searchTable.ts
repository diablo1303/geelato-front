import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.roleUser.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.roleUser.index.form.userName',
    dataIndex: 'userName'
  },
  {
    title: 'security.roleUser.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'security.roleUser.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.roleUser.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

// eslint-disable-next-line import/prefer-default-export
export {columns};