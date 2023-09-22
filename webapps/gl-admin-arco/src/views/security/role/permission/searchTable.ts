import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.rolePermission.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.rolePermission.index.form.permissionName',
    dataIndex: 'permissionName'
  },
  {
    title: 'security.rolePermission.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'security.rolePermission.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.rolePermission.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};