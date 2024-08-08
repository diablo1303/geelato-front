<script lang="ts">
export default {
  name: 'GlApiParamList'
};
</script>

<script lang="ts" setup>
import type {TableColumnData} from '@arco-design/web-vue';
import {useGlobal} from "@geelato/gl-ui";
import type {QueryApiParamForm} from "@geelato/gl-ui";
import {dataTypeBooleanOptions, dataTypeFormOptions, dataTypeOptions} from "../searchTable";

type PageParams = {
  paramType: string;
  bodyType: string;
}

const emits = defineEmits(['update:modelValue', 'delete']);
const props = defineProps({
  modelValue: {type: Array<QueryApiParamForm>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},
  isModal: {type: Boolean, default: false},
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
});

// 分页列表参数
const global = useGlobal();

const deleteMethod = (record: QueryApiParamForm, data: QueryApiParamForm[]) => {
  if (data && data.length > 0) {
    let index = -1;
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (item.id === record.id) {
        index = i;
      }
    }
    if (index > -1) {
      data.splice(index, 1);
    }
  }
}

const delApiParam = (record: QueryApiParamForm) => {
  emits("delete", record);
}

const dataTypeChange = (record: QueryApiParamForm) => {
  record.defaultValue = '';
  record.demoValue = '';
}
</script>

<template>
  <a-table :bordered="{cell:true}"
           :columns="([] as TableColumnData[])"
           :data="modelValue"
           :pagination="false"
           :scroll="{x:1200,y:height}"
           :scrollbar="true"
           :stripe="true"
           column-resizable
           row-key="id">
    <template #columns>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="name" title="参数名">
        <template #cell="{record}">
          <a-input v-if="formState!=='view'" v-model="record.name" :max-length="32"/>
          <span v-else>{{ record.name }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" align="center" data-index="dataType" title="类型">
        <template #cell="{record}">
          <a-select v-if="formState!=='view'" v-model="record.dataType" :options="parameter.paramType==='body'?dataTypeFormOptions:dataTypeOptions"
                    @change="dataTypeChange(record)"/>
          <span v-else>{{ record.dataType }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" align="center" data-index="required" title="是否必填">
        <template #cell="{record}">
          <a-switch v-if="formState!=='view'" v-model="record.required"/>
          <span v-else>{{ record.required ? '是' : '否' }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="demoValue" title="示例值">
        <template #cell="{record}">
          <GlUpload v-if="['file'].includes(record.dataType)" v-model="record.demoValue" :disabled="formState==='view'" :limit="1"/>
          <a-select v-else-if="['boolean'].includes(record.dataType)&&formState!=='view'" v-model="record.demoValue"
                    :options="dataTypeBooleanOptions"/>
          <a-input v-else-if="formState!=='view'" v-model="record.demoValue" :max-length="512" allow-clear/>
          <span v-else>{{ record.demoValue }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="defaultValue" title="默认值">
        <template #cell="{record}">
          <GlUpload v-if="['file'].includes(record.dataType)" v-model="record.defaultValue" :disabled="formState==='view'" :limit="1"/>
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
      <a-table-column v-show="formState==='edit'" :width="60" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record }">
          <a-button status="danger" type="text" @click="delApiParam(record)">
            <gl-iconfont type="gl-delete"/>
          </a-button>
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