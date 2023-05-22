import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.roleApp.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.roleApp.index.form.appName',
    dataIndex: 'appName'
  },
  {
    title: 'sercurity.roleApp.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'sercurity.roleApp.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.roleApp.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};