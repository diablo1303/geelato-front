import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.foreign.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.foreign.index.form.mainTable',
    dataIndex: 'mainTable'
  },
  {
    title: 'model.foreign.index.form.mainTableCol',
    dataIndex: 'mainTableCol'
  },

  {
    title: 'model.foreign.index.form.foreignTable',
    dataIndex: 'foreignTable'
  },
  {
    title: 'model.foreign.index.form.foreignTableCol',
    dataIndex: 'foreignTableCol'
  },
  {
    title: 'model.foreign.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'model.foreign.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.foreign.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.foreign.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.foreign.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.foreign.index.form.enableStatus.0",
    value: 0,
  },
]);

export {columns, enableStatusOptions};