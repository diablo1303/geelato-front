<script lang="ts">
export default {
  name: 'ModelTree'
};
</script>

<script lang="ts" setup>
import {ref, h, watch, computed, onMounted, onBeforeUnmount} from "vue";
import {useI18n} from "vue-i18n";
import {emitter} from "@geelato/gl-ui";
import {TreeNodeData} from "@arco-design/web-vue";
import {TreeNodeProps} from "@arco-design/web-vue/es/tree/interface";
import {IconFolder, IconLink} from '@arco-design/web-vue/es/icon';
import {QueryConnectForm, queryConnects, QueryTableForm, queryTables} from "@/api/model";
import {PageQueryRequest} from "@/api/base";

interface TreeNode extends TreeNodeProps {
  formData?: QueryConnectForm | QueryTableForm;
  children?: TreeNode[];
}

type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue', 'treeSelected']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  height: {type: Number, default: 420},// 高度
});

const {t} = useI18n();
const treeData = ref<TreeNode[]>([]);
const searchKey = ref('');
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const swap = ref<boolean>(true);
/**
 * 树tree，搜索
 * @param keyword
 */
const searchData = (keyword: string) => {
  const loop = (data: TreeNode[]) => {
    const result: TreeNode[] = [];
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
  if (!searchKey.value) return (treeData.value as TreeNodeData[]);
  return (searchData(searchKey.value) as TreeNodeData[]);
});
/**
 * 交换按钮，
 * @param item
 */
const swapConnect = (item: QueryConnectForm): string => {
  return `${swap.value ? `${item.dbConnectName} | ${item.dbName}` : item.dbName}`;
}
const swapTable = (item: QueryTableForm): string => {
  return swap.value ? `${item.title} | ${item.entityName || item.tableName}` : (item.entityName || item.tableName);
}
/**
 * 接口，获取数据连接
 * @param params
 */
