import {computed} from "vue";
import type {SelectOptionData} from "@arco-design/web-vue";
import type {QueryTableColumnForm} from "@geelato/gl-ui";

export interface BusinessTypeData {
  name: string;
  type: string;
  format: string;
  remark: string;
  sign?: string;
}

export interface BusinessRuleData {
  columnName: string;
  type: string;
  rule: string;
  goal: string;
  priority: boolean;
  retain: boolean;
  order: number;
  remark: string;
  columnNameArr?: string[];
  ruleTableName?: string;
  ruleColumnName?: string[];
  ruleQueryOptions?: QueryTableColumnForm[];
  sign?: string;
}

export interface BusinessMetaData {
  tableName: string;
  columnName: string;
  evaluation: string;
  constValue: string;
  variableValue: string;
  expression: string;
  dictCode: string;
  primaryValue: string;
  remark: string;
  columnNameOptions?: QueryTableColumnForm[];
  primaryTableName?: string;
  primaryColumnNameGoal?: string;
  primaryColumnNameMatch?: string[];
  primaryValueOptions?: QueryTableColumnForm[];
  sign?: string;
}

export const businessTypeDataTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '字符串', value: 'STRING'},
  {label: '数值', value: 'NUMBER'},
  {label: '布尔值', value: 'BOOLEAN'},
  {label: '时间', value: 'DATETIME'},
]);

export const businessRuleDataTypeOptions = computed<SelectOptionData[]>(() => [
  {label: '去除字符串前后空格', value: 'TRIM'},
  {label: '字符串转大写', value: 'UPPERCASE'},
  {label: '字符串转小写', value: 'LOWERCASE'},

  {label: '删除匹配的字符', value: 'DELETES'},
  {label: '替换匹配的字符', value: 'REPLACE'},
  {label: '数据字典，多值匹配', value: 'CHECKBOX'},
  {label: '数据字典，单值匹配', value: 'DICTIONARY'},
  {label: '查询表格，目标字段非查询字段', value: 'QUERYGOAL'},
  {label: '查询表格，目标字段为查询字段', value: 'QUERYRULE'},
  {label: 'Javascript计算公式', value: 'EXPRESSION'},

  {label: '多值分割，对称关系', value: 'SYM'},// 一行拆分多行
  {label: '多值分割，相乘关系', value: 'MULTI'},//
]);

export const businessMetaEvaluationOptions = computed<SelectOptionData[]>(() => [
  {label: '常量取值', value: 'CONST'},// 基于
  {label: '变量取值', value: 'VARIABLE'},
  {label: '表达式取值', value: 'JS_EXPRESSION'},
  {label: '数据字典，多选取值', value: 'CHECKBOX'},
  {label: '数据字典，单选取值', value: 'DICTIONARY'},
  {label: '模型取值', value: 'PRIMARY_KEY'},//
  {label: '流水号', value: 'SERIAL_NUMBER'},
  {label: '业务数据原值', value: 'PRIMITIVE'},
]);
