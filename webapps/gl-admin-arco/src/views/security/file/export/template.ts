import {computed} from "vue";
import {SelectOptionData} from "@arco-design/web-vue";

export interface BusinessMetaData {
  placeholder: string;
  var: string;
  listVar: string;
  constValue: string;
  expression: string;
  valueType: string;
  valueComputeMode: string;
  isList: boolean;
  isMerge: boolean;
  isImage: boolean;
  imageWidth: number;
  imageHeight: number;
  description: string;
  sign?: string;
}

export const businessMetaDataValueTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '字符串', value: 'STRING'},
  {label: '数值', value: 'NUMBER'},
  {label: '日期', value: 'DATE'},
  {label: '时间', value: 'DATETIME'},
]);

export const businessMetaDataValueComputeModeOptions = computed<SelectOptionData[]>(() => [
  {label: '变量', value: 'VAR'},
  {label: '常量', value: 'CONST'},
  {label: '计算公式', value: 'EXPRESSION'},
]);