<script lang="ts">
export default {
  name: 'OrgTree'
}
</script>
<script lang="ts" setup>
import {computed, watch, ref, VNode} from 'vue';
import {Message, TreeNodeData} from "@arco-design/web-vue";
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {QueryOrgForm, queryTrees} from '@/api/security';

interface OrgTreeNode extends TreeNodeData {
  key?: string | number;
  title?: string;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  draggable?: boolean;
  isLeaf?: boolean;
  icon?: () => VNode;
  switcherIcon?: () => VNode;
  loadingIcon?: () => VNode;
  dragIcon?: () => VNode;
  children?: OrgTreeNode[];
  redundant?: QueryOrgForm
}

type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: Array<string | number>, default: []},
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  hasRoot: {type: Boolean, default: true},// 显示根目录
  rootSelected: {type: Boolean, default: false},// 根目录是否可选
  checkStrictly: {type: Boolean, default: true},// 是否取消父子节点关联
  maxCount: {type: Number, default: 0},// 可选数量
  height: {type: Number, default: 420},// 高度
});

const {t} = useI18n();
const rootPid = 'root';
const expandedKeys = ref<(string | number)[]>([]);
const selectedKeys = ref<(string | number)[]>(props.modelValue);

/**
 * 树tree，搜索
 * @param keyword
 */
const treeData = ref<OrgTreeNode[]>([]);
const searchKey = ref('');
const searchData = (keyword: string) => {
  const loop = (data: OrgTreeNode[]) => {
    const result: OrgTreeNode[] = [];
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
/**
 * 接口，从数据库获取字典信息
 */
const fetchOrgTree = async (params: QueryOrgForm = {pid: rootPid} as unknown as QueryOrgForm): Promise<OrgTreeNode[]> => {
  let treeOptions: OrgTreeNode[] = [];
  try {
    params.tenantCode = props.parameter?.tenantCode || '';
    params.status = 1;
    const {data} = await queryTrees(params);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      treeOptions.push({
        title: item.name,
        key: item.id,
        isLeaf: item.isLeaf === '1',
        redundant: item
      });
    }
  } catch (err) {
    treeOptions = [];
  }
  return treeOptions;
}
/**
 * 树事件，加载更多
 * @param nodeData OrgTreeNode
 */
const loadMore = (nodeData: OrgTreeNode) => {
  return new Promise<void>((resolve) => {
    fetchOrgTree({pid: `${nodeData.key}`} as unknown as QueryOrgForm).then((data) => {
      nodeData.children = data;
    });
    resolve();
  });
}
/**
 * 刷新第一层树，根目录
 * @param data OrgTreeNode[]
 */
const refreshTreeOne = (data: OrgTreeNode[]) => {
  const rootParent = {
    title: t('orgChooseBox.tree.root'),
    key: rootPid,
    selectable: props.rootSelected,
    checkable: false,
    disableCheckbox: false,
    children: data
  };
  treeData.value = props.hasRoot ? [rootParent] : [...data];
  const nodeData: OrgTreeNode = treeData.value[0];
  // 选中、展开
  expandedKeys.value = [nodeData.key ? nodeData.key.toString() : ''];
  // 展开第二层
  // eslint-disable-next-line no-restricted-syntax
  for (const item of ((props.hasRoot ? nodeData.children : treeData.value) || [])) {
    if (item.key) {
      expandedKeys.value.push(item.key.toString());
      loadMore(item);
    }
  }
}

/**
 * 页面加载完成后
 */
const loadedPage = () => {
  searchKey.value = '';
  fetchOrgTree().then((data) => {
    refreshTreeOne(data);
  });
}

const resetPage = () => {
  searchKey.value = '';
  fetchOrgTree().then((data) => {
    refreshTreeOne(data);
    // 选中、展开
    if (props.hasRoot && props.rootSelected) {
      selectedKeys.value = [rootPid];
      emits("update:modelValue", selectedKeys.value);
      emits('change', true, {});
    }
    if (props.checkStrictly === false && props.maxCount === 1) {
      selectedKeys.value = [];
      emits("update:modelValue", selectedKeys.value);
      emits('change', true, {});
    }
  });
}

/**
 * 搜索数据
 * @param orgs
 * @param childs
 */
const checkStrictlyiteration = (orgs: QueryOrgForm[], childs: OrgTreeNode[]) => {
  if (childs && childs.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of childs) {
      orgs.push(item.redundant || {} as QueryOrgForm);
      checkStrictlyiteration(orgs, item.children || []);
    }
  }
}
/**
 * 搜索数据
 * @param data
 */
