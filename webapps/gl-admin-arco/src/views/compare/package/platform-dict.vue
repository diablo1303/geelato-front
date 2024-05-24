<script lang="ts">
export default {
  name: 'PlatformDictCompare'
};
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import Diff2Html from "@/components/diff2html/index.vue";
import {AppMeta, AppVersion, DiffModel, directions, PageParams, TreeNodeModel, queryCompareType} from "@/views/compare/type";

type DataDictionary = {
  dict: Record<string, any>[];
  nape: Record<string, any>[];
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppVersion>, default: []},
  compareValue: {type: Array<AppVersion>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

// 树参数
const rootNode = {title: "数据字典管理", key: 'root', level: 0, data: {}, children: []};
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([rootNode.key]);
const treeLeftData = ref<TreeNodeModel[]>([]);
const treeRightData = ref<TreeNodeModel[]>([]);
// 对比参数
const diffParams = ref<DiffModel>({
  newHeader: directions('left'), oldHeader: directions('right'),
} as DiffModel);
// 原始数据
const renderData = ref<DataDictionary>({} as DataDictionary);
const renderCompareData = ref<DataDictionary>({} as DataDictionary);

/**
 * 构建树数据
 */
const queryTreeItems = (direction: string, data: DataDictionary, compare: DataDictionary) => {
  const dictItems = [];
  if (data.dict && data.dict.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const dictItem of data.dict) {
      // 字典项
      const napeItems = [];
      const typeArr: number[] = [];
      if (data.nape && data.nape.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const napeItem of data.nape.filter(item => item.dict_id === dictItem.id)) {
          const napeType = queryCompareType(napeItem, compare.nape, direction);
          typeArr.push(napeType);
          napeItems.push({
            title: napeItem.item_name, key: napeItem.id, level: 2, type: napeType, data: napeItem, children: [],
          });
        }
      }
      const isEdit = typeArr.includes(1) || typeArr.includes(2) || typeArr.includes(3);
      // 字典
      const dictType = queryCompareType(dictItem, compare.dict, direction);
      dictItems.push({
        title: dictItem.dict_name, key: dictItem.id, level: 1, type: dictType, data: dictItem, children: napeItems,
        subChange: isEdit,
      });
    }
  }
  const parent = Object.assign(cloneDeep(rootNode), {
    title: `${directions(direction)} | ${rootNode.title}`, children: dictItems
  });
  return [parent];
}

const treeClickZerothLevel = (direction: string, node: TreeNodeModel) => {
  selectedKeys.value = [node?.key as string];
  /* Object.assign(diffParams.value, {
    title: rootNode.title,
    newObject: treeLeftData.value[0].children,
    oldObject: treeRightData.value[0].children,
  }); */
}

const treeClickFirstLevel = (direction: string, node: TreeNodeModel, newData: Record<string, any>[], oldData: Record<string, any>[]) => {
  if (node.type === 1) { // 添加，左侧点击
    diffParams.value.newObject = node.data || {};
  } else if (node.type === 0 || node.type === 2) {// 修改
    selectedKeys.value = [node.key as string];
    if (direction === 'left') {
      Object.assign(diffParams.value, {
        newObject: node.data || {},
        oldObject: oldData.find(item => item.id === node?.key) || {}
      });
    } else if (direction === 'right') {
      Object.assign(diffParams.value, {
        newObject: newData.find(item => item.id === node?.key) || {},
        oldObject: node.data || {},
      });
    }
  } else if (node.type === 3) {// 删除,右侧点击
    diffParams.value.oldObject = node.data || {};
  }
}

const treeClickLevel = (direction: string, node: TreeNodeModel) => {
  Object.assign(diffParams.value, {title: node.title, newObject: {}, oldObject: {}});
  if (node?.level === 0) {
    treeClickZerothLevel(direction, node);
  } else if (node?.level === 1) {
    treeClickFirstLevel(direction, node, renderData.value.dict, renderCompareData.value.dict);
  } else if (node?.level === 2) {
    treeClickFirstLevel(direction, node, renderData.value.nape, renderCompareData.value.nape);
  }
  // 子项有修改，则父级展开树
  if (node?.subChange === true && !expandedKeys.value.includes(node.key as string)) {
    expandedKeys.value.push(node?.key as string);
  }
}

const treeLeftClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  treeClickLevel('left', data?.node as TreeNodeModel);
}

const treeRightClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  treeClickLevel('left', data?.node as TreeNodeModel);
}

