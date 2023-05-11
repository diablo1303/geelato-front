import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'sercurity.user.index.form.index',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: 'sercurity.user.index.form.name',
    dataIndex: 'name',
  },
  {
    title: 'sercurity.user.index.form.sex',
    dataIndex: 'sex',
  },
  {
    title: 'sercurity.user.index.form.mobilePhone',
    dataIndex: 'mobilePhone',
  },
  {
    title: 'sercurity.user.index.form.orgName',
    dataIndex: 'orgName',
  },
  {
    title: 'sercurity.user.index.form.post',
    dataIndex: 'post',
  },
  {
    title: 'sercurity.user.index.form.address',
    dataIndex: 'address',
  },
  {
    title: 'sercurity.user.index.form.type',
    dataIndex: 'type',
  },
  {
    title: 'sercurity.user.index.form.source',
    dataIndex: 'source',
  },
  {
    title: 'sercurity.user.index.form.seqNo',
    dataIndex: 'seqNo',
  },
  {
    title: 'sercurity.user.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'sercurity.user.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

/* 0:female 女;1:male 男 */
const sexOptions = computed<SelectOptionData[]>(() => [
  {
    label: "sercurity.user.index.form.sex.0",
    value: 0,
  },
  {
    label: 'sercurity.user.index.form.sex.1',
    value: 1,
  }
]);
/* 0:员工账号|1:系统账号|2:企业外人员 */
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.user.index.form.type.0',
    value: 0,
  },
  {
    label: 'sercurity.user.index.form.type.1',
    value: 1,
  },
  {
    label: 'sercurity.user.index.form.type.2',
    value: 2,
  }
]);
/* 0:本地用户|1:系统同步 */
const sourceOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'sercurity.user.index.form.source.0',
    value: 0,
  },
  {
    label: 'sercurity.user.index.form.source.1',
    value: 1,
  },
]);

export {columns, sexOptions, typeOptions, sourceOptions};