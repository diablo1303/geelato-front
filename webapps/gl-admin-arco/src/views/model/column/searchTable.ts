import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData, SelectOptionGroup} from "@arco-design/web-vue";
import {RadioOption} from "@arco-design/web-vue/es/radio/interface";
import {ColumnSelectType, getSelectTypes, queryDefaultMetas} from "@/api/model";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.column.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.column.index.form.name',
    dataIndex: 'name'
  },
  {
    title: 'model.column.index.form.title',
    dataIndex: 'title'
  },

  {
    title: 'model.column.index.form.fieldName',
    dataIndex: 'fieldName'
  },
  {
    title: 'model.column.index.form.dataType',
    dataIndex: 'dataType'
  },
  {
    title: 'model.column.index.form.type',
    dataIndex: 'type'
  },
  {
    title: 'model.column.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.column.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.column.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const dataTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.dataType.BIT',
    value: 'BIT',
  },
  {
    label: 'model.column.index.form.dataType.VARCHAR',
    value: 'VARCHAR',
  },
  {
    label: 'model.column.index.form.dataType.TEXT',
    value: 'TEXT',
  },
  {
    label: 'model.column.index.form.dataType.LONGTEXT',
    value: 'LONGTEXT',
  },
  {
    label: 'model.column.index.form.dataType.TINYINT',
    value: 'TINYINT',
  },
  {
    label: 'model.column.index.form.dataType.INT',
    value: 'INT',
  },
  {
    label: 'model.column.index.form.dataType.BIGINT',
    value: 'BIGINT',
  },
  {
    label: 'model.column.index.form.dataType.DECIMAL',
    value: 'DECIMAL',
  },

  {
    label: 'model.column.index.form.dataType.YEAR',
    value: 'YEAR',
  },
  {
    label: 'model.column.index.form.dataType.DATE',
    value: 'DATE',
  },
  {
    label: 'model.column.index.form.dataType.TIME',
    value: 'TIME',
  },
  {
    label: 'model.column.index.form.dataType.DATETIME',
    value: 'DATETIME',
  },
  {
    label: 'model.column.index.form.dataType.TIMESTAMP',
    value: 'TIMESTAMP',
  },
]);


const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.column.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.column.index.form.enableStatus.0",
    value: 0,
  },
]);

const keyOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.key.1',
    value: 1,
  },
  {
    label: "model.column.index.form.key.0",
    value: 0,
  },
]);

const uniquedOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.uniqued.1',
    value: 1,
  },
  {
    label: "model.column.index.form.uniqued.0",
    value: 0,
  },
]);

const nullableOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.nullable.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.nullable.0',
    value: 0,
  },
]);
const autoIncrementOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.autoIncrement.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.autoIncrement.0',
    value: 0,
  },
]);
const numericSignedOptions = computed<RadioOption[]>(() => [
  {
    label: 'model.column.index.form.numericSigned.1',
    value: 1,
  },
  {
    label: 'model.column.index.form.numericSigned.0',
    value: 0,
  },
]);

// 主键、、单位、部门、创建时间、创建人员、更新时间、更新人员、是否删除、排序
// eslint-disable-next-line import/no-mutable-exports
let defaultColumnMetas = computed<string[]>(() => []);
queryDefaultMetas().then((data) => {
  defaultColumnMetas = computed<string[]>(() => data);
});
// 数据类型选项
// eslint-disable-next-line import/no-mutable-exports
let columnSelectType: ColumnSelectType[] = [];
// eslint-disable-next-line import/no-mutable-exports
let selectTypeOptions = computed<SelectOptionGroup[]>(() => []);
getSelectTypes().then((data) => {
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
  columns,
  enableStatusOptions,
  keyOptions,
  nullableOptions,
  uniquedOptions,
  autoIncrementOptions,
  dataTypeOptions,
  numericSignedOptions,
  defaultColumnMetas,
  columnSelectType,
  selectTypeOptions
};