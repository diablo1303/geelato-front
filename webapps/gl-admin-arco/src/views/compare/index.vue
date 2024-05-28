<script lang="ts">
export default {
  name: 'VersionCompareIndex'
};
</script>
<script lang="ts" setup>
import {computed, PropType, ref, watch} from 'vue';
import {generateRandom} from "@/utils/strings";
import Diff2Html from "@/components/diff2html/index.vue";
import {
  DiffModel, LayoutHeight, TreeNodeModel, TreeLevelData,
  treeSearchLoop, generateDiffParams,
  treeClickFirstLevel, treeClickZerothLevel,
} from "@/views/compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ""},
  leftData: {type: Object as PropType<TreeLevelData>, default: () => ({} as TreeLevelData)},
  rightData: {type: Object as PropType<TreeLevelData>, default: () => ({} as TreeLevelData)},
  rootTitle: {type: String, default: "数据管理"}, // 根节点标题
  rootKey: {type: String, default: "root"}, // 根节点key
  siderWidth: {type: Number, default: 250},
  layoutHeight: {type: Object as PropType<LayoutHeight>, default: () => ({} as LayoutHeight)},
});

// 页面 layout-sider 宽度
const layoutSiderWidth = ref<number>(props.siderWidth);
// 页面 layout-sider,layout-content 高度
const layoutHeight = ref<LayoutHeight>(props.layoutHeight);
// 对比参数
const diffParams = ref<DiffModel>(generateDiffParams({
  id: props.modelValue || `diff-html-${generateRandom()}`, title: props.rootTitle,
}));
// 树参数
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([props.rootKey]);
const treeLeftData = ref<TreeNodeModel[]>(props.leftData.tree || []);
const treeRightData = ref<TreeNodeModel[]>(props.rightData.tree || []);
// 树搜索
const searchKey = ref<string>('');
// 树搜索，结果集
const originTreeLeftData = computed(() => {
  if (!searchKey.value) return treeLeftData.value;
  return treeSearchLoop(treeLeftData.value, searchKey.value);
});
const originTreeRightData = computed(() => {
  if (!searchKey.value) return treeRightData.value;
  return treeSearchLoop(treeRightData.value, searchKey.value);
});

/**
 * 树点击事件
 * @param direction 方向
 * @param node 节点数据
 */
const treeClickLevel = (direction: string, node: TreeNodeModel) => {
  Object.assign(diffParams.value, {title: node.title, newObject: {}, oldObject: {}});
  if (node?.level === 0) {
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
 * 右树点击事件
 * @param selectedKey
 * @param data
 */
const treeRightClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  treeClickLevel('right', data?.node as TreeNodeModel);
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

watch(() => props, (val) => {
  layoutSiderWidth.value = props.siderWidth || 230;
  layoutHeight.value = props.layoutHeight;
  selectedKeys.value = [];
  expandedKeys.value = [];
  treeLeftData.value = props?.leftData?.tree || [];
  treeRightData.value = props?.rightData?.tree || [];
  expandedKeys.value = [treeLeftData.value[0].key as string];
  diffParams.value = generateDiffParams({
    id: props.modelValue || `diff-html-${generateRandom()}`, title: props.rootTitle,
  });
}, {deep: true, immediate: true});
</script>
<template>
  <div class="layout-demo">
    <a-layout>
      <a-layout>
        <a-layout-sider :style="{width:`${layoutSiderWidth}px`}">
          <a-input-search v-model="searchKey" allow-clear class="tree-search" placeholder="搜索"/>
          <a-scrollbar id="left-scrollbar" :style="{overflow:'auto',height:`${layoutHeight.left}px`}">
            <a-tree v-model:expandedKeys="expandedKeys"
                    v-model:selectedKeys="selectedKeys"
                    :block-node="false"
                    :data="originTreeLeftData"
                    :default-expand-all="false"
                    :multiple="false"
                    :show-line="false"
                    @select="treeLeftClickSelected">
              <template #title="nodeData">
                <a-tooltip v-if="nodeData?.type===1" content="新增" position="left">
                  <icon-plus style="color: rgb(var(--success-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.type===2" content="修改" position="left">
                  <icon-edit style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.subChange===true" content="子项变更" position="left">
                  <icon-arrow-fall style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-button v-if="!!nodeData?.mark" class="list-action-button-default" type="outline">
                  {{ `${nodeData?.mark}` }}
                </a-button>
                {{ `${nodeData?.title}` }}
              </template>
              <template #extra="nodeData">
                <a-space v-if="nodeData.level===0">
                  <a-tooltip v-if="isUnfold" content="展开" position="top">
                    &nbsp;<icon-double-left style="color: rgb(var(--primary-6))" @click.stop="unfoldTree(true)"/>
                  </a-tooltip>
                  <a-tooltip v-else content="折叠" position="top">
                    &nbsp;<icon-double-down style="color: rgb(var(--primary-6))" @click.stop="unfoldTree(false)"/>
                  </a-tooltip>
                </a-space>
              </template>
            </a-tree>
          </a-scrollbar>
        </a-layout-sider>
        <a-layout-content>
          <a-scrollbar :style="{overflow:'auto',height:`${layoutHeight.center}px`}">
            <Diff2Html :model-value="diffParams.id"
                       :new-header="diffParams.newHeader"
                       :new-value="diffParams.newObject"
                       :old-header="diffParams.oldHeader"
                       :old-value="diffParams.oldObject"
                       :title="diffParams.title"/>
          </a-scrollbar>
        </a-layout-content>
        <a-layout-sider :style="{width:`${layoutSiderWidth}px`}">
          <a-input-search v-model="searchKey" allow-clear class="tree-search" placeholder="搜索"/>
          <a-scrollbar :style="{overflow:'auto',height:`${layoutHeight.right}px`}">
            <a-tree v-model:expandedKeys="expandedKeys"
                    v-model:selectedKeys="selectedKeys"
                    :block-node="false"
                    :data="originTreeRightData"
                    :default-expand-all="false"
                    :multiple="false"
                    :show-line="false"
                    @select="treeRightClickSelected">
              <template #title="nodeData">
                <a-tooltip v-if="nodeData?.type===2" content="修改" position="left">
                  <icon-edit style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.type===3" content="删除" position="left">
                  <icon-minus style="color: rgb(var(--danger-6))"/>
                </a-tooltip>
                <a-tooltip v-if="nodeData?.subChange===true" content="子项变更" position="left">
                  <icon-arrow-fall style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-button v-if="!!nodeData?.mark" class="list-action-button-default" type="outline">
                  {{ `${nodeData?.mark}` }}
                </a-button>
                {{ `${nodeData?.title}` }}
              </template>
            </a-tree>
          </a-scrollbar>
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
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