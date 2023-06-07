import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.roleApp.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.roleApp.index.form.appName',
    dataIndex: 'appName'
  },
  {
    title: 'security.roleApp.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'security.roleApp.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.roleApp.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};