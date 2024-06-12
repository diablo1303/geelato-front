<script lang="ts">
export default {
  name: 'PlatformPageCompare'
};
</script>
<script lang="ts" setup>
import {computed, PropType, ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {
  AppMeta,
  AppVersion,
  PageParams,
  TreeNodeModel,
  parseJson,
  directions,
  queryCompareType,
  TreeLevelData,
  sortRenderData,
} from "@/views/compare/type";
import VersionCompareIndex from "@/views/compare/indet.vue";

const emits = defineEmits(['update:modelValue', 'difference']);
const props = defineProps({
  modelValue: {type: Object as PropType<AppVersion>, default: () => ({} as AppVersion)},// 基准版本
  compareValue: {type: Object as PropType<AppVersion>, default: () => ({} as AppVersion)},// 对比版本
  parameter: {type: Object as PropType<PageParams>, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 页面是否显示
  height: {type: Number, default: 536}, // 列表 - 数据列表高度，滑动条高度
});

// 业务layout高度
const layoutWidth = ref<number>(320);
const layoutHeight = ref<number>(props.height - 75);
// 树参数
const rootNode = {title: "菜单管理", key: 'root', level: 0, data: {}, children: []};
// 对比参数
const diffId = ref<string>("diff-html-tree-node-page");
// 原始数据
const renderData = ref<TreeLevelData>({} as TreeLevelData);
const renderCompareData = ref<TreeLevelData>({} as TreeLevelData);

/**
 * 构建树数据，数据链接节点（第一级）
 * @param direction
 * @param record
 * @param data
 * @param compare
 */
const queryTreeFirstItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.first && data.first.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.first.filter((item) => item.pid === record.key)) {
      const nodeData = {title: item.text, key: item.id, level: 1, type: 0, data: item, children: [], subChange: false,}
      const {child, types, subsEdit} = queryTreeFirstItems(direction, nodeData, data, compare);
      // 判断是否修改
      const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
      isEditAtt.push(isEdit);
      // 类型
      const itemType = queryCompareType(item, compare.first || [], direction);
      // eslint-disable-next-line no-continue
      if (itemType === 4) continue;
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: child, subChange: isEdit, isDel: false});
      items.push(nodeData);
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，根节点
 * @param direction
 * @param meta
 * @param data
 * @param compare
 */
const queryTreeItems = (direction: string, meta: AppVersion, data: TreeLevelData, compare: TreeLevelData) => {
  const parentNode = Object.assign(cloneDeep(rootNode), {
    title: `${directions(direction)} | ${rootNode.title}（${meta?.appCode}）`, key: `${meta?.sourceAppId}`
  });
  const {child, types, subsEdit} = queryTreeFirstItems('left', parentNode, data, compare);
  // 判断是否修改
  const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
  emits("difference", isEdit ? 1 : 2);
  Object.assign(parentNode, {children: child, subChange: isEdit});

  return [parentNode];
}

/**
 * 来源数据处理
 * @param list
 * @param data
 */
const queryRenderData = (list: AppMeta[], data: TreeLevelData) => {
  data.first = list.find(item => item.metaName === "platform_tree_node")?.metaData || [];
  const pageData: Record<string, any>[] = list.find(item => item.metaName === "platform_app_page")?.metaData || [];
  pageData.forEach(item => {
    item.preview_content = parseJson(item.preview_content);
    item.release_content = parseJson(item.release_content);
    item.source_content = parseJson(item.source_content);
  });
  data.first.forEach(item => {
    item.platformPage = pageData.filter(page => page.extend_id === item.id);
  });
  sortRenderData(data.first, 'seq_no|asc,del_status|asc');

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
    renderData.value.tree = queryTreeItems('left', props.modelValue, renderData.value, renderCompareData.value);
  }
  // 计算布局高度
  layoutHeight.value = props.height - 75;
}, {deep: true, immediate: true});
</script>
<template>
  <VersionCompareIndex :layout-height="layoutHeight"
                       :layout-width="layoutWidth"
                       :left-data="renderData"
                       :model-value="diffId"
                       :right-data="renderCompareData"
                       :root-key="rootNode.key"
                       :root-title="rootNode.title"
                       :tree-height="layoutHeight-35"/>
</template>