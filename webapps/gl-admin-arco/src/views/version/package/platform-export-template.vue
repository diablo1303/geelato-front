<script lang="ts">
export default {
  name: 'PlatformExportTemplateList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {TableColumnData, TableSortable} from '@arco-design/web-vue';
import {getOptionLabel, PageQueryFilter} from '@/api/base';
import {IconExport, IconFolder, IconImport} from "@arco-design/web-vue/es/icon";
import {QueryFileTemplateForm} from "@/api/template";
import {businessMetaDataValueComputeModeOptions, businessMetaDataValueTypeOptions} from "@/views/security/file/export/template";
import {businessMetaEvaluationOptions, businessRuleDataTypeOptions, businessTypeDataTypeOptions} from "@/views/security/file/import/template";
import {downloadFileByBase64String} from "@/api/attachment";
import {AppMeta, PageParams, TreeNodeModel} from "@/views/compare/type";
import cloneDeep from "lodash/cloneDeep";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  data: {type: Array<PageQueryFilter>, default: () => []}
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
const rootPid = 'root';
const roleTree = ref<TreeNodeModel[]>([]);
const selectedKeys = ref<string[]>([]);
const selectedData = ref<TreeNodeModel>({});
const renderData = ref<QueryFileTemplateForm[]>([]);
const activeKey = ref<number>(1);
const businessMetaData = ref<PageQueryFilter[]>([]);
const businessRuleData = ref<PageQueryFilter[]>([]);
const businessTypeData = ref<PageQueryFilter[]>([]);
/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('320px');
const splitSize = ref<number | string>(splitMin.value);

const setTreeItemData = () => {
  const roles = [];
  if (renderData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of renderData.value) {
      roles.push({
        title: item.title, key: item.id,
        // @ts-ignore
        icon: () => item.use_type === 'export' ? h(IconExport) : h(IconImport),
        level: 1, data: item, children: []
      });
    }
  }
  const parentDict = {title: '文件管理', key: rootPid, icon: () => h(IconFolder), level: 0, data: {}, children: roles};
  roleTree.value = [parentDict];
  selectedKeys.value = [rootPid];
}
const searchKey = ref('');
const searchData = (keyword: string) => {
  const loop = (data: TreeNodeModel[]) => {
    const result: TreeNodeModel[] = [];
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

  return loop(roleTree.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return roleTree.value;
  return searchData(searchKey.value);
});

const treeClickSelected = (selectedKey: (string | number)[], data: {
  selected?: boolean | undefined;
  selectedNodes: TreeNodeModel[];
  node?: TreeNodeModel | undefined;
  e?: Event | undefined;
}) => {
  selectedData.value = data.node || {};
  if (selectedData.value?.level === 0) {
    scroll.value.y = props.height - 135;
  } else if (selectedData.value?.level === 1) {
    scroll.value.y = props.height - 200;
    // @ts-ignore
    activeKey.value = selectedData.value?.data?.use_type === 'export' ? 1 : 2;
    // @ts-ignore
    businessMetaData.value = selectedData.value?.data?.business_meta_data ? JSON.parse(selectedData.value?.data?.business_meta_data) : [];
    // @ts-ignore
    businessRuleData.value = selectedData.value?.data?.business_rule_data ? JSON.parse(selectedData.value?.data?.business_rule_data) : [];
    // @ts-ignore
    businessTypeData.value = selectedData.value?.data?.business_type_data ? JSON.parse(selectedData.value?.data?.business_type_data) : [];
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    renderData.value = cloneDeep(props.data) as unknown as QueryFileTemplateForm[];
    // 树形数据
    setTreeItemData();
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
    <template #first>
<span class="tree-layout">
    <a-input-search v-model="searchKey" allow-clear class="tree-search" placeholder="搜索"/>
    <a-scrollbar :style="{overflow:'auto',height:`${props.height-110}px`}">
      <a-tree
          v-model:selectedKeys="selectedKeys"
          :block-node="false"
          :data="originTreeData"
          :multiple="false"
          :show-line="false"
          @select="treeClickSelected">
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
      </a-tree>
    </a-scrollbar>
  </span>
    </template>
    <template #second>
      <a-table v-if="!selectedKeys || (selectedKeys.length > 0 && selectedKeys[0] === rootPid)"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="renderData"
               :pagination="false"
               :scroll="{x: 70+180*8, y: scroll.y}"
               :scrollbar="scrollbar"
               :stripe="true"
               column-resizable
               row-key="id">
        <template #columns>
          <a-table-column :width="70" align="center" data-index="index" title="序号">
            <template #cell="{  rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="title" title="标题"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="use_type" title="用途"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="file_type" title="文件类型"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="file_code" title="分组编码"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="template" title="模板文件">
            <template #cell="{ record,item = record.template?JSON.parse(record.template):{} }">
              <a-button style="width: 18px;height: 18px;" type="text" @click="downloadFileByBase64String(record.template)">
                <template #icon>
                  <IconDownload/>
                </template>
              </a-button>
              {{ item.name }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="template_rule" title="模板文件源数据">
            <template #cell="{ record,item = record.template_rule?JSON.parse(record.template_rule):{} }">
              <a-button style="width: 18px;height: 18px;" type="text" @click="downloadFileByBase64String(record.template_rule)">
                <template #icon>
                  <IconDownload/>
                </template>
              </a-button>
              {{ item.name }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="描述"/>
        </template>
      </a-table>
      <a-tabs v-if="selectedData.level===1" v-model:active-key="activeKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
        <a-tab-pane v-if="selectedData.data?.use_type==='export'" :key="1" class="a-tabs-one" title="数据配置">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="businessMetaData"
                     :pagination="false"
                     :scroll="{x:2000, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :width="70" align="center" data-index="index" title="序号">
                  <template #cell="{  rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="placeholder" title="占位符"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="var" title="变量"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="listVar" title="列表变量"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="constValue" title="常量值"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="expression" title="表达式"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="valueType" title="值类型">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.valueType, businessMetaDataValueTypeOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="valueComputeMode" title="取值计算方式">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.valueComputeMode, businessMetaDataValueComputeModeOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="isList" title="是否列表"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="isMerge" title="是否合并"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="isUnique" title="合并唯一约束"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="isImage" title="是否图片"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="imageWidth" title="图片宽度cm"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="imageHeight" title="图片高度cm"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="description" title="备注"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane v-if="selectedData.data?.use_type==='import'" :key="2" class="a-tabs-one" title="模板字段定义">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="businessTypeData"
                     :pagination="false"
                     :scroll="{x: 980, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :width="70" align="center" data-index="index" title="序号">
                  <template #cell="{  rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="name" title="模板表头"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="type" title="数据类型">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.type, businessTypeDataTypeOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="format" title="格式"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="备注"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane v-if="selectedData.data?.use_type==='import'" :key="3" class="a-tabs-one" title="数据处理规则">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="businessRuleData"
                     :pagination="false"
                     :scroll="{x: 1380, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :width="70" align="center" data-index="order" title="序号">
                  <template #cell="{ record }">
                    {{ record.order }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="type" title="规则类型">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.type, businessRuleDataTypeOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="columnName" title="处理列名"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="rule" title="规则"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="goal" title="目标"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="retain" title="保留原值"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="说明"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane v-if="selectedData.data?.use_type==='import'" :key="4" class="a-tabs-one" title="数据保存配置">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="businessMetaData"
                     :pagination="false"
                     :scroll="{x: 1940, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :width="70" align="center" data-index="index" title="序号">
                  <template #cell="{  rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="tableName" title="模型名称"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="columnName" title="字段名称"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="evaluation" title="字段值">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.evaluation, businessMetaEvaluationOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="constValue" title="常量"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="variableValue" title="变量"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="expression" title="表达式"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="dictCode" title="数据字典"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="primaryValue" title="模型"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="remark" title="备注"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-split>
</template>

<style lang="less" scoped>
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>