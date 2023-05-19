import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.orgUser.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'sercurity.orgUser.index.form.orgName',
    dataIndex: 'orgName'
  },
  {
    title: 'sercurity.orgUser.index.form.userName',
    dataIndex: 'userName'
  },
  {
    title: 'sercurity.orgUser.index.form.defaultOrg',
    dataIndex: 'defaultOrg'
  },
  {
    title: 'sercurity.orgUser.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.orgUser.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const defaultOrgOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.orgUser.index.form.defaultOrg.1',
    value: 1,
  },
  {
    label: "sercurity.orgUser.index.form.defaultOrg.0",
    value: 0,
  },
]);


export {columns, defaultOrgOptions}