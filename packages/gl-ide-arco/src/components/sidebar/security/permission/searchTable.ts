import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const typeOptions = computed<SelectOptionData[]>(() => [
  {label: '数据权限', value: 'dp',},
  {label: '页面元素权限', value: 'ep',},
  {label: '实体模型权限', value: 'mp',},
  {label: '实体字段权限', value: 'cp',},
]);

const classifyOptions = computed<SelectOptionData[]>(() => [
  {label: '查看权限（默认）', value: 'view',},
  {label: '编辑权限（默认）', value: 'edit',},
  {label: '查看权限（自定义）', value: 'custom',},
]);

const ruleOptions = computed<SelectOptionData[]>(() => [
  {label: '当前用户ID', value: '#currentUser.userId#',},
  {label: '当前部门ID', value: '#currentUser.deptId#',},
  {label: '当前组织ID', value: '#currentUser.buId#',},
  {label: '当前合作单位ID', value: '#currentUser.cooperatingOrgId#',},
]);

export {typeOptions, classifyOptions, ruleOptions}