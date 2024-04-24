import {computed} from 'vue';
import type {CascaderOption, SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.encoding.index.form.enableStatus.1', value: 1,},
  {label: "security.encoding.index.form.enableStatus.0", value: 0,},
]);

const itemTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.encoding.index.form.itemType.constant', value: 'constant',},
  {label: 'security.encoding.index.form.itemType.serial', value: 'serial',},
  {label: 'security.encoding.index.form.itemType.date', value: 'date',},
]);

const serialTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.encoding.index.form.serialType.order', value: 'order',},
  {label: 'security.encoding.index.form.serialType.random', value: 'random',}
]);
const separatorsOptions = computed<SelectOptionData[]>(() => [
  {label: 'AB', value: '',},
  {label: 'A.B', value: '.',},
  {label: 'A·B', value: '·',},
  {label: 'A-B', value: '-',},
  {label: 'A_B', value: '_',}
]);

const dateTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'yy', value: 'yy'},
  {label: 'yyMM', value: 'yyMM'},
  {label: 'yyMMdd', value: 'yyMMdd'},
  {label: 'yyyy', value: 'yyyy'},
  {label: 'yyyyMM', value: 'yyyyMM'},
  {label: 'yyyyMMdd', value: 'yyyyMMdd'}
]);

const variableTypeOptions = computed<CascaderOption[]>(() => [
  {
    label: 'security.encoding.index.form.itemType.variable.tenant', value: 'tenant', children: [
      {label: 'security.encoding.index.form.itemType.variable.tenant.id', value: 'tenant.id', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.tenant.code', value: 'tenant.code', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.tenant.name', value: 'tenant.name', disabled: false},
    ], disabled: false
  },
  {
    label: 'security.encoding.index.form.itemType.variable.app', value: 'app', children: [
      {label: 'security.encoding.index.form.itemType.variable.app.id', value: 'app.id', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.app.code', value: 'app.code', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.app.name', value: 'app.name', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.app.versionInfo', value: 'app.versionInfo', disabled: false},
    ], disabled: false
  },
  {
    label: 'security.encoding.index.form.itemType.variable.user', value: 'user', children: [
      {label: 'security.encoding.index.form.itemType.variable.user.id', value: 'user.id', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.name', value: 'user.name', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.enName', value: 'user.enName', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.loginName', value: 'user.loginName', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.jobNumber', value: 'user.jobNumber', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.mobilePhone', value: 'user.mobilePhone', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.email', value: 'user.email', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.orgId', value: 'user.orgId', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.orgName', value: 'user.orgName', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.companyId', value: 'user.companyId', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.companyName', value: 'user.companyName', disabled: false},
      {label: 'security.encoding.index.form.itemType.variable.user.cooperatingOrgId', value: 'user.cooperatingOrgId', disabled: false},
    ], disabled: false
  },
]);

export {columns, enableStatusOptions, itemTypeOptions, serialTypeOptions, dateTypeOptions, variableTypeOptions, separatorsOptions};