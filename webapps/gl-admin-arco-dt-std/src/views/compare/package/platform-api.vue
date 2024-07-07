<script lang="ts">
export default {
  name: 'PlatformApiCompare'
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
  TreeLevelData,
  directions,
  queryCompareType,
  sortRenderData, getDiffData, objValueToArray,
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

// 页面 layout-sider 宽度
const layoutWidth = ref<number>(320);
const layoutHeight = ref<number>(props.height - 75);
// 树默认根节点
const rootNode = {title: "接口服务参数管理", key: 'root', level: 0, data: {}, children: [], retain: true};
// 对比组件ID
const diffId = ref<string>("diff-html-api-param");
// 解析的数据
const renderData = ref<TreeLevelData>({} as TreeLevelData);
const renderCompareData = ref<TreeLevelData>({} as TreeLevelData);

/**
 * 构建树数据，第二层节点
 * @param direction
 * @param record
 * @param data
 * @param compare
 */
const queryTreeSecondItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.second && data.second.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.second.filter(item => (item.api === record.key))) {
      const nodeData = {title: item.name, key: item.id, level: 2, mark: '参数', type: 0, data: item, children: [], subChange: false,}
      const {child, types, subsEdit} = queryTreeSecondItems(direction, nodeData, data, compare);
      // 判断是否修改
      const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
      isEditAtt.push(isEdit);
      // 类型
      const itemType = queryCompareType(item, compare.second || [], direction);
      // eslint-disable-next-line no-continue
      if (itemType === 4) continue;
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: child, subChange: isEdit, retain: true});
      items.push(nodeData);
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，第一层节点
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
    for (const item of data.first) {
      const nodeData = {title: item.name, key: item.id, level: 1, mark: '服务', type: 0, data: item, children: [], subChange: false,}
      const {child, types, subsEdit} = queryTreeSecondItems(direction, nodeData, data, compare);
      // 判断是否修改
      const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
      isEditAtt.push(isEdit);
      // 类型
      const itemType = queryCompareType(item, compare.first || [], direction);
      // eslint-disable-next-line no-continue
      if (itemType === 4) continue;
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: child, subChange: isEdit, retain: true});
      items.push(nodeData);
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，第零层节点（根节点）
 * @param direction
 * @param data
 * @param compare
 */
const queryTreeItems = (direction: string, data: TreeLevelData, compare: TreeLevelData) => {
  const parentNode = Object.assign(cloneDeep(rootNode), {title: `${directions(direction)} | ${rootNode.title}`});
  const {child, types, subsEdit} = queryTreeFirstItems(direction, parentNode, data, compare);
  // 判断是否修改
  const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
  emits("difference", isEdit ? 1 : 2);
  Object.assign(parentNode, {children: child, subChange: isEdit});

  return [parentNode];
}

/**
 * 数据解析
 * @param list
 * @param data
 */
const queryRenderData = (list: AppMeta[], data: TreeLevelData) => {
  data.first = list.find(item => item.metaName === "platform_api")?.metaData || [];
  sortRenderData(data.first, 'update_at|desc,del_status|asc');
  data.second = list.find(item => item.metaName === "platform_api_param")?.metaData || [];
  sortRenderData(data.second, 'update_at|asc,del_status|asc');
  // 层级和表对应
  data.level = {1: "platform_api", 2: "platform_api_param"};

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
  }
  // 计算布局高度
  layoutHeight.value = props.height - 75;
}, {deep: true, immediate: true});

const deploy = (successBack: any) => {
  const data: Record<string, any> = objValueToArray(renderData.value.level || {});
  getDiffData(renderData.value.tree || [], renderData.value.level || {}, data);
  if (successBack && typeof successBack === 'function') successBack(data);
}

defineExpose({deploy});
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