<script lang="ts">
export default {
  name: 'GlApiParamList'
};
</script>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import type {TableColumnData, TableData} from '@arco-design/web-vue';
import {useGlobal, utils} from "@geelato/gl-ui";
import type {QueryApiParamForm} from "@geelato/gl-ui";
import {dataTypeBooleanOptions, dataTypeJsonOptions, dataTypeRootOptions} from "../searchTable";

type PageParams = {
  apiId: string;
  paramType: string;
  bodyType: string;
  appId: string;
  tenantCode: string;
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<QueryApiParamForm>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},
  isModal: {type: Boolean, default: false},
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
});

const generateFormData = (pid?: string, name?: string): QueryApiParamForm => {
  return {
    id: utils.generateRandom(19),
    pid: pid || '',
    apiId: props.parameter?.apiId || '',
    paramType: props.parameter?.paramType || '',
    bodyType: props.parameter?.bodyType || '',
    name: name || '',
    dataType: 'string',
    required: false,
    demoValue: '',
    defaultValue: '',
    remark: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}

// 分页列表参数
const global = useGlobal();
const expandedKeys = ref<string[]>([]);

const nodeExpand = (rowKey: string | number, record: TableData):any => {
  if (expandedKeys.value.includes(rowKey as string)) {
    expandedKeys.value = expandedKeys.value.filter(item => item !== rowKey);
  } else {
    expandedKeys.value.push(rowKey as string);
  }
}

const queryNodeIndex = (id: string, data: QueryApiParamForm[]) => {
  let index = -1;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === id) {
        index = i;
        break;
      }
    }
  }
  return index;
}

const querydelNode = (record: QueryApiParamForm, data: QueryApiParamForm[]) => {
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.id === record.pid) {
        if (item.children && item.children.length > 0) {
          const index = queryNodeIndex(record.id, item.children);
          if (index >= 0) item.children.splice(index, 1);
          if (item.children.length === 0) delete item.children;
        }
      } else {
        querydelNode(record, item.children || []);
      }
    }
  }
}

/**
 * 删除节点
 * @param record
 */
const deleteNode = (record: QueryApiParamForm) => {
  querydelNode(record, props.modelValue);
}

const dataTypeChange = (record: QueryApiParamForm) => {
  record.defaultValue = '';
  record.demoValue = '';
  if (['array'].includes(record.dataType)) {
    record.children = [generateFormData(record.id, 'ITEMS')];
  } else {
    delete record.children;
  }
}

/**
 * 子节点
 * @param record
 */
const addChildNode = (record: QueryApiParamForm) => {
  const data = generateFormData(record.id);
  record.children = record.children || [];
  record.children.push(data);
}

const queryNode = (record: QueryApiParamForm, adjoin: QueryApiParamForm, data: QueryApiParamForm[]) => {
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.id === record.pid) {
        if (item.children && item.children.length > 0) {
          const index = queryNodeIndex(adjoin.id, item.children);
          if (index >= 0) item.children.splice(index + 1, 0, record);
        }
      } else {
        queryNode(record, adjoin, item.children || []);
      }
    }
  }
}

/**
 * 相邻节点
 * @param record
 */
const addAdjoinNode = (record: QueryApiParamForm) => {
  const data = generateFormData(record.pid);
  queryNode(data, record, props.modelValue);
}

const expandAll = (data: QueryApiParamForm[]) => {
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.children && item.children.length > 0) {
        expandedKeys.value.push(item.id);
        expandAll(item.children);
      }
    }
  }
}

const nameInput = (record: QueryApiParamForm) => {
  if (["ROOT"].includes(record.name)) {
    global.$message.error("参数名不能为“ROOT”");
    record.name = '';
  } else if (["ITEMS"].includes(record.name)) {
    global.$message.error("参数名不能为“ITEMS”");
    record.name = '';
  }
}

watch(() => props, (val) => {
  expandedKeys.value = [];
  expandAll(props.modelValue);
}, {deep: true, immediate: true});
</script>

