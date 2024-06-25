<script lang="ts">
export default {
  name: 'PlatformSysConfigCompare'
};
</script>
<script lang="ts" setup>
import {PropType, ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {
  AppMeta,
  type AppVersion,
  PageParams,
  TreeNodeModel,
  directions,
  queryCompareType,
  TreeLevelData,
  sortRenderData, objValueToArray, getDiffData,
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
const rootNode = {title: "系统配置管理", key: 'root', level: 0, data: {}, children: [], retain: true};
// 对比参数
const diffId = ref<string>("diff-html-sys-config");
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
    for (const item of data.first) {
      // 类型
      const itemType = queryCompareType(item, compare.first || [], direction);
      // eslint-disable-next-line no-continue
      if (itemType === 4) continue;
      typeArr.push(itemType);
      // 构建节点
      items.push({title: item.config_key, key: item.id, level: 1, type: itemType, data: item, children: [], retain: true});
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
  const {child, types, subsEdit} = queryTreeFirstItems(direction, parentNode, data, compare);
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
  data.first = list.find(item => item.metaName === "platform_sys_config")?.metaData || [];
  sortRenderData(data.first, 'update_at|desc,del_status|asc');
  // 层级和表对应
  data.level = {1: "platform_sys_config"};

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