import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.roleTreeNode.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.roleTreeNode.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'sercurity.roleTreeNode.index.form.treeNodeText',
    dataIndex: 'treeNodeText'
  },
  {
    title: 'sercurity.roleTreeNode.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'sercurity.roleTreeNode.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.roleTreeNode.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};