const checkStrictlyFormat = (data: OrgTreeNode) => {
  const orgs: QueryOrgForm[] = [];
  if (props.checkStrictly === false) {
    if (data.key !== rootPid) {
      orgs.push(data.redundant || {} as QueryOrgForm);
      checkStrictlyiteration(orgs, data.children || []);
    }
  }

  return orgs;
}

/**
 * 点击树节点时触发
 * @param selectedKey
 * @param data
 */
const treeClickSelected = (selectedKes: Array<string | number>, data: {
  selected?: boolean;
  selectedNodes: OrgTreeNode[];
  node?: OrgTreeNode;
  e?: Event;
}) => {
  if (props.maxCount > 1 && selectedKes.length > props.maxCount) {
    selectedKeys.value = selectedKeys.value.splice(0, props.maxCount);
    Message.warning({content: t('orgChooseBox.tree.max.warn'), duration: 3 * 1000});
    return;
  }
  emits("update:modelValue", selectedKeys.value);
  emits('change', data.selected, data.node?.redundant, checkStrictlyFormat(data.node || {}));
}
/**
 * 点击树节点复选框时触发
 * @param checkedKeys
 * @param data
 */
const treeClickChecked = (checkedKeys: Array<string | number>, data: {
  checked?: boolean;
  checkedNodes: OrgTreeNode[];
  node?: OrgTreeNode;
  e?: Event;
  halfCheckedKeys: (string | number)[];
  halfCheckedNodes: OrgTreeNode[];
}) => {
  if (props.maxCount > 1 && checkedKeys.length > props.maxCount) {
    selectedKeys.value = selectedKeys.value.splice(0, props.maxCount);
    Message.warning({content: t('orgChooseBox.tree.max.warn'), duration: 3 * 1000});
    return;
  }
  emits("update:modelValue", selectedKeys.value);
  emits('change', data.checked, data.node?.redundant, checkStrictlyFormat(data.node || {}));
}

/**
 * 加载数据
 */
watch(() => props.modelValue, () => {
  selectedKeys.value = props.modelValue;
}, {immediate: true});

watch(() => props.visible, () => {
  if (props.visible === true) loadedPage();
}, {immediate: true});
</script>
<template>
  <span class="tree-layout">
    <a-input-search v-model="searchKey" :placeholder="$t('orgChooseBox.tree.search')" allow-clear class="tree-search"/>
    <a-scrollbar :style="{overflow:'auto',height:`${props.height}px`}">
      <a-tree
          v-model:checked-keys="selectedKeys"
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          :block-node="false"
          :check-strictly="checkStrictly"
          :checkable="(props.maxCount===1&&checkStrictly)?false:true"
          :data="originTreeData"
          :load-more="loadMore"
          :multiple="props.maxCount===1?false:true"
          :show-line="true"
          @check="treeClickChecked" @select="treeClickSelected">
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
        <template #extra="nodeData">
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <IconRefresh v-if="nodeData.key===rootPid" class="tree-extra-icon" @click="resetPage"/>
          </a-tooltip>
        </template>
      </a-tree>
    </a-scrollbar>
  </span>
</template>
<style lang="less" scoped>
.tree-extra-icon {
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}
</style>