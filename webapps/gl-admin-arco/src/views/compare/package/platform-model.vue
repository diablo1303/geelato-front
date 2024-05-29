<script lang="ts">
export default {
  name: 'PlatformModelCompare'
};
</script>
<script lang="ts" setup>
import {PropType, ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {
  AppMeta,
  AppVersion,
  PageParams,
  LayoutHeight,
  TreeNodeModel,
  parseJson,
  directions,
  queryCompareType,
  generateLayoutHeight, TreeLevelData,
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
const layoutSiderWidth = ref<number>(340);
const layoutHeight = ref<LayoutHeight>(generateLayoutHeight(props.height));
// 树参数
const rootNode = {title: "模型管理", key: 'root', level: 0, data: {}, children: []};
// 对比参数
const diffId = ref<string>("diff-html-connect-table-column");
// 原始数据
const renderData = ref<TreeLevelData>({} as TreeLevelData);
const renderCompareData = ref<TreeLevelData>({} as TreeLevelData);

/**
 * 构建树数据，外键节点（第五级）
 * @param direction
 * @param record
 * @param data
 * @param compare
 */
const queryTreeFifthItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.fifth && data.fifth.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.fifth.filter(item => item.main_table === record.data?.table_name && item.main_table_col === record.data?.column_name)) {
      // 类型
      const itemType = queryCompareType(item, compare.fifth || [], direction);
      typeArr.push(itemType);
      // 构建节点
      items.push({
        title: `${item.foreign_table} ${item.foreign_table_col}`,
        key: item.id, level: 5, mark: '外键', type: itemType, data: item, children: [], subChange: false,
      });
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，模型字段节点（第四级）
 * @param direction
 * @param record
 * @param data
 * @param compare
 */
const queryTreeFourItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.four && data.four.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.four.filter(item => item.table_name === record.data?.entity_name && item.table_id === record.key)) {
      const nodeData = {
        title: `${item.title} ${item.column_name}`,
        key: item.id, level: 4, mark: '字段', type: 0, data: item, children: [], subChange: false,
      }
      const {child, types, subsEdit} = queryTreeFifthItems(direction, nodeData, data, compare);
      // 判断是否修改
      const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
      isEditAtt.push(isEdit);
      // 类型
      const itemType = queryCompareType(item, compare.four || [], direction);
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: child, subChange: isEdit,});
      items.push(nodeData);
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，模型视图节点（第三级）
 * @param direction
 * @param record
 * @param data
 * @param compare
 */
const queryTreeThirdItems = (direction: string, record: TreeNodeModel, data: TreeLevelData, compare: TreeLevelData) => {
  const items: TreeNodeModel[] = []; // 子节点集合
  const typeArr: number[] = []; // 子节点类型集合
  const isEditAtt: boolean[] = []; // 子节点下属是否修改了
  if (data && data.third && data.third.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data.third.filter(item => item.connect_id === record.data?.connect_id && item.entity_name === record.data?.entity_name)) {
      // 类型
      const itemType = queryCompareType(item, compare.third || [], direction);
      typeArr.push(itemType);
      // 构建节点
      items.push({
        title: `${item.title} ${item.view_name}`,
        key: item.id, level: 3, mark: '视图', type: itemType, data: item, children: [], subChange: false,
      });
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

/**
 * 构建树数据，数据模型节点（第二级）
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
    for (const item of data.second.filter(item => item.connect_id === record.key)) {
      const nodeData = {
        title: `${item.title} ${item.entity_name}`,
        key: item.id, level: 2, mark: '模型', type: 0, data: item, children: [], subChange: false,
      }
      const viewBack = queryTreeThirdItems(direction, nodeData, data, compare);
      const viewIsEdit = viewBack.types.includes(1) || viewBack.types.includes(2) || viewBack.types.includes(3) || viewBack.subsEdit.includes(true);
      const columnBack = queryTreeFourItems(direction, nodeData, data, compare);
      const columnIsEdit = columnBack.types.includes(1) || columnBack.types.includes(2) || columnBack.types.includes(3) || columnBack.subsEdit.includes(true);
      // 判断是否修改
      isEditAtt.push(...[viewIsEdit, columnIsEdit]);
      // 类型
      const itemType = queryCompareType(item, compare.second || [], direction);
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: [...viewBack.child, ...columnBack.child], subChange: viewIsEdit || columnIsEdit,});
      items.push(nodeData);
    }
  }

  return {child: items, types: typeArr, subsEdit: isEditAtt};
}

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
      const nodeData = {
        title: `${item.db_connect_name} ${item.db_name}`,
        key: item.id, level: 1, mark: '链接', type: 0, data: item, children: [], subChange: false,
      }
      const {child, types, subsEdit} = queryTreeSecondItems(direction, nodeData, data, compare);
      // 判断是否修改
      const isEdit = types.includes(1) || types.includes(2) || types.includes(3) || subsEdit.includes(true);
      isEditAtt.push(isEdit);
      // 类型
      const itemType = queryCompareType(item, compare.first || [], direction);
      typeArr.push(itemType);
      // 构建节点
      Object.assign(nodeData, {type: itemType, children: child, subChange: isEdit,});
      items.push(nodeData);
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
  data.first = list.find(item => item.metaName === "platform_dev_db_connect")?.metaData || [];
  data.first.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
  data.second = list.find(item => item.metaName === "platform_dev_table")?.metaData || [];
  data.second.sort((a, b) => a.entity_name > b.entity_name ? 1 : -1);
  data.third = list.find(item => item.metaName === "platform_dev_view")?.metaData || [];
  data.third.forEach(item => {
    item.view_column = parseJson(item.view_column);
  });
  data.third.sort((a, b) => a.view_name > b.view_name ? 1 : -1);
  data.four = list.find(item => item.metaName === "platform_dev_column")?.metaData || [];
  data.four.sort((a, b) => a.ordinal_position - b.ordinal_position);
  data.fifth = list.find(item => item.metaName === "platform_dev_table_foreign")?.metaData || [];
  data.fifth.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

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