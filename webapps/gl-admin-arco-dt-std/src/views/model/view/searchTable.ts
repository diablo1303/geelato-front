import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const viewTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.view.index.form.viewType.default', value: 'default',},
  {label: 'model.view.index.form.viewType.custom', value: 'custom',},
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.view.index.form.enableStatus.1', value: 1,},
  {label: "model.view.index.form.enableStatus.0", value: 0,},
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.view.index.form.linked.1', value: 1,},
  {label: "model.view.index.form.linked.0", value: 0,},
]);

export {columns, viewTypeOptions, enableStatusOptions, linkedOptions};