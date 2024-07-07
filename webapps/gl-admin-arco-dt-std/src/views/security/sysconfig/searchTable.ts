import {computed} from 'vue';
import type {SelectOptionData, TableColumnData} from '@arco-design/web-vue';
import {RadioOption} from "@arco-design/web-vue/es/radio/interface";

const columns = computed<TableColumnData[]>(() => []);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.sysConfig.index.form.enableStatus.1', value: 1,},
  {label: "security.sysConfig.index.form.enableStatus.0", value: 0,},
]);

const encryptedOptions = computed<RadioOption[]>(() => [
  {label: 'security.sysConfig.index.form.encrypted.1', value: 1,},
  {label: "security.sysConfig.index.form.encrypted.0", value: 0,},
]);

const purposeOptions = computed<SelectOptionData[]>(() => [
  {label: 'security.sysConfig.index.form.purpose.webapp', value: 'webapp',},
  {label: "security.sysConfig.index.form.purpose.endpoint", value: 'endpoint',},
  {label: 'security.sysConfig.index.form.purpose.workflow', value: 'workflow',},
  {label: "security.sysConfig.index.form.purpose.schedule", value: 'schedule',},
]);

export {columns, enableStatusOptions, encryptedOptions, purposeOptions};