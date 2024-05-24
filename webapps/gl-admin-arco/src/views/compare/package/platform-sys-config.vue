<script lang="ts">
export default {
  name: 'PlatformSysConfigCompare'
};
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {diffJson} from "diff";
import Diff2Html from "@/components/diff2html/index.vue";
import {AppMeta, AppVersion, DiffModel, directions, PageParams, TreeNodeModel} from "@/views/compare/type";
import {generateRandom} from "@/utils/strings";

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
const rootNode = {title: "系统配置管理", key: 'root', level: 0, data: {}, children: []};
const selectedKeys = ref<string[]>([]);
const treeLeftData = ref<TreeNodeModel[]>([]);
const treeRightData = ref<TreeNodeModel[]>([]);
// 对比参数
const diffParams = ref<DiffModel>({
  newHeader: directions('left'), oldHeader: directions('right'),
} as DiffModel);
// 原始数据
const renderData = ref<Record<string, any>[]>([]);
const renderCompareData = ref<Record<string, any>[]>([]);

/**
 *  0 相同,1 新增,2 编辑,3 删除
 * @param record
 * @param data
 */
const queryCompareType = (record: Record<string, any>, data: Record<string, any>[], direction: string): number => {
  if (data && data.length > 0) {
    const isExist = data.find(item => item.id === record.id);
    if (isExist && typeof isExist === 'object') {
      const isCompare = diffJson(JSON.stringify(isExist), JSON.stringify(record));
      if (isCompare && isCompare.length >= 2) {
        return 2;
      }
      return 0;
    }
    return direction === 'right' ? 3 : 1;// 不存在为：新增
  }
  return direction === 'right' ? 3 : 1;// 不存在为：新增
}

/**
 * 构建树数据
 */
const queryTreeItems = (direction: string, data: Record<string, any>[], compare: Record<string, any>[]) => {
  const items = [];
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      const compareType = queryCompareType(item, compare, direction);
      items.push({
        title: item.config_key, key: item.id, level: 1, type: compareType, data: item, children: [],
      });
    }
  }
  const parent = Object.assign(cloneDeep(rootNode), {
    title: `${directions(direction)} | ${rootNode.title}`, children: items
  });
  return [parent];
}

const treeLeftClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  const node = data?.node as TreeNodeModel;
  Object.assign(diffParams.value, {title: node.title, newObject: {}, oldObject: {}});
  if (data?.node?.level === 0) {
    selectedKeys.value = [data?.node?.key as string];
    Object.assign(diffParams.value, {
      title: rootNode.title,
      newObject: renderData.value,
      oldObject: renderCompareData.value
    });
  } else if (data?.node?.level === 1) {
    if (node.type === 1) { // 添加
      diffParams.value.newObject = node.data || {};
    } else if (node.type === 0 || node.type === 2) {// 修改
      selectedKeys.value = [node.key as string];
      Object.assign(diffParams.value, {
        newObject: node.data || {},
        oldObject: renderCompareData.value.find(item => item.id === data?.node?.key) || {}
      });
    }
  }
}

const treeRightClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  const node = data?.node as TreeNodeModel;
  Object.assign(diffParams.value, {title: node.title, newObject: {}, oldObject: {}});
  if (data?.node?.level === 0) {
    selectedKeys.value = [data?.node?.key as string];
    Object.assign(diffParams.value, {
      title: rootNode.title,
      newObject: renderData.value,
      oldObject: renderCompareData.value
    });
  } else if (data?.node?.level === 1) {
    if (node.type === 0 || node.type === 2) {// 修改
      selectedKeys.value = [node.key as string];
      Object.assign(diffParams.value, {
        newObject: renderData.value.find(item => item.id === data?.node?.key) || {},
        oldObject: node.data || {}
      });
    } else if (node.type === 3) {// 删除
      diffParams.value.oldObject = node.data || {};
    }
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // @ts-ignore
    const list = (cloneDeep(props.modelValue?.appMetaList) || []) as AppMeta[];
    renderData.value = list.find(item => item.metaName === "platform_sys_config")?.metaData || [];
    renderData.value.sort((a, b) => new Date(b.update_at).getTime() - new Date(a.update_at).getTime());
    // @ts-ignore
    const compareList = (cloneDeep(props.compareValue?.appMetaList) || []) as AppMeta[];
    renderCompareData.value = compareList.find(item => item.metaName === "platform_sys_config")?.metaData || [];
    renderCompareData.value.sort((a, b) => new Date(b.update_at).getTime() - new Date(a.update_at).getTime());
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
          <a-scrollbar :style="{overflow:'auto',height:`${props.height-100}px`}">
            <a-tree v-model:selectedKeys="selectedKeys"
                    :block-node="false"
                    :data="treeLeftData"
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
                {{ ` ${nodeData?.title}` }}
              </template>
            </a-tree>
          </a-scrollbar>
        </a-layout-sider>
        <a-layout-content>
          <a-scrollbar :style="{overflow:'auto',height:`${props.height-80}px`}">
            <Diff2Html model-value="diff-html-sys-config"
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