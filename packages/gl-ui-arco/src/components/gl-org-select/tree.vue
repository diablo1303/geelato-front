<script lang="ts">
export default {
  name: 'OrgTree'
}
</script>
<script lang="ts" setup>
import {computed, watch, ref} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {Message} from "@arco-design/web-vue";
import type {TreeNodeData} from "@arco-design/web-vue";
import type {QueryOrgForm} from "@geelato/gl-ui";
import {securityApi} from "@geelato/gl-ui";
import {queryTree} from "@geelato/gl-ui/src/m/datasource/Security";

class OrgTreeNode implements TreeNodeData {
  key?: string | number;
  title?: string;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  draggable?: boolean;
  isLeaf?: boolean;
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
  rootOrgId: {type: String, default: ''},// 根节点id
  rootSelected: {type: Boolean, default: false},// 根目录是否可选
  checkStrictly: {type: Boolean, default: true},// 是否取消父子节点关联
  maxCount: {type: Number, default: 0},// 可选数量
  height: {type: Number, default: 420},// 高度
});

const rootPid = 'root';
const expandedKeys = ref<(string | number)[]>([]);
const selectedKeys = ref<(string | number)[]>([]);

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
const fetchOrgTree = async (params: Record<string, any>): Promise<OrgTreeNode[]> => {
  let treeOptions: OrgTreeNode[] = [];
  try {
    params.tenantCode = props.parameter?.tenantCode || '';
    params.status = 1;
    const {data} = await securityApi.queryTree(params);
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
      if (props.maxCount === 1 && props.checkStrictly === false) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of nodeData.children) {
          if (!item.isLeaf) loadMore(item);
        }
      }
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
    title: '组织管理',
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
  const params = !!props.rootOrgId ? {id: props.rootOrgId} : {pid: rootPid};
  fetchOrgTree(params).then((data) => {
    refreshTreeOne(data);
  });
}

const resetPage = () => {
  searchKey.value = '';
  const params = !!props.rootOrgId ? {id: props.rootOrgId} : {pid: rootPid};
  fetchOrgTree(params).then((data) => {
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
 * 选中的数据
 * @param orgs
 * @param data
 */
const checkStrictlyChecked = (orgs: QueryOrgForm[], data: OrgTreeNode[]) => {
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (selectedKeys.value.includes(item.key as string)) {
        orgs.push(item.redundant || {} as QueryOrgForm);
      }
      checkStrictlyChecked(orgs, item.children || []);
    }
  }
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
    Message.warning({content: '超过最大选择量', duration: 3 * 1000});
    return;
  }
  // 特殊情况
  let formatData: QueryOrgForm[] = [];
  if (props.maxCount === 1 && props.checkStrictly === false) {
    formatData = checkStrictlyFormat(data.node || {}) || [];
    selectedKeys.value = [];
    formatData.forEach((item) => {
      selectedKeys.value.push(item.id);
    });
  }

  emits("update:modelValue", selectedKeys.value);
  emits('change', data.selected, data.node?.redundant, formatData);
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
    Message.warning({content: '超过最大选择量', duration: 3 * 1000});
    return;
  }
  // 特殊情况
  let formatData: QueryOrgForm[] = [];
  if (props.maxCount === 1 && props.checkStrictly === false) {
    const checkedData = checkStrictlyFormat(data.node || {}) || [];
    if (data.checked) {
      selectedKeys.value = [];
      checkedData.forEach((item) => {
        selectedKeys.value.push(item.id);
      });
      formatData = cloneDeep(checkedData);
    } else {
      checkedData.forEach((item) => {
        selectedKeys.value.filter((key) => key !== item.id);
      });
      checkStrictlyChecked(formatData, treeData.value);
    }
  }

  emits("update:modelValue", selectedKeys.value);
  emits('change', data.checked, data.node?.redundant, formatData);
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
    <a-input-search v-model="searchKey" allow-clear class="tree-search"
                    placeholder="搜索"/>
    <a-scrollbar :style="{overflow:'auto',height:`${height}px`}">
      <a-tree
          v-model:checked-keys="selectedKeys"
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          :block-node="false"
          :check-strictly="checkStrictly"
          :checkable="(maxCount===1&&checkStrictly)?false:true"
          :data="originTreeData"
          :load-more="loadMore"
          :multiple="maxCount===1?false:true"
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
          <a-tooltip content="刷新">
            <gl-iconfont v-if="nodeData.key===rootPid" class="tree-extra-icon" type="gl-refresh" @click="resetPage"/>
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