import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const statusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.org.index.form.status.1', value: 1,},
  {label: "security.org.index.form.status.0", value: 0,},
]);

const typeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.org.index.form.type.root', value: 'root',},
  {label: 'security.org.index.form.type.company', value: 'company',},
  {label: 'security.org.index.form.type.department', value: 'department',},
]);

const categoryOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.org.index.form.category.inside', value: 'inside',},
  {label: 'security.org.index.form.category.outside', value: 'outside',},
  {label: 'security.org.index.form.category.virtual', value: 'virtual',},
]);

const defaultOrgOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.orgUser.index.form.defaultOrg.1', value: 1,},
  {label: "security.orgUser.index.form.defaultOrg.0", value: 0,},
]);

export {columns, statusOptions, typeOptions, categoryOptions, defaultOrgOptions};