const fetchConnects = async (params: PageQueryRequest = {current: 1, pageSize: 10000}): Promise<TreeNode[]> => {
  let treeOptions: TreeNode[] = [];
  try {
    const {data} = await queryConnects({
      ...params,
      appId: '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({
        formData: item,
        title: swapConnect(item),
        key: item.id,
        level: 1,
        icon: () => h(IconLink)
      } as unknown as TreeNode);
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 接口，获取数据表单
 * @param params
 */
const fetchTables = async (params: PageQueryRequest = {current: 1, pageSize: 10000}): Promise<TreeNode[]> => {
  let treeOptions: TreeNode[] = [];
  try {
    const {data} = await queryTables({
      ...params, order: 'entityName|asc',
      appId: '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({
        formData: item,
        title: swapTable(item),
        key: item.id,
        level: 2,
        isLeaf: true
      } as unknown as TreeNode);
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 树事件，加载更多
 * @param nodeData TreeNodeData
 */
const loadMore = (nodeData: TreeNodeData) => {
  return new Promise<void>((resolve) => {
    fetchTables({connectId: `${nodeData.key}`} as unknown as PageQueryRequest).then((data) => {
      nodeData.children = data;
    });
    resolve();
  });
}
/**
 * 树操作，第一层级，刷新
 * @param data TreeNode[]
 */
const refreshTreeOne = (data: TreeNode[]) => {
  treeData.value = [{
    title: t('model.connect.index.menu.list.searchTable'),
    key: '0',
    level: 0,
    icon: () => h(IconFolder),
    children: data
  } as unknown as TreeNode];
  const nodeData: TreeNode = treeData.value[0];
  const treeKey = nodeData.key ? nodeData.key.toString() : '';
  // 清理搜索框
  searchKey.value = '';
  // 选中、展开
  expandedKeys.value = [treeKey];
  selectedKeys.value = [treeKey];
  // 在加载一层
  // eslint-disable-next-line no-restricted-syntax
  const itemData = nodeData.children && nodeData.children[0];
  if (itemData && itemData.key) {
    expandedKeys.value.push(itemData.key.toString());
    loadMore(itemData);
  }
  console.log(nodeData);
  emits("treeSelected", treeKey, 0, {});
}

const refreshTreeTwo = (connectId: string, nodes: TreeNode[], isSelected: boolean, data: QueryTableForm) => {
  const parentData: TreeNode = treeData.value[0];
  parentData.key = parentData.key ? parentData.key.toString() : '';
  // eslint-disable-next-line no-restricted-syntax
  for (const item of parentData.children || []) {
    item.key = item.key ? item.key.toString() : '';
    if (item.key === connectId) {
      item.children = nodes;
      expandedKeys.value = [parentData.key, item.key];
      if (isSelected && nodes && nodes.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const node of nodes) {
          const form = node.formData as unknown as QueryTableForm;
          if (form.id === data.id || form.entityName === data.entityName) {
            selectedKeys.value = [form.id];
            console.log(node);
            emits("treeSelected", form.id, 2, form);
            break;
          }
        }
      } else {
        selectedKeys.value = [item.key];
        console.log(item);
        emits("treeSelected", item.key, 1, item.formData);
      }
      break;
    }
  }
}

/**
 * 树tree，点击事件，选中节点
 * @param selectedKey string
 * @param nodeData TreeNode
 */
const treeSelected = (selectedKey: string, nodeData: TreeNode) => {
  console.log(nodeData);
  emits("treeSelected", nodeData.key, nodeData.level, nodeData.formData);
}

/**
 * 树tree，点击事件，选中节点
 * @param selectedKey string
 * @param data TreeNode
 */
const treeClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNode[];
  node?: TreeNode | undefined;
  e?: Event | undefined;
}) => {
  treeSelected(selectedKey[0].toString(), data.node as unknown as TreeNode);
}
/**
 * 树操作，第一层级，刷新
 * @param nodeData
 */
const treeIconRefreshOne = (nodeData?: TreeNode) => {
  console.log("treeIconRefreshOne")
  fetchConnects().then((data) => {
    refreshTreeOne(data);
  });
}
/**
 * 树操作，交换
 * 数据连接 连接名称 <==> 数据库名
 * 数据表单 表单名称 <==> 表名
 * @param nodeData
 */
const treeIconSwapOne = (nodeData?: TreeNode) => {
  swap.value = !swap.value;
  fetchConnects().then((data) => {
    refreshTreeOne(data);
  });
}

const treeIconRefreshTwo = (data: QueryTableForm, isSelected: boolean) => {
  fetchTables({connectId: `${data.connectId}`} as unknown as PageQueryRequest).then((nodes) => {
    refreshTreeTwo(data.connectId, nodes, isSelected, data);
  });
}

watch(() => props.visible, () => {
  if (props.visible === true) {
    fetchConnects().then((data) => {
      refreshTreeOne(data);
    });
  }
}, {deep: true, immediate: true});

onMounted(() => {
  emitter.on("MODEL-TREE-REFRESH-ONE", () => {
    treeIconRefreshOne();
  });
  emitter.on("MODEL-TREE-REFRESH-TWO", (data) => {
    // @ts-ignore
    treeIconRefreshTwo(data.node as unknown as QueryTableForm, data.isSelected);
  });
});
onBeforeUnmount(() => {
  emitter.off("MODEL-TREE-REFRESH-ONE");
  emitter.off("MODEL-TREE-REFRESH-TWO");
});
</script>

<template>
  <a-input-search v-model="searchKey" :placeholder="$t('orgChooseBox.tree.search')" allow-clear/>
  <a-scrollbar :style="{overflow:'auto',height:`${props.height}px`}">
    <a-tree
        v-model:expanded-keys="expandedKeys"
        v-model:selected-keys="selectedKeys"
        :data="originTreeData"
        :load-more="loadMore"
        :show-line="true"
        @select="treeClickSelected">
      <template #title="nodeData">
        <template v-if="getMatchIndex(nodeData?.title) < 0">{{ nodeData?.title }}</template>
        <span v-else>{{ nodeData?.title?.substr(0, getMatchIndex(nodeData?.title)) }}
                  <span style="color: var(--color-primary-light-4);">{{
                      nodeData?.title?.substr(getMatchIndex(nodeData?.title), searchKey.length)
                    }}</span>
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length) }}
                </span>
      </template>
      <template #extra="nodeData">
        <a-tooltip :content="$t('searchTable.actions.refresh')">
          <IconRefresh v-if="nodeData.level===0" class="tree-extra-icon" @click="treeIconRefreshOne(nodeData)"/>
        </a-tooltip>
        <a-tooltip :content="$t('searchTable.actions.swap')">
          <IconSwap v-if="nodeData.level===0" class="tree-extra-icon" @click="treeIconSwapOne(nodeData)"/>
        </a-tooltip>
      </template>
    </a-tree>
  </a-scrollbar>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
  position: relative;
}

.general-card1 .list-item1 {
  cursor: pointer;
  padding: 10px 10px !important;
}

.general-card1 .list-item1.active {
  background-color: var(--color-fill-3);
  color: rgb(var(--primary-6));
}

.arco-btn {
  border-radius: 6px;
}

.arco-btn-size-medium {
  /* padding: 0 8px; */
}

.general-card > .arco-tabs-content {
  padding: 10px 0px 0px 10px;
}

.general-card1 > .arco-card-body > .arco-row:first-child {
  height: auto;
  padding: 20px;
  border: none;
}

.general-card1 > .arco-card-body > .arco-row > .arco-col > .arco-spin {
  flex: 1;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5715;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.form {
  width: 500px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.tree-extra-icon {
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}
</style>