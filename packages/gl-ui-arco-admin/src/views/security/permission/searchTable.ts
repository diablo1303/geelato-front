import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const columns = computed<TableColumnData[]>(() => []);

const typeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.permission.index.form.type.dp', value: 'dp',},
  {label: 'security.permission.index.form.type.ep', value: 'ep',},
  {label: 'security.permission.index.form.type.mp', value: 'mp',},
  {label: 'security.permission.index.form.type.cp', value: 'cp',},
]);

const ruleOptions = computed<SelectOptionData[]>(() => [
  {label: '当前用户ID', value: '#currentUser.userId#',},
  {label: '当前部门ID', value: '#currentUser.deptId#',},
  {label: '当前组织ID', value: '#currentUser.buId#',},
  {label: '当前合作单位ID', value: '#currentUser.cooperatingOrgId#',},
]);

export {columns, typeOptions, ruleOptions}