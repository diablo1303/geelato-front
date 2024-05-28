<script lang="ts">
export default {
  name: 'PlatformResourcesCompare'
};
</script>
<script lang="ts" setup>
import {PropType, ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {
  AppMeta,
  AppVersion,
  PageParams,
  TreeNodeModel,
  directions,
  queryCompareType,
  TreeLevelData, LayoutHeight, generateLayoutHeight,
} from "@/views/compare/type";
import VersionCompareIndex from "@/views/compare/index.vue";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Object as PropType<AppVersion>, default: () => ({} as AppVersion)},// 基准版本
  compareValue: {type: Object as PropType<AppVersion>, default: () => ({} as AppVersion)},// 对比版本
  parameter: {type: Object as PropType<PageParams>, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 页面是否显示
  height: {type: Number, default: 536}, // 列表 - 数据列表高度，滑动条高度
});

// 业务layout高度
const layoutSiderWidth = ref<number>(280);
const layoutHeight = ref<LayoutHeight>(generateLayoutHeight(props.height));
// 树参数
const rootNode = {title: "资源管理", key: 'root', level: 0, data: {}, children: []};
// 对比参数
const diffId = ref<string>("diff-html-resources");
// 原始数据
const renderData = ref<TreeLevelData>({} as TreeLevelData);
const renderCompareData = ref<TreeLevelData>({} as TreeLevelData);

/**
 * 构建树数据
 * @param direction 方向
 * @param data 原始数据
 * @param compare 对比数据
 */
const queryTreeFirstItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.first && data.first.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.first) {
      // 类型
      const itemType = queryCompareType(item, compare.first || [], direction);
      typeArr.push(itemType);
      // 构建节点
      items.push({title: item.name, key: item.id, level: 1, type: itemType, data: item, children: [],});
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，根节点（第零级）
 * @param direction
 * @param data
 * @param compare
 */
const queryTreeItems = (direction: string, data: TreeLevelData, compare: TreeLevelData) => {
  const parentNode = Object.assign(cloneDeep(rootNode), {title: `${directions(direction)} | ${rootNode.title}`});
  const {child} = queryTreeFirstItems(direction, parentNode, data, compare);
  Object.assign(parentNode, {children: child});

  return [parentNode];
}

/**
 * 来源数据处理
 * @param list
 * @param data
 */
const queryRenderData = (list: AppMeta[], data: TreeLevelData) => {
  data.first = list.find(item => item.metaName === "platform_resources")?.metaData || [];
  data.first.sort((a, b) => new Date(b.update_at).getTime() - new Date(a.update_at).getTime());

  return data;
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
    renderData.value.tree = queryTreeItems('left', renderData.value, renderCompareData.value);
    renderCompareData.value.tree = queryTreeItems('right', renderCompareData.value, renderData.value);
  }
  // 计算布局高度
  layoutHeight.value = generateLayoutHeight(props.height);
}, {deep: true, immediate: true});
</script>
<template>
  <VersionCompareIndex :layout-height="layoutHeight"
                       :left-data="renderData"
                       :model-value="diffId"
                       :right-data="renderCompareData"
                       :root-key="rootNode.key"
                       :root-title="rootNode.title"
                       :sider-width="layoutSiderWidth"/>
</template>