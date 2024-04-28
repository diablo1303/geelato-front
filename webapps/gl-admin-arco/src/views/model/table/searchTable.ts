import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const tableTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.table.index.form.tableType.table', value: 'table', disabled: false},
  {label: 'model.table.index.form.tableType.entity', value: 'entity', disabled: true},
  {label: "model.table.index.form.tableType.view", value: 'view', disabled: true},
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.table.index.form.enableStatus.1', value: 1,},
  {label: "model.table.index.form.enableStatus.0", value: 0,},
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.table.index.form.linked.1', value: 1,},
  {label: "model.table.index.form.linked.0", value: 0,},
]);

const sourceTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.table.index.form.sourceType.platform', value: 'platform',},
  {label: 'model.table.index.form.sourceType.system', value: 'system',},
  {label: 'model.table.index.form.sourceType.creation', value: 'creation',},
]);

const packBusDataOptions = computed<SelectOptionData[]>(() => [
  {label: 'model.table.index.form.packBusData.true', value: true,},
  {label: "model.table.index.form.packBusData.false", value: false,},
]);

export {columns, tableTypeOptions, enableStatusOptions, linkedOptions, sourceTypeOptions, packBusDataOptions};