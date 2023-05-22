import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.rolePermission.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.rolePermission.index.form.permissionName',
    dataIndex: 'permissionName'
  },
  {
    title: 'sercurity.rolePermission.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'sercurity.rolePermission.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.rolePermission.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};