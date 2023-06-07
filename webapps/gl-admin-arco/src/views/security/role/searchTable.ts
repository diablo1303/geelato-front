import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.role.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.role.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'security.role.index.form.code',
    dataIndex: 'code'
  },
  {
    title: 'security.role.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'security.role.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'security.role.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.role.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.role.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.role.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.role.index.form.enableStatus.0",
    value: 0,
  },
]);
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.role.index.form.type.app',
    value: 'app',
  },
  {
    label: 'security.role.index.form.type.platform',
    value: 'platform',
  },
]);

export {columns, enableStatusOptions, typeOptions};