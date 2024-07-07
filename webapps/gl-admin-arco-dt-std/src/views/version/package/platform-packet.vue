<script lang="ts">
export default {
  name: 'PlatformPacketList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {TableColumnData, TableSortable, TreeNodeData} from '@arco-design/web-vue';
import {PageQueryFilter} from '@/api/base';
import cloneDeep from "lodash/cloneDeep";
import {IconFolder} from "@arco-design/web-vue/es/icon";
import {AppMeta, generateRenderData, PageParams, sortRenderData} from "@/views/compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['descend', 'ascend'], sorter: false},
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
const appMetaList = ref<AppMeta[]>(props.modelValue);
const rootPid = 'root';
const treeData = ref<TreeNodeData[]>([]);
const selectedKeys = ref<string[]>([]);
const tableList = ref<string[]>([]);
const tableMap = ref<Map<string, Record<string, any>[]>>(new Map());
const tableFilterData = ref<PageQueryFilter[]>([]);
const tableColumnMap = ref<Map<string, string[]>>(new Map());
const tableColumnFilterData = ref<PageQueryFilter[]>([]);
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
  const items = [];
  if (tableList.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tableList.value) {
      // @ts-ignore
      items.push({title: item, key: item, children: [],});
    }
  }
  const parentDict = {title: '业务数据打包管理', key: 'root', icon: () => h(IconFolder), children: items};
  treeData.value = [parentDict];
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

  return loop(treeData.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return treeData.value;
  return searchData(searchKey.value);
});

watch(() => selectedKeys, (val) => {
  tableColumnFilterData.value = [];
  tableFilterData.value = [];
  if (selectedKeys.value.length > 0 && selectedKeys.value[0] !== rootPid) {
    // @ts-ignore
    tableColumnFilterData.value = tableColumnMap.value.get(selectedKeys.value[0]);
    // @ts-ignore
    tableFilterData.value = tableMap.value.get(selectedKeys.value[0]);
  }
}, {deep: true, immediate: true});

const getDefaultTable = () => {
  const data = [];
  const defaultTable = generateRenderData();
  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const key in defaultTable) {
    // @ts-ignore
    data.push(defaultTable[key].code);
  }
  return data;
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    const defaultTable = getDefaultTable();
    appMetaList.value = cloneDeep(props.modelValue);
    tableList.value = [];
    tableMap.value = new Map<string, Record<string, any>[]>();
    tableColumnMap.value = new Map<string, string[]>();
    // eslint-disable-next-line no-restricted-syntax
    for (const item of appMetaList.value) {
      if (!defaultTable.includes(item.metaName)) {
        // 模型字段
        const column = [];
        if (item.metaData && item.metaData.length > 0) {
          // eslint-disable-next-line no-restricted-syntax,guard-for-in
          for (const columnItem in item.metaData[0]) {
            column.push(columnItem);
          }
        }
        if (column.length === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }
        tableList.value.push(item.metaName);
        tableMap.value.set(item.metaName, item.metaData || []);
        tableColumnMap.value.set(item.metaName, column);
      }
    }
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
      <a-table v-if="selectedKeys && (selectedKeys.length > 0 && selectedKeys[0] !== rootPid)"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="tableFilterData"
               :pagination="false"
               :scroll="{x: 2000, y: props.height}"
               :scrollbar="scrollbar"
               :stripe="true"
               column-resizable
               row-key="id">
        <template #columns>
          <a-table-column :width="70" align="center" data-index="index" title="index">
            <template #cell="{  rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column v-for="(item,index) of tableColumnFilterData" :key="index"
                          :ellipsis="true" :tooltip="true" :width="150" :data-index="item" :title="item"/>
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

.list-action-button-default.mark-3 {
  color: rgb(var(--danger-6)) !important;
}

.list-action-button-default.mark-2 {
  color: rgb(var(--primary-6)) !important;
}

.list-action-button-default.mark-1 {
  color: rgb(var(--success-6)) !important;
}

.list-action-button-default {
  cursor: auto;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  padding: 0 3px;
  margin-left: 2px;
  border-radius: 5px;
  color: var(--color-text-3) !important;
  border-color: 1px solid var(--color-text-3) !important;
}
</style>