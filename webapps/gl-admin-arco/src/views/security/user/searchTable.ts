import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'security.user.index.form.index',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: 'security.user.index.form.name',
    dataIndex: 'name',
  },
  {
    title: 'security.user.index.form.sex',
    dataIndex: 'sex',
  },
  {
    title: 'security.user.index.form.mobilePhone',
    dataIndex: 'mobilePhone',
  },
  {
    title: 'security.user.index.form.orgName',
    dataIndex: 'orgName',
  },
  {
    title: 'security.user.index.form.post',
    dataIndex: 'post',
  },
  {
    title: 'security.user.index.form.address',
    dataIndex: 'address',
  },
  {
    title: 'security.user.index.form.type',
    dataIndex: 'type',
  },
  {
    title: 'security.user.index.form.source',
    dataIndex: 'source',
  },
  {
    title: 'security.user.index.form.seqNo',
    dataIndex: 'seqNo',
  },
  {
    title: 'security.user.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'security.user.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

/* 0:female 女;1:male 男 */
const sexOptions = computed<SelectOptionData[]>(() => [
  {
    label: "security.user.index.form.sex.0",
    value: 0,
  },
  {
    label: 'security.user.index.form.sex.1',
    value: 1,
  }
]);
/* 0:员工账号|1:系统账号|2:企业外人员 */
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.user.index.form.type.0',
    value: 0,
  },
  {
    label: 'security.user.index.form.type.1',
    value: 1,
  },
  {
    label: 'security.user.index.form.type.2',
    value: 2,
  }
]);
/* 0:本地用户|1:系统同步 */
const sourceOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'security.user.index.form.source.0',
    value: 0,
  },
  {
    label: 'security.user.index.form.source.1',
    value: 1,
  },
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

export {columns, sexOptions, typeOptions, sourceOptions, enableStatusOptions};