const flodTree = (isFlod: boolean) => {
  expandedKeys.value = [rootNode.key];
  if (isFlod) {
    expandedKeys.value.push(...(renderData.value.dict.map(item => item.id) as string[]));
  }
}

const queryRenderData = (list: AppMeta[], data: DataDictionary) => {
  data.dict = list.find(item => item.metaName === "platform_dict")?.metaData || [];
  data.dict.sort((a, b) => new Date(b.update_at).getTime() - new Date(a.update_at).getTime());
  data.nape = list.find(item => item.metaName === "platform_dict_item")?.metaData || [];
  data.nape.sort((a, b) => a.seq_no - b.seq_no);
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // @ts-ignore
    const list = (cloneDeep(props.modelValue?.appMetaList) || []) as AppMeta[];
    queryRenderData(list, renderData.value);
    // @ts-ignore
    const compareList = (cloneDeep(props.compareValue?.appMetaList) || []) as AppMeta[];
    queryRenderData(compareList, renderCompareData.value);
    // 渲染树
    treeLeftData.value = queryTreeItems('left', renderData.value, renderCompareData.value) as TreeNodeModel[];
    treeRightData.value = queryTreeItems('right', renderCompareData.value, renderData.value) as TreeNodeModel[];
  }
}, {deep: true, immediate: true});
</script>
<template>
  <div class="layout-demo">
    <a-layout>
      <a-layout>
        <a-layout-sider style="width: 230px;">
          <a-scrollbar id="left-scrollbar" :style="{overflow:'auto',height:`${props.height-100}px`}">
            <a-tree v-model:selectedKeys="selectedKeys"
                    v-model:expandedKeys="expandedKeys"
                    :block-node="false"
                    :data="treeLeftData"
                    :default-expand-all="false"
                    :multiple="false"
                    :show-line="false"
                    @select="treeLeftClickSelected">
              <template #title="nodeData">
                <a-tooltip position="left" content="新增" v-if="nodeData?.type===1">
                  <icon-plus style="color: rgb(var(--success-6))"/>
                </a-tooltip>
                <a-tooltip position="left" content="修改" v-if="nodeData?.type===2">
                  <icon-edit style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip position="left" content="子项变更" v-if="nodeData?.subChange===true">
                  <icon-arrow-fall style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                {{ ` ${nodeData?.title}` }}
              </template>
              <template #extra="nodeData">
                <a-space v-if="nodeData.level===0">
                  <a-tooltip position="top" content="展开"
                             v-if="expandedKeys.length===0 || (expandedKeys.length===1&&expandedKeys.includes(rootNode.key))">
                    &nbsp;<icon-double-left style="color: rgb(var(--primary-6))" @click.stop="flodTree(true)"/>
                  </a-tooltip>
                  <a-tooltip position="top" content="收拢" v-else>
                    &nbsp;<icon-double-down style="color: rgb(var(--primary-6))" @click.stop="flodTree(false)"/>
                  </a-tooltip>
                </a-space>
              </template>
            </a-tree>
          </a-scrollbar>
        </a-layout-sider>
        <a-layout-content>
          <a-scrollbar :style="{overflow:'auto',height:`${props.height-80}px`}">
            <Diff2Html model-value="diff-html-dict"
                       :title="diffParams.title"
                       :new-value="diffParams.newObject"
                       :new-header="diffParams.newHeader"
                       :old-value="diffParams.oldObject"
                       :old-header="diffParams.oldHeader"/>
          </a-scrollbar>
        </a-layout-content>
        <a-layout-sider style="width: 230px;">
          <a-scrollbar :style="{overflow:'auto',height:`${props.height-100}px`}">
            <a-tree v-model:selectedKeys="selectedKeys"
                    v-model:expandedKeys="expandedKeys"
                    :block-node="false"
                    :data="treeRightData"
                    :multiple="false"
                    :show-line="false"
                    @select="treeRightClickSelected">
              <template #title="nodeData">
                <a-tooltip position="left" content="修改" v-if="nodeData?.type===2">
                  <icon-edit style="color: rgb(var(--primary-6))"/>
                </a-tooltip>
                <a-tooltip position="left" content="删除" v-if="nodeData?.type===3">
                  <icon-minus style="color: rgb(var(--danger-6))"/>
                </a-tooltip>
                {{ ` ${nodeData?.title}` }}
              </template>
            </a-tree>
          </a-scrollbar>
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
</style>