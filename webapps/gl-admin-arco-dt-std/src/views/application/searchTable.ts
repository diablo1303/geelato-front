import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const watermarkOptions = computed<SelectOptionData[]>(() => [
  {label: 'application.app.list.watermark.1', value: 1,},
  {label: "application.app.list.watermark.0", value: 0,},
]);
const statusOptions = computed<SelectOptionData[]>(() => [
  {label: 'application.app.list.status.1', value: 1,},
  {label: "application.app.list.status.0", value: 0,},
]);

const appTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'application.app.list.type.platform', value: 'platform',},
  {label: "application.app.list.type.normal", value: 'normal',},
]);

const purposeOptions = computed<SelectOptionData[]>(() => [
  {label: 'application.app.list.purpose.inside', value: 'inside',},
  {label: "application.app.list.purpose.outside", value: 'outside',},
  {label: "application.app.list.purpose.side", value: 'side',},
]);

export {columns, watermarkOptions, statusOptions, appTypeOptions, purposeOptions};