import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => []);

const watermarkOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'application.app.list.watermark.1',
    value: 1,
  },
  {
    label: "application.app.list.watermark.0",
    value: 0,
  },
]);
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'application.app.list.status.1',
    value: 1,
  },
  {
    label: "application.app.list.status.0",
    value: 0,
  },
]);

export {columns, watermarkOptions, statusOptions};