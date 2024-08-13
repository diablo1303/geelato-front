import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const tableTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '数据表', value: 'table', disabled: false},
  {label: '实体', value: 'entity', disabled: true},
  {label: "视图", value: 'view', disabled: true},
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {label: '已连接', value: 1,},
  {label: "未连接", value: 0,},
]);
const sourceTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '平台内置', value: 'platform',},
  {label: '系统内置', value: 'system',},
  {label: '应用创建', value: 'creation',},
]);
const tableSyncOptions = computed<SelectOptionData[]>(() => [
  {label: '未创建', value: 0,},
  {label: '未同步', value: 1,},
  {label: '已同步', value: 2,},
]);

const packBusDataOptions = computed<SelectOptionData[]>(() => [
  {label: '不打包', value: 0,},
  {label: "增量打包", value: 1, other: '用于部署时，只插入本次打包的数据，不修改不删除目标表数据；一般为需要在生产环境并行维护的数据，如系统的参数。'},
  {label: "全量打包", value: 2, other: '用于部署时，清空目标表之后插入本次打包的数据。'},
]);

export {tableTypeOptions, enableStatusOptions, linkedOptions, sourceTypeOptions, tableSyncOptions, packBusDataOptions};