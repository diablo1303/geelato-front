import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.dictItem.index.form.enableStatus.1', value: 1,},
  {label: "security.dictItem.index.form.enableStatus.0", value: 0,},
]);

export {columns, enableStatusOptions};