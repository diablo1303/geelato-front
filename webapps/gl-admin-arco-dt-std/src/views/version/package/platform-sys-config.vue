<script lang="ts">
export default {
  name: 'PlatformSysConfigList'
};
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageQueryFilter} from '@/api/base';
import {AppMeta, PageParams} from "@/views/compare/type";
import cloneDeep from "lodash/cloneDeep";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  data: {type: Array<PageQueryFilter>, default: () => []}
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1600, y: props.height});
// 列表 - 数据
const renderData = ref<PageQueryFilter[]>([]);
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height - 115;
    // 加载数据
    renderData.value = cloneDeep(props.data);
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :pagination="false"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column :width="70" align="center" data-index="index" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="config_key" title="配置键"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="key_type" title="键类型"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="config_value" title="配置值"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="value_type" title="值类型"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="purpose" title="使用范围"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="encrypted" title="是否加密"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
      <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="备注"/>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
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
</style>