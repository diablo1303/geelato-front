<script lang="ts">
export default {
  name: 'PlatformModelList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {TableColumnData, TableSortable, TreeNodeData} from '@arco-design/web-vue';
import {IconCalendar, IconFolder, IconLink, IconTags} from '@arco-design/web-vue/es/icon';
import cloneDeep from "lodash/cloneDeep";
import {QueryConnectForm, QueryTableColumnForm, QueryTableForeignForm, QueryTableForm, QueryViewForm} from "@/api/model";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

type AppMeta = {
  metaName: string;
  metaData: Record<string, any>[]
}

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
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
const appMetaList = ref<AppMeta[]>([]);
const rootPid = 'root';
const modelTree = ref<TreeNodeData[]>([]);
const selectedKeys = ref<string[]>([]);
const connectData = ref<QueryConnectForm[]>([]);
const tableData = ref<QueryTableForm[]>([]);
const columnData = ref<QueryTableColumnForm[]>([]);
const viewData = ref<QueryViewForm[]>([]);
const foreignData = ref<QueryTableForeignForm[]>([]);

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('600px');
const splitSize = ref<number | string>(splitMin.value);

const setModelTreeData = () => {
  const connects = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const connectItem of connectData.value) {
    const tables = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tableItem of tableData.value) {
      // @ts-ignore
      // eslint-disable-next-line no-continue
      if (tableItem.connect_id !== connectItem.id) continue;
      const views = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const viewItem of viewData.value) {
        // @ts-ignore
        // eslint-disable-next-line no-continue
        if (viewItem.connect_id !== tableItem.connect_id || viewItem.entity_name !== tableItem.entity_name) continue;
        // @ts-ignore
        views.push({title: `${viewItem.title} | ${viewItem.view_name}`, key: viewItem.id, icon: () => h(IconTags), level: 3});
      }
      // @ts-ignore
      tables.push({title: `${tableItem.title} | ${tableItem.entity_name}`, key: tableItem.id, level: 2, icon: () => h(IconCalendar), children: views});
    }
    // @ts-ignore
    connects.push({title: `${connectItem.db_connect_name} | ${connectItem.db_name}`, key: connectItem.id, level: 1, icon: () => h(IconLink), children: tables});
  }
  const parentDict = {title: '数据链接', key: 'root', level: 0, icon: () => h(IconFolder), children: connects};
  modelTree.value = [parentDict];
  selectedKeys.value = [rootPid];
  console.log(modelTree.value);
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

  return loop(modelTree.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return modelTree.value;
  return searchData(searchKey.value);
});

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    appMetaList.value = cloneDeep(props.modelValue) || [];
    connectData.value = (appMetaList.value.find(item => item.metaName === "platform_dev_db_connect")?.metaData || []) as QueryConnectForm[];
    console.log(connectData.value);
    tableData.value = (appMetaList.value.find(item => item.metaName === "platform_dev_table")?.metaData || []) as QueryTableForm[];
    columnData.value = (appMetaList.value.find(item => item.metaName === "platform_dev_column")?.metaData || []) as QueryTableColumnForm[];
    viewData.value = (appMetaList.value.find(item => item.metaName === "platform_dev_view")?.metaData || []) as QueryViewForm[];
    console.log(viewData.value);
    foreignData.value = (appMetaList.value.find(item => item.metaName === "platform_dev_table_foreign")?.metaData || []) as QueryTableForeignForm[];
    setModelTreeData();
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
    <template #first>
<span class="tree-layout">
    <a-input-search v-model="searchKey" :placeholder="$t('orgChooseBox.tree.search')" allow-clear class="tree-search"/>
    <a-scrollbar :style="{overflow:'auto',height:`${props.height-110}px`}">
      <a-tree
          v-model:selectedKeys="selectedKeys"
          :block-node="true"
          :data="originTreeData"
          :multiple="false"
          :show-line="false">
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