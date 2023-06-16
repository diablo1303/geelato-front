import {computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";

const columns = computed<TableColumnData[]>(() => [
  {
    title: 'model.view.index.form.index',
    dataIndex: 'index',
    slotName: 'index'
  },
  {
    title: 'model.view.index.form.entityName',
    dataIndex: 'entityName'
  },
  {
    title: 'model.view.index.form.title',
    dataIndex: 'title'
  },
  {
    title: 'model.view.index.form.viewName',
    dataIndex: 'viewName'
  },
  {
    title: 'model.view.index.form.viewType',
    dataIndex: 'viewType'
  },

  {
    title: 'model.view.index.form.description',
    dataIndex: 'description'
  },
  {
    title: 'model.view.index.form.linked',
    dataIndex: 'linked'
  },
  {
    title: 'model.view.index.form.seqNo',
    dataIndex: 'seqNo'
  },
  {
    title: 'model.view.index.form.enableStatus',
    dataIndex: 'enableStatus',
    slotName: 'enableStatus'
  },
  {
    title: 'model.view.index.form.createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'model.view.index.form.operations',
    dataIndex: 'operations',
    slotName: 'operations'
  }
]);

const viewTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.view.index.form.viewType.default',
    value: 'default',
  },
  {
    label: 'model.view.index.form.viewType.custom',
    value: 'custom',
  },
]);

const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.view.index.form.enableStatus.1',
    value: 1,
  },
  {
    label: "model.view.index.form.enableStatus.0",
    value: 0,
  },
]);

const linkedOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'model.view.index.form.linked.1',
    value: 1,
  },
  {
    label: "model.view.index.form.linked.0",
    value: 0,
  },
]);

export {columns, viewTypeOptions, enableStatusOptions, linkedOptions};