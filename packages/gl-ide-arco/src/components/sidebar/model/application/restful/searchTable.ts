import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";


const configTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'Sql', value: 'sql',},
  {label: 'JavaScript', value: 'js',},
]);

const requestBodyTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'Form-Data', value: 'form',},
  {label: 'Json', value: 'json',},
]);

const paramsTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '字符串', value: 'string',},
  {label: '整数', value: 'integer',},
  {label: '布尔值', value: 'boolean',},
  {label: '数值', value: 'number',},
  {label: '数组', value: 'array',},
  {label: '文件', value: 'file',},
]);


export {configTypeOptions, requestBodyTypeOptions, paramsTypeOptions};