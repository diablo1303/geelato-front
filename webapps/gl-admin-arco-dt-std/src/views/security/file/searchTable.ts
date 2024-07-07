import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.file.index.form.enableStatus.1', value: 1,},
  {label: "security.file.index.form.enableStatus.0", value: 0,},
]);

const fileTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.file.index.form.fileType.doc', value: 'doc',},
  {label: 'security.file.index.form.fileType.excel', value: 'excel',}
]);

const useTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.file.index.form.useType.import', value: 'import',},
  {label: 'security.file.index.form.useType.export', value: 'export',}
]);

export {columns, enableStatusOptions, fileTypeOptions, useTypeOptions};