import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";

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

const fileTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'PDF',
    value: 'application/pdf',
  },
  {
    label: 'WORD[DOC]',
    value: 'application/msword',
  },
  {
    label: 'EXCEL[XLS]',
    value: 'application/vnd.ms-excel',
  },
  {
    label: 'WORD[DOCX]',
    value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    label: 'EXCEL[XLSX]',
    value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
]);

export {columns, fileTypeOptions};