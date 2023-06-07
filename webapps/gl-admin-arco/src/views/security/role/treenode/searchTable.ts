import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.roleTreeNode.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.roleTreeNode.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'security.roleTreeNode.index.form.treeNodeText',
    dataIndex: 'treeNodeText'
  },
  {
    title: 'security.roleTreeNode.index.form.roleName',
    dataIndex: 'roleName'
  },
  {
    title: 'security.roleTreeNode.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.roleTreeNode.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


// eslint-disable-next-line import/prefer-default-export
export {columns};