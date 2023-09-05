import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'export.file.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'export.file.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'export.file.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'export.file.index.form.size',
    dataIndex: 'size'
  },
  {
    title: 'export.file.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'export.file.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

// eslint-disable-next-line import/prefer-default-export
export {columns};