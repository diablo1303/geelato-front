<script lang="ts">
export default {
  name: 'VersionCompareIndet'
};
</script>
<script lang="ts" setup>
import {computed, PropType, ref, watch} from 'vue';
import {generateRandom} from "@/utils/strings";
import Diff2Html from "@/components/diff2html/index.vue";
import {
  DiffModel, LayoutHeight, TreeNodeModel, TreeLevelData,
  treeSearchLoop, generateDiffParams,
  treeClickFirstLevel, treeClickZerothLevel, typeSelectOptions,
} from "@/views/compare/type";
import {fetchFileById} from "@/api/attachment";
import AppVersionList from "@/views/version/list.vue";
import AppVersionCompareTabs from "@/views/compare/tabsForm.vue";
import AppVersionTabs from "@/views/version/tabsForm.vue";
import type {SelectOptionData} from "@arco-design/web-vue";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ""},
  leftData: {type: Object as PropType<TreeLevelData>, default: () => ({} as TreeLevelData)},
  rightData: {type: Object as PropType<TreeLevelData>, default: () => ({} as TreeLevelData)},
  rootTitle: {type: String, default: "数据管理"}, // 根节点标题
  rootKey: {type: String, default: "root"}, // 根节点key
  layoutWidth: {type: Number, default: 250},
  layoutHeight: {type: Number, default: 600},
  treeHeight: {type: Number, default: 565},
});

const splitHeight = ref<number>(props.layoutHeight);
const splitMin = ref<number | string>(`${props.layoutWidth}px`);
const splitSize = ref<number | string>(splitMin.value);
// 对比参数
const diffParams = ref<DiffModel>(generateDiffParams({
  id: props.modelValue || `diff-html-${generateRandom()}`, title: props.rootTitle,
}));
// 树参数
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([props.rootKey]);
const treeLeftData = ref<TreeNodeModel[]>(props.leftData.tree || []);
// 树搜索
const searchKey = ref<string>('');
const selectKey = ref<string>('');
// 树搜索，结果集
const originTreeLeftData = computed(() => {
  if (!searchKey.value && !selectKey.value) return treeLeftData.value;
  return treeSearchLoop(treeLeftData.value, searchKey.value, selectKey.value);
});

/**
 * 树点击事件
 * @param direction 方向
 * @param node 节点数据
 */
const treeClickLevel = (direction: string, node: TreeNodeModel) => {
  Object.assign(diffParams.value, {title: node.title, newObject: {}, oldObject: {}});
  if (node?.level === 0) {
    diffParams.value.title = props.rootTitle;
    treeClickZerothLevel(direction, selectedKeys.value, node);
  } else if (node?.level === 1) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.first || [], props.rightData?.first || []);
  } else if (node?.level === 2) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.second || [], props.rightData?.second || []);
  } else if (node?.level === 3) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.third || [], props.rightData?.third || []);
  } else if (node?.level === 4) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.four || [], props.rightData?.four || []);
  } else if (node?.level === 5) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.fifth || [], props.rightData?.fifth || []);
  } else if (node?.level === 6) {
    treeClickFirstLevel(direction, selectedKeys.value, node, diffParams.value, props.leftData?.sixth || [], props.rightData?.sixth || []);
  }
  // 子项有修改，则父级展开树
  if (node?.subChange === true && !expandedKeys.value.includes(node.key as string)) {
    expandedKeys.value.push(node?.key as string);
  }
}

/**
 * 左树点击事件
 * @param selectedKey
 * @param data
 */
const treeLeftClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  treeClickLevel('left', data?.node as TreeNodeModel);
}

/**
 * 是否需要展开树
 */
const isUnfold = computed(() => {
  return expandedKeys.value.length === 0 || (expandedKeys.value.length === 1 && expandedKeys.value.includes(treeLeftData.value[0].key as string));
});
/**
 * 展开或折叠树
 * @param isFlod
 */
const unfoldTree = (isFlod: boolean) => {
  expandedKeys.value = [treeLeftData.value[0].key as string];
  if (isFlod) {
    const firstKeys = (props.leftData?.first || []).map(item => item.id);
    expandedKeys.value.push(...firstKeys);
  }
}

/**
 * 树删除或还原
 * @param nodeData
 * @param isDel
 */
const treeDelLoop = (nodeData: TreeNodeModel, isDel: boolean) => {
  nodeData.isDel = isDel;
  if (nodeData.children && nodeData.children.length > 0) {
    for (let i = 0; i < nodeData.children?.length; i += 1) {
      treeDelLoop(nodeData.children[i], isDel);
    }
  }
}

/**
 * 删除节点
 * @param nodeData
 */
const deleteTree = (nodeData: TreeNodeModel) => {
  treeDelLoop(nodeData, true);
  selectedKeys.value = [nodeData.key as string];
}

