import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.role.index.form.enableStatus.1', value: 1,},
  {label: "security.role.index.form.enableStatus.0", value: 0,},
]);

const typeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.role.index.form.type.app', value: 'app',},
  {label: 'security.role.index.form.type.platform', value: 'platform',},
]);

export {columns, enableStatusOptions, typeOptions};