import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.encoding.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.encoding.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'security.encoding.index.form.example',
    dataIndex: 'example'
  },
  {
    title: 'security.encoding.index.form.latestSerialNumber',
    dataIndex: 'latestSerialNumber'
  },
  {
    title: 'security.encoding.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.encoding.index.form.createAt',
    dataIndex: 'createAt'
  },

  {
    title: 'security.encoding.index.form.description',
    dataIndex: 'description'
  },
  {
    title: 'security.encoding.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.encoding.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.encoding.index.form.enableStatus.0",
    value: 0,
  },
]);

const itemTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.encoding.index.form.itemType.constant',
    value: 'constant',
  },
  {
    label: 'security.encoding.index.form.itemType.serial',
    value: 'serial',
  },
  {
    label: 'security.encoding.index.form.itemType.date',
    value: 'date',
  },
]);

const serialTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.encoding.index.form.serialType.order',
    value: 'order',
  },
  {
    label: 'security.encoding.index.form.serialType.random',
    value: 'random',
  }
]);
const separatorsOptions = computed<SelectOptionData[]>(() => [
  {label: 'AB', value: '',}, {label: 'A.B', value: '.',}, {label: 'A·B', value: '·',}, {label: 'A-B', value: '-',},
  {label: 'A_B', value: '_',}
]);

const dateTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'yy', value: 'yy'}, {label: 'yyMM', value: 'yyMM'}, {label: 'yyMMdd', value: 'yyMMdd'},
  {label: 'yyyy', value: 'yyyy'}, {label: 'yyyyMM', value: 'yyyyMM'}, {label: 'yyyyMMdd', value: 'yyyyMMdd'}
]);

export {columns, enableStatusOptions, itemTypeOptions, serialTypeOptions, dateTypeOptions, separatorsOptions};