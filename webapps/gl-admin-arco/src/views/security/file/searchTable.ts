import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.file.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.file.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'security.file.index.form.fileType',
    dataIndex: 'fileType'
  },
  {
    title: 'security.file.index.form.fileCode',
    dataIndex: 'fileCode'
  },
  {
    title: 'security.file.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.file.index.form.createAt',
    dataIndex: 'createAt'
  },

  {
    title: 'security.file.index.form.description',
    dataIndex: 'description'
  },
  {
    title: 'security.file.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.file.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.file.index.form.enableStatus.0",
    value: 0,
  },
]);


const fileTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.file.index.form.fileType.doc',
    value: 'doc',
  },
  {
    label: 'security.file.index.form.fileType.excel',
    value: 'excel',
  }
]);


export {columns, enableStatusOptions, fileTypeOptions};