import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";

const columns = computed<TableColumnData[]>(() => []);

const typeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.permission.index.form.type.dp', value: 'dp',},
  {label: 'security.permission.index.form.type.ep', value: 'ep',},
  {label: 'security.permission.index.form.type.mp', value: 'mp',},
  {label: 'security.permission.index.form.type.cp', value: 'cp',},
]);

export {columns, typeOptions}