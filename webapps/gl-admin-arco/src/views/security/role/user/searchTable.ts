import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.roleUser.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.roleUser.index.form.userName',
    dataIndex: 'userName'
  },
  {
    title: 'sercurity.roleUser.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'sercurity.roleUser.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.roleUser.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

// eslint-disable-next-line import/prefer-default-export
export {columns};