<template>
  <a-table :bordered="{cell:true}"
           :columns="([] as TableColumnData[])"
           :data="modelValue"
           :expanded-keys="expandedKeys"
           :pagination="false"
           :scroll="{x:1200,y:height}"
           :scrollbar="true"
           :stripe="true"
           column-resizable
           row-key="id" @expand="nodeExpand">
    <template #columns>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="name">
        <template #title>
          <a-tooltip content="必填项" position="right">
            <div>参数名 <span style="color: rgb(var(--danger-6));">*</span></div>
          </a-tooltip>
        </template>
        <template #cell="{record}">
          <a-input v-if="formState!=='view'&&!['ROOT','ITEMS'].includes(record.name)" v-model="record.name" allow-clear
                   :error="!record.name" :max-length="32" placeholder="禁填“ROOT”“ITEMS”" @change="nameInput(record)"/>
          <span v-else>{{ record.name }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" align="center" data-index="dataType">
        <template #title>
          <a-tooltip content="必选项" position="right">
            <div>类型 <span style="color: rgb(var(--danger-6));">*</span></div>
          </a-tooltip>
        </template>
        <template #cell="{record}">
          <a-select v-if="formState!=='view'" v-model="record.dataType" :error="!record.dataType"
                    :options="['ROOT'].includes(record.name)?dataTypeRootOptions:dataTypeJsonOptions"
                    @change="dataTypeChange(record)"/>
          <span v-else>{{ record.dataType }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" align="center" data-index="required" title="是否必填">
        <template #cell="{record}">
          <a-switch v-if="formState!=='view'&&!['ROOT','ITEMS'].includes(record.name)" v-model="record.required"/>
          <span v-else>{{ record.required ? '是' : '否' }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="demoValue" title="示例值">
        <template #cell="{record}">
          <span v-if="['ROOT','ITEMS'].includes(record.name)||['array','object'].includes(record.dataType)"></span>
          <a-select v-else-if="['boolean'].includes(record.dataType)&&formState!=='view'" v-model="record.demoValue" :options="dataTypeBooleanOptions"/>
          <a-input v-else-if="formState!=='view'" v-model="record.demoValue" :max-length="512" allow-clear/>
          <span v-else>{{ record.demoValue }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="defaultValue" title="默认值">
        <template #cell="{record}">
          <span v-if="['ROOT','ITEMS'].includes(record.name)||['array','object'].includes(record.dataType)"></span>
          <a-select v-else-if="['boolean'].includes(record.dataType)&&formState!=='view'" v-model="record.defaultValue"
                    :options="dataTypeBooleanOptions"/>
          <a-input v-else-if="formState!=='view'" v-model="record.defaultValue" :max-length="512" allow-clear/>
          <span v-else>{{ record.defaultValue }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="remark" title="备注">
        <template #cell="{record}">
          <a-textarea v-if="formState!=='view'" v-model="record.remark" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else>{{ record.remark }}</span>
        </template>
      </a-table-column>
      <a-table-column v-if="formState!=='view'" :width="120" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record }">
          <a-tooltip v-if="['ROOT','ITEMS'].includes(record.name)&&['object'].includes(record.dataType)" content="添加子节点" position="top">
            <a-button type="text" @click="addChildNode(record)">
              <gl-iconfont type="gl-plus-circle"/>
            </a-button>
          </a-tooltip>
          <a-dropdown v-if="!['ROOT','ITEMS'].includes(record.name)&&['object'].includes(record.dataType)" position="br" trigger="hover">
            <a-button type="text">
              <gl-iconfont type="gl-plus-circle"/>
            </a-button>
            <template #content>
              <a-doption @click="addAdjoinNode(record)">添加相邻节点</a-doption>
              <a-doption @click="addChildNode(record)">添加子节点</a-doption>
            </template>
          </a-dropdown>
          <a-tooltip v-if="!['ROOT','ITEMS'].includes(record.name)&&!['object'].includes(record.dataType)" content="添加相邻节点" position="top">
            <a-button type="text" @click="addAdjoinNode(record)">
              <gl-iconfont type="gl-plus-circle"/>
            </a-button>
          </a-tooltip>
          <a-tooltip v-if="!['ROOT','ITEMS'].includes(record.name)" content="删除该节点" position="top">
            <a-button status="danger" type="text" @click="deleteNode(record)">
              <gl-iconfont type="gl-delete"/>
            </a-button>
          </a-tooltip>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

.wrapper {
  position: relative;
}

.button-disabled {
  cursor: not-allowed;
  color: var(--color-text-3) !important;
  background-color: transparent !important;
  border: 1px solid transparent !important;
}
</style>