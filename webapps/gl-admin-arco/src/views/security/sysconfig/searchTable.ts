import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.sysConfig.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.sysConfig.index.form.configKey',
    dataIndex: 'configKey'
  },
  {
    title: 'security.sysConfig.index.form.configValue',
    dataIndex: 'configValue'
  },
  {
    title: 'security.sysConfig.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'security.sysConfig.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.sysConfig.index.form.remark',
    dataIndex: 'remark'
  },
  {
    title: 'security.sysConfig.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.sysConfig.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "security.sysConfig.index.form.enableStatus.0",
    value: 0,
  },
]);


export {columns, enableStatusOptions};