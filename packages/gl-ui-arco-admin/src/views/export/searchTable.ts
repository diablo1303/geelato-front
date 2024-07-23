import {computed} from 'vue';
import type {SelectOptionData} from '@arco-design/web-vue';

const fileTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'PDF', value: 'application/pdf',},
  {label: 'WORD[DOC]', value: 'application/msword',},
  {label: 'EXCEL[XLS]', value: 'application/vnd.ms-excel',},
  {label: 'WORD[DOCX]', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',},
  {label: 'EXCEL[XLSX]', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',}
]);

export {fileTypeOptions};