import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";
import {querySelectOptions} from "@/api/security";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.connect.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.connect.index.form.dbConnectName',
    dataIndex: 'dbConnectName'
  },
  {
    title: 'model.connect.index.form.dbSchema',
    dataIndex: 'dbSchema'
  },
  {
    title: 'model.connect.index.form.dbType',
    dataIndex: 'dbType'
  },
  {
    title: 'model.connect.index.form.dbName',
    dataIndex: 'dbName'
  },

  {
    title: 'model.connect.index.form.dbHostnameIp',
    dataIndex: 'dbHostnameIp'
  },
  {
    title: 'model.connect.index.form.dbPort',
    dataIndex: 'dbPort'
  },
  {
    title: 'model.connect.index.form.dbUserName',
    dataIndex: 'dbUserName'
  },
  {
    title: 'model.connect.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.connect.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.connect.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);


const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.connect.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.connect.index.form.enableStatus.0",
    value: 0,
  },
]);

// eslint-disable-next-line import/no-mutable-exports
let dbTypeOptions = computed<SelectOptionData[]>(() => []);
querySelectOptions("dbType").then((data) => {
  dbTypeOptions = computed<SelectOptionData[]>(() => data);
});

export {columns, dbTypeOptions, enableStatusOptions};