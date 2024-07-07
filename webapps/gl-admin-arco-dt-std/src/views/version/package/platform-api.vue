<script lang="ts">
export default {
  name: 'PlatformApiList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {TableColumnData, TableSortable, TreeNodeData} from '@arco-design/web-vue';
import {PageQueryFilter} from '@/api/base';
import cloneDeep from "lodash/cloneDeep";
import {IconFolder} from "@arco-design/web-vue/es/icon";
import {AppMeta, PageParams} from "@/views/compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  api: {type: Array<PageQueryFilter>, default: () => []},
  apiParam: {type: Array<PageQueryFilter>, default: () => []}
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['descend', 'ascend'], sorter: false},
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
const rootPid = 'root';
const dictTree = ref<TreeNodeData[]>([]);
const selectedKeys = ref<string[]>([]);
const apiData = ref<PageQueryFilter[]>([]);
const apiParamData = ref<PageQueryFilter[]>([]);
const apiParamFilterData = ref<PageQueryFilter[]>([]);
/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('320px');
const splitSize = ref<number | string>(splitMin.value);

const setDictItemData = () => {
  const dicts = [];
  if (apiData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const dict of apiData.value) {
      // @ts-ignore
      dicts.push({title: dict.name, key: dict.id, children: []});
    }
  }
  const parentDict = {title: '接口服务参数管理', key: 'root', icon: () => h(IconFolder), children: dicts};
  dictTree.value = [parentDict];
  selectedKeys.value = [rootPid];
}
const searchKey = ref('');
const searchData = (keyword: string) => {
  const loop = (data: TreeNodeData[]) => {
    const result: TreeNodeData[] = [];
    data.forEach(item => {
      if (item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(dictTree.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return dictTree.value;
  return searchData(searchKey.value);
});

watch(() => selectedKeys, (val) => {
  apiParamFilterData.value = [];
  if (selectedKeys.value.length > 0 && selectedKeys.value[0] !== rootPid) {
    // @ts-ignore
    apiParamFilterData.value = apiParamData.value.filter(item => item.api_id === selectedKeys.value[0]);
  }
}, {deep: true, immediate: true});


watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    apiData.value = cloneDeep(props.api) || [];
    apiParamData.value = cloneDeep(props.apiParam) || [];
    setDictItemData();
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
    <template #first>
<span class="tree-layout">
    <a-input-search v-model="searchKey" allow-clear class="tree-search" placeholder="搜索"/>
    <a-scrollbar :style="{overflow:'auto',height:`${props.height-110}px`}">
      <a-tree
          v-model:selectedKeys="selectedKeys"
          :block-node="false"
          :data="originTreeData"
          :multiple="false"
          :show-line="true">
        <template #title="nodeData">
          <template v-if="getMatchIndex(nodeData?.title) < 0">
            {{ nodeData?.title }}
          </template>
          <span v-else>
            {{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
            <span style="color: var(--color-primary-light-4);">
              {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length) }}
            </span>
            {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
          </span>
        </template>
      </a-tree>
    </a-scrollbar>
  </span>
    </template>
    <template #second>
      <a-table v-if="!selectedKeys || (selectedKeys.length > 0 && selectedKeys[0] === rootPid)"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="apiData"
               :pagination="false"
               :scroll="{x: 1600, y: props.height}"
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
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="name" title="名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="code" title="编码"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="version" title="版本号"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="group_name" title="分组名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="remark" title="备注"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="source_content" title="对于GlPage的组件树字符串"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="release_content" title="生成的可执行javascript脚本"/>
        </template>
      </a-table>
      <a-table v-else
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="apiParamFilterData"
               :pagination="false"
               :scroll="{x: 1400, y: props.height}"
               :scrollbar="scrollbar"
               :stripe="true"
               column-resizable
               row-key="id">
        <template #columns>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="name" title="参数名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="default_value" title="参数默认值"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="data_type" title="参数数据类型"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="required" title="是否必填"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="param_type" title="参数类型"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="demo_value" title="示例数据"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="remark" title="备注"/>
        </template>
      </a-table>
    </template>
  </a-split>
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