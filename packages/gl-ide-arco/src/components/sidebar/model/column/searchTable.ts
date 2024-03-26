import {computed} from 'vue';
import type {ColumnSelectType} from "@geelato/gl-ui";
import {modelApi} from "@geelato/gl-ui";
import type {SelectOptionData, SelectOptionGroup} from "@arco-design/web-vue";
import type {RadioOption} from "@arco-design/web-vue/es/radio/interface";

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '启用', value: 1,},
  {label: "禁用", value: 0,},
]);

const keyOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const uniquedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const encryptedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const nullableOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);
const autoIncrementOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);
const numericSignedOptions = computed<RadioOption[]>(() => [
  {label: '是', value: 1,},
  {label: "否", value: 0,},
]);

const columnPermissionOptions = computed<SelectOptionData[]>(() => [
  {label: "可编辑", value: "0",},
  {label: '不可编辑', value: "1",},
  {label: '不可查看', value: "2",},
]);

// 主键、、单位、部门、创建时间、创建人员、更新时间、更新人员、是否删除、排序
let defaultColumnMetas = computed<string[]>(() => []);
modelApi.queryDefaultMetas().then((data) => {
  defaultColumnMetas = computed<string[]>(() => data);
});

// 数据类型选项
let columnSelectType: ColumnSelectType[] = [];
let selectTypeOptions = computed<SelectOptionGroup[]>(() => []);
modelApi.getSelectTypes().then((data) => {
  columnSelectType = data;
  const optionGroup: SelectOptionGroup[] = [];
  const groups: string[] = [];
  for (let i = 0; i < data.length; i += 1) {
    if (!groups.includes(data[i].group)) {
      groups.push(data[i].group);
      const optionDatas: SelectOptionData[] = [];
      for (let j = 0; j < data.length; j += 1) {
        if (data[j].group === data[i].group) {
          optionDatas.push({value: data[j].value, label: data[j].label, disabled: data[j].disabled});
        }
      }
      optionGroup.push({isGroup: true, label: data[i].group, options: optionDatas});
    }
  }
  selectTypeOptions = computed<SelectOptionGroup[]>(() => optionGroup);
});

export {
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  uniquedOptions,
  encryptedOptions,
  autoIncrementOptions,
  numericSignedOptions,
  defaultColumnMetas,
  columnSelectType,
  selectTypeOptions,
  columnPermissionOptions
};