<script lang="ts">
export default {
  name: 'PlatformPageList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {type SelectOptionData, TableColumnData, TableData, TableSortable, TreeNodeData} from '@arco-design/web-vue';
import {getOptionLabel, PageQueryFilter} from '@/api/base';
import {QueryTreeNodeForm} from "@/api/security";
import cloneDeep from "lodash/cloneDeep";
import {IconFolder} from "@arco-design/web-vue/es/icon";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";

// 页面所需 参数
type PageParams = {
  appCode?: string; // 应用编码
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

type AppMeta = {
  metaName: string;
  metaData: Record<string, any>[]
}

interface TreeNodeModel extends TreeNodeData {
  data?: Record<string, any>;
  level?: number;
  children?: TreeNodeModel[];
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
const treeData = ref<TreeNodeModel[]>([]);
const selectedKeys = ref<string[]>([]);
const selectedData = ref<TreeNodeModel>({});
const treeNodeData = ref<QueryTreeNodeForm[]>([]);
const treeNodeFilterData = ref<QueryTreeNodeForm[]>([]);
const appPageData = ref<PageQueryFilter[]>([]);
const appPageFilterData = ref<PageQueryFilter[]>([]);

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('230px');
const splitSize = ref<number | string>(splitMin.value);

const typeOptions = computed<SelectOptionData[]>(() => [
  {value: 'folder', label: '目录'},
  {value: 'listPage', label: '列表页面'},
  {value: 'freePage', label: '自定义页面'},
  {value: 'formPage', label: '表单页面'},
  {value: 'flowPage', label: '工作流页面'},
  {value: 'templatePage', label: '模型页面'},
]);

const getTreeNode = (parentId: string) => {
  const nodes: TreeNodeModel[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of treeNodeData.value) {
    // @ts-ignore
    if (item.pid === parentId) {
      nodes.push({
        // @ts-ignore
        title: item.text, key: item.id, data: item, level: 1,
        // @ts-ignore
        isLeaf: treeNodeData.value.filter(treeItem => treeItem.pid === item.id).length <= 0,
      });
    }
  }
  return nodes;
}

const setTreeItemData = () => {
  const rootNodes = getTreeNode(props.parameter.appId);
  const parentNode = {title: props.parameter.appCode, key: props.parameter.appId, level: 0, data: {}, children: rootNodes} as TreeNodeModel;
  treeData.value = [parentNode];
  selectedKeys.value = [props.parameter.appId];
}

const loadTreeMore = (node: TreeNodeModel) => {
  return new Promise<void>((resolve) => {
    node.children = getTreeNode(node.key as string) as unknown as TreeNodeModel[];
    resolve();
  });
};

const searchKey = ref('');
const searchData = (keyword: string) => {
  const loop = (data: TreeNodeModel[]) => {
    const result: TreeNodeModel[] = [];
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

const buildTreeNodeList = (parentId: string) => {
  const items: QueryTreeNodeForm[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of treeNodeData.value) {
    // @ts-ignore
    if (item.pid === parentId) {
      items.push(Object.assign(item, {
        // @ts-ignore
        isLeaf: treeNodeData.value.filter(treeItem => treeItem.pid === item.id).length <= 0
      }) as unknown as QueryTreeNodeForm);
    }
  }

  return items;
}

const loadMore = (record: TableData, done: any) => {
  const items = buildTreeNodeList(record.id);
  done(items);
}

const treeClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  selectedData.value = data.node || {};
  if (selectedData.value?.level === 0) {
    treeNodeFilterData.value = buildTreeNodeList(selectedKey[0] as string);
  } else if (selectedData.value?.level === 1) {
    // @ts-ignore
    appPageFilterData.value = appPageData.value.filter(item => item.extend_id === selectedKey[0] as string);
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    appMetaList.value = cloneDeep(props.modelValue) || [];
    treeNodeData.value = (appMetaList.value.find(item => item.metaName === "platform_tree_node")?.metaData || []) as QueryTreeNodeForm[];
    // @ts-ignore
    treeNodeData.value.sort((a, b) => a.seq_no - b.seq_no);
    appPageData.value = (appMetaList.value.find(item => item.metaName === "platform_app_page")?.metaData || []) as PageQueryFilter[];
    setTreeItemData();
    treeNodeFilterData.value = buildTreeNodeList(props.parameter.appId);
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
          :load-more="loadTreeMore"
          :multiple="false"
          :show-line="false"
          @select="treeClickSelected">
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
      <a-table v-if="selectedData.level===0"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="treeNodeFilterData"
               :load-more="loadMore"
               :pagination="false"
               :scroll="{x: 780, y: scroll.y}"
               :scrollbar="scrollbar"
               :stripe="true"
               column-resizable
               row-key="id">
        <template #columns>
          <a-table-column :ellipsis="true" :tooltip="true" :width="360" data-index="text" title="标题">
            <template #cell="{ record }">
              &nbsp;<gl-iconfont :type="record.icon_type"/>
              {{ record.text }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="flag" title="分类">
            <template #cell="{ record }">
              {{ record.flag === 'menuItem' ? '菜单' : '' }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="type" title="类型">
            <template #cell="{ record }">
              {{ getOptionLabel(record.type, typeOptions) }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
        </template>
      </a-table>
      <a-table v-if="selectedData.level===1"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="appPageFilterData"
               :pagination="false"
               :scroll="{x: 1510, y: scroll.y}"
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
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="version" title="版本号"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="code" title="编码"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="type" title="类型"/>
          <a-table-column :ellipsis="true" :tooltip="false" :width="180" data-index="preview_content" title="预览">
            <template #cell="{ record }">
              <CopyToClipboard v-if="record.preview_content" :model-value="record.preview_content"/>
              {{ record.preview_content }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="false" :width="180" data-index="release_content" title="正文">
            <template #cell="{ record }">
              <CopyToClipboard v-if="record.release_content" :model-value="record.release_content"/>
              {{ record.release_content }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="false" :width="180" data-index="source_content" title="来源">
            <template #cell="{ record }">
              <CopyToClipboard v-if="record.source_content" :model-value="record.source_content"/>
              {{ record.source_content }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="description" title="说明"/>
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