const deleteTooltip = (nodeData: TreeNodeModel) => {
  if (nodeData?.type === 0) {
    return '在基准版本中删除该记录';
  }
  if (nodeData?.type === 1) {
    return '在基准版本中删除该记录';
  }
  if (nodeData?.type === 2) {
    return "对比版本记录覆盖基准版本"
  }
  if (nodeData?.type === 3) {
    return "对比版本记录覆盖基准版本"
  }
  return '取消';
}

/**
 * 还原节点
 * @param nodeData
 */
const resetTree = (nodeData: TreeNodeModel) => {
  treeDelLoop(nodeData, false);
  selectedKeys.value = [nodeData.key as string];
}

watch(() => props, (val) => {
  splitHeight.value = props.layoutHeight;
  splitMin.value = `${props.layoutWidth}px`;
  splitSize.value = splitMin.value;
  selectedKeys.value = [];
  expandedKeys.value = [];
  treeLeftData.value = props?.leftData?.tree || [];
  expandedKeys.value = [treeLeftData.value[0].key as string];
  diffParams.value = generateDiffParams({
    id: props.modelValue || `diff-html-${generateRandom()}`, title: props.rootTitle,
  });
}, {deep: true, immediate: true});
</script>
<template>
  <div class="layout-demo">
    <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
      <template #first>
        <a-space style="width:100%;justify-content: center;">
          <a-input-search v-model="searchKey" :style="{width:`${layoutWidth-94}px`}" allow-clear class="tree-search" placeholder="搜索"/>
          <a-select v-model="selectKey" :options="typeSelectOptions" allow-clear placeholder="全部" style="width: 80px;"/>
        </a-space>
        <a-scrollbar id="left-scrollbar" :style="{overflow:'auto',height:`${treeHeight}px`}">
          <a-tree v-model:expandedKeys="expandedKeys"
                  v-model:selectedKeys="selectedKeys"
                  :block-node="false"
                  :data="originTreeLeftData"
                  :default-expand-all="false"
                  :multiple="false"
                  :show-line="false"
                  @select="treeLeftClickSelected">
            <template #title="nodeData">
              <span :class="`delete-${nodeData?.isDel}`" class="tree-title">
                <a-tooltip v-if="nodeData?.subChange===true" content="子项变更" position="left">
                  <icon-arrow-fall style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.type===1" content="新增" position="left">
                  <icon-plus style="color: rgb(var(--success-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.type===2" content="修改" position="left">
                  <icon-edit style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.type===3" content="删除" position="left">
                  <icon-minus style="color: rgb(var(--danger-6))"/>
                </a-tooltip>
                <a-button v-if="!!nodeData?.mark" :class="`mark-${nodeData?.type}`" class="list-action-button-default" type="outline">
                  {{ `${nodeData?.mark}` }}
                </a-button>
                {{ `${nodeData?.title}` }}
              </span>
            </template>
            <template #extra="nodeData">
              <a-space v-if="nodeData.level===0">
                <a-tooltip v-if="isUnfold" content="展开" position="top">
                  &nbsp;<icon-double-left style="color: rgb(var(--primary-6))" @click.stop="unfoldTree(true)"/>
                </a-tooltip>
                <a-tooltip v-else content="折叠" position="top">
                  &nbsp;<icon-double-down style="color: rgb(var(--primary-6))" @click.stop="unfoldTree(false)"/>
                </a-tooltip>
                <a-popconfirm content="是否还原所有删除的节点？" position="tr" type="warning" @ok="resetTree(nodeData)">
                  <a-tooltip content="批量还原" position="top">
                    &nbsp;<icon-clock-circle style="color: rgb(var(--success-6))"/>
                  </a-tooltip>
                </a-popconfirm>
              </a-space>
              <a-space v-if="nodeData.level>0">
                <a-popconfirm v-if="nodeData?.isDel===false" content="是否取消本次变更" position="tr" type="warning" @ok="deleteTree(nodeData)">
                  <a-tooltip :content="deleteTooltip(nodeData)" position="right">
                    &nbsp;<icon-delete style="color: rgb(var(--danger-6))"/>
                  </a-tooltip>
                </a-popconfirm>
                <a-popconfirm v-if="nodeData?.isDel===true" content="是否还原该节点？" position="tr" type="warning" @ok="resetTree(nodeData)">
                  <a-tooltip content="还原" position="right">
                    &nbsp;<icon-clock-circle style="color: rgb(var(--color-text-4))"/>
                  </a-tooltip>
                </a-popconfirm>
              </a-space>
            </template>
          </a-tree>
        </a-scrollbar>
      </template>
      <template #second>
        <a-scrollbar :style="{overflow:'auto',height:`${layoutHeight}px`}">
          <Diff2Html :model-value="diffParams.id"
                     :new-header="diffParams.newHeader"
                     :new-value="diffParams.newObject"
                     :old-header="diffParams.oldHeader"
                     :old-value="diffParams.oldObject"
                     :title="diffParams.title"/>
        </a-scrollbar>
      </template>
    </a-split>
  </div>
</template>

<style lang="less" scoped>
.tree-title.delete-true {
  color: var(--color-text-4);
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