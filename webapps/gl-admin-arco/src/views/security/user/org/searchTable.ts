import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.orgUser.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'security.orgUser.index.form.orgName',
    dataIndex: 'orgName'
  },
  {
    title: 'security.orgUser.index.form.userName',
    dataIndex: 'userName'
  },
  {
    title: 'security.orgUser.index.form.defaultOrg',
    dataIndex: 'defaultOrg'
  },
  {
    title: 'security.orgUser.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.orgUser.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const defaultOrgOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.orgUser.index.form.defaultOrg.1',
    value: 1,
  },
  {
    label: "security.orgUser.index.form.defaultOrg.0",
    value: 0,
  },
]);


export {columns, defaultOrgOptions}