<script lang="ts">
export default {
  name: 'PlatformModelList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import type {TableColumnData, TableData, TableSortable} from '@arco-design/web-vue';
import {IconCalendar, IconFolder, IconLink, IconTags} from '@arco-design/web-vue/es/icon';
import type {
  PageQueryFilter,
  QueryConnectForm,
  QueryTableColumnForm,
  QueryTableForeignForm,
  QueryTableForm,
  QueryViewForm,
  QueryPermissionForm,
  QueryRoleForm,
  QueryRolePermissionForm
} from '@geelato/gl-ui';
import type {AppMeta, PageParams, TreeNodeModel} from "../../compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  devColumn: {type: Array<PageQueryFilter>, default: () => []},
  devDbConnect: {type: Array<PageQueryFilter>, default: () => []},
  devTable: {type: Array<PageQueryFilter>, default: () => []},
  devTableForeign: {type: Array<PageQueryFilter>, default: () => []},
  devView: {type: Array<PageQueryFilter>, default: () => []},
  permission: {type: Array<PageQueryFilter>, default: () => []},
  role: {type: Array<PageQueryFilter>, default: () => []},
  rolePermission: {type: Array<PageQueryFilter>, default: () => []},
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 2000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  columnName: {sortDirections: ['descend', 'ascend'], sorter: false},
  entityName: {sortDirections: ['descend', 'ascend'], sorter: false},
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false},
});
const appMetaList = ref<AppMeta[]>([]);
const rootPid = 'root';
const modelTree = ref<TreeNodeModel[]>([]);
const selectedKeys = ref<string[]>([]);
const selectedData = ref<TreeNodeModel>({});
// 基础数据
const connectData = ref<QueryConnectForm[]>([]);
const tableData = ref<QueryTableForm[]>([]);
const columnData = ref<QueryTableColumnForm[]>([]);
const viewData = ref<QueryViewForm[]>([]);
const foreignData = ref<QueryTableForeignForm[]>([]);
const roleData = ref<QueryRoleForm[]>([]);
const permissionData = ref<QueryPermissionForm[]>([]);
const rolePermissionData = ref<QueryRolePermissionForm[]>([]);
// 过滤数据
const tableFilterData = ref<QueryTableForm[]>([]);
const columnFilterData = ref<QueryTableColumnForm[]>([]);
const viewFilterData = ref<QueryViewForm[]>([]);
const foreignFilterData = ref<QueryTableForeignForm[]>([]);
const tPermissionFilterData = ref<QueryPermissionForm[]>([]);
const tablePermissionFilterData = ref<Record<string, any>[]>([]);
const cPermissionFilterData = ref<QueryPermissionForm[]>([]);
const columnPermissionFilterData = ref<Record<string, any>[]>([]);

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('400px');
const splitSize = ref<number | string>(splitMin.value);

const setModelTreeData = () => {
  const connects = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const connectItem of connectData.value) {
    const tables = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tableItem of tableData.value) {
      // @ts-ignore
      // eslint-disable-next-line no-continue
      if (tableItem.connect_id !== connectItem.id) continue;
      const views = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const viewItem of viewData.value) {
        // @ts-ignore
        // eslint-disable-next-line no-continue
        if (viewItem.connect_id !== tableItem.connect_id || viewItem.entity_name !== tableItem.entity_name) continue;
        // @ts-ignore
        views.push({title: `${viewItem.title} | ${viewItem.view_name}`, key: viewItem.id, icon: () => h(IconTags), level: 3, data: viewItem});
      }
      tables.push({
        // @ts-ignore
        title: `${tableItem.title} | ${tableItem.entity_name}`,
        key: tableItem.id,
        level: 2,
        icon: () => h(IconCalendar),
        data: tableItem,
        children: views
      });
    }
    connects.push({
      // @ts-ignore
      title: `${connectItem.db_connect_name} | ${connectItem.db_name}`,
      key: connectItem.id,
      level: 1,
      icon: () => h(IconLink),
      data: connectItem,
      children: tables
    });
  }
  const parentDict = {title: '数据链接', key: 'root', level: 0, icon: () => h(IconFolder), children: connects};
  modelTree.value = [parentDict];
  selectedKeys.value = [rootPid];
}
const searchKey = ref('');
const searchData = (keyword: string) => {
  const loop = (data: TreeNodeModel[]) => {
    const result: TreeNodeModel[] = [];
    data.forEach(item => {
      // @ts-ignore
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

  return loop(modelTree.value);
}
const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
const originTreeData = computed(() => {
  if (!searchKey.value) return modelTree.value;
  return searchData(searchKey.value);
});

const buildTablePermission = () => {
  const options: Record<string, any>[] = [];
  if (roleData.value.length > 0 && tPermissionFilterData.value.length > 0 && rolePermissionData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const roleItem of roleData.value) {
      const option: Record<string, any> = {name: roleItem.name, weight: roleItem.weight};
      // eslint-disable-next-line no-restricted-syntax
      for (const permissionItem of tPermissionFilterData.value) {
        option[permissionItem.id] = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const rolePermissionItem of rolePermissionData.value) {
          // @ts-ignore
          if (rolePermissionItem.role_id === roleItem.id && rolePermissionItem.permission_id === permissionItem.id) {
            option[permissionItem.id] = true;
          }
        }
      }
      options.push(option);
    }
  }
  tablePermissionFilterData.value = options;
}

const buildColumnPermission = () => {
  const options: Record<string, any>[] = [];
  if (roleData.value.length > 0 && cPermissionFilterData.value.length > 0 && rolePermissionData.value.length > 0 && columnFilterData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const roleItem of roleData.value) {
      const option: Record<string, any> = {name: roleItem.name, weight: roleItem.weight};
      // eslint-disable-next-line no-restricted-syntax
      for (const columnItem of columnFilterData.value) {
        option[columnItem.id] = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const permissionItem of cPermissionFilterData.value) {
          // @ts-ignore
          if (permissionItem.object === `${columnItem.table_name}:${columnItem.column_name}`) {
            // eslint-disable-next-line no-restricted-syntax
            for (const rolePermissionItem of rolePermissionData.value) {
              // @ts-ignore
              if (rolePermissionItem.role_id === roleItem.id && rolePermissionItem.permission_id === permissionItem.id) {
                option[columnItem.id] = permissionItem.rule;
              }
            }
          }
        }
      }
      options.push(option);
    }
  }
  columnPermissionFilterData.value = options;
}

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
    scroll.value.y = props.height - 135;
    // @ts-ignore
    tableFilterData.value = tableData.value.filter(item => item.connect_id === selectedData.value?.data?.id);
  } else if (selectedData.value?.level === 2) {
    scroll.value.y = props.height - 200;
    // @ts-ignore
    columnFilterData.value = columnData.value.filter(item => item.table_id === selectedData.value?.data?.id);
    // @ts-ignore
    foreignFilterData.value = foreignData.value.filter(item => item.main_table === selectedData.value?.data?.entity_name);
    // @ts-ignore
    viewFilterData.value = viewData.value.filter(item => item.connect_id === selectedData.value?.data?.connect_id && item.entity_name === selectedData.value?.data?.entity_name);
    // @ts-ignore
    tPermissionFilterData.value = permissionData.value.filter(item => item.object === selectedData.value?.data?.entity_name && ['dp', 'mp'].includes(item.type));
    buildTablePermission();
    // @ts-ignore
    cPermissionFilterData.value = permissionData.value.filter(item => item.object.startsWith(`${selectedData.value?.data?.entity_name}:`) && ['cp'].includes(item.type));
    buildColumnPermission();
  } else if (selectedData.value?.level === 3) {
    scroll.value.y = props.height - 200;
    // @ts-ignore
    columnFilterData.value = selectedData.value?.data?.view_column ? JSON.parse(selectedData.value?.data?.view_column) : [];
    // @ts-ignore
    tPermissionFilterData.value = permissionData.value.filter(item => item.object === selectedData.value?.data?.view_name && ['dp', 'mp'].includes(item.type));
    buildTablePermission();
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    connectData.value = cloneDeep(props.devDbConnect) as unknown as QueryConnectForm[];
    tableData.value = cloneDeep(props.devTable) as unknown as QueryTableForm[];
    columnData.value = cloneDeep(props.devColumn) as unknown as QueryTableColumnForm[];
    viewData.value = cloneDeep(props.devView) as unknown as QueryViewForm[];
    foreignData.value = cloneDeep(props.devTableForeign) as unknown as QueryTableForeignForm[];
    setModelTreeData();

    roleData.value = cloneDeep(props.role) as unknown as QueryRoleForm[];
    roleData.value.sort((a, b) => b.weight - a.weight);
    permissionData.value = cloneDeep(props.permission) as unknown as QueryPermissionForm[];
    rolePermissionData.value = cloneDeep(props.rolePermission) as unknown as QueryRolePermissionForm[];
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
    <template #first>
<span class="tree-layout">
    <a-input-search v-model="searchKey" allow-clear class="tree-search" placeholder="搜索"/>
    <a-scrollbar :style="{overflow:'auto',height:`${props.height-125}px`}">
      <a-tree
          v-model:selectedKeys="selectedKeys"
          :block-node="true"
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
               :data="connectData"
               :pagination="false"
               :scroll="{x: 160+180*8, y: scroll.y}"
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
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_connect_name" title="链接名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_name" title="数据库名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_type" title="数据库类型"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_schema" title="数据库模式"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_hostname_ip" title="主机名或IP"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_port" title="连接端口"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="db_user_name" title="用户名"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
        </template>
      </a-table>
      <a-table v-if="selectedData.level===1"
               :bordered="{cell:true}"
               :columns="([] as TableColumnData[])"
               :data="tableFilterData"
               :pagination="false"
               :scroll="{x: 160+180*10, y: scroll.y}"
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
          <a-table-column :ellipsis="true" :sortable="sortable.entityName" :tooltip="true" :width="180" data-index="entity_name" title="实体名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="title" title="名称(中文)"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="table_type" title="表格类型"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="app_id" title="所属应用"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="source_type" title="来源"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="pack_bus_data" title="打包业务数据"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="seq_no" title="排序"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="补充描述"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="table_comment" title="数据库注释"/>
        </template>
      </a-table>
      <a-tabs v-if="selectedData.level===2" :default-active-tab="1" :lazy-load="true" position="top" type="line">
        <a-tab-pane :key="1" class="a-tabs-one" title="模型字段">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="columnFilterData as Record<string,any>[]"
                     :pagination="false"
                     :scroll="{x: 70+180*18, y: scroll.y}"
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
                <a-table-column :ellipsis="true" :sortable="sortable.columnName" :tooltip="true" :width="180" data-index="column_name" title="字段标识"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="title" title="名称(中文)"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="field_name" title="名称(英文)"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="select_type" title="数据类型"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="character_maxinum_length" title="长度"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="numeric_precision" title="整数位"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="numeric_scale" title="小数位"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="encrypted" title="是否加密"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="is_nullable" title="是否可空"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="column_key" title="是否主键"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="is_unique" title="唯一约束"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="numeric_signed" title="是否有符号"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="column_type" title="数据约束"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="default_value" title="默认值"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="extraValue" title="默认字段"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="ordinal_position" title="次序"/>
                <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="column_comment" title="注释(中文)"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="2" class="a-tabs-one" title="模型外键">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="foreignFilterData"
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
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="main_table" title="主表表名"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="main_table_col" title="主表字段"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="foreign_table" title="外表表名"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="foreign_table_col" title="外表字段"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="seq_no" title="排序"/>
                <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="主表表名"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="3" class="a-tabs-one" title="模型视图">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="viewFilterData"
                     :pagination="false"
                     :scroll="{x: 70+180*7, y: scroll.y}"
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
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="title" title="名称(中文)"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="view_name" title="名称(英文)"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="view_type" title="视图类型"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="seq_no" title="排序"/>
                <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="补充描述"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="4" class="a-tabs-one" title="模型权限">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="tablePermissionFilterData"
                     :pagination="false"
                     :scroll="{x: 270+120*tPermissionFilterData.length, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :ellipsis="true" :tooltip="false" :width="180" data-index="name" fixed="left" title="角色名称"/>
                <a-table-column :ellipsis="true" :tooltip="false" :width="90" align="center" data-index="weight" title="角色权重"/>
                <a-table-column v-for="(item,index) of tPermissionFilterData" :key="index" :data-index="item.id" :ellipsis="true" :title="item.name"
                                :tooltip="true"
                                :width="120" align="center">
                  <template #cell="{record}">
                    <a-switch v-model="record[item.id]" :disabled="true">
                      <template #checked>
                        YES
                      </template>
                      <template #unchecked>
                        NO
                      </template>
                    </a-switch>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="5" class="a-tabs-one" title="字段权限">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="columnPermissionFilterData"
                     :pagination="false"
                     :scroll="{x: 270+120*columnFilterData.length, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :ellipsis="true" :tooltip="false" :width="180" data-index="name" fixed="left" title="角色名称"/>
                <a-table-column :ellipsis="true" :tooltip="false" :width="90" align="center" data-index="weight" title="角色权重"/>
                <a-table-column v-for="(item,index) of columnFilterData" :key="index" :data-index="item.id" :ellipsis="true" :title="item.title" :tooltip="true"
                                :width="120" align="center">
                  <template #cell="{record}">
                    <span v-if="record[item.id]==0" style="color: #86909c;">可编辑</span>
                    <span v-if="record[item.id]==1" style="color: #00b42a;">不可编辑</span>
                    <span v-if="record[item.id]==2" style="color: #165dff;">不可查看</span>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
      <a-tabs v-if="selectedData.level===3" :default-active-tab="1" :lazy-load="true" position="top" type="line">
        <a-tab-pane :key="1" class="a-tabs-one" title="视图语句">
          <div style="word-wrap: break-word;overflow-wrap: break-word;box-sizing: border-box;padding: 5px 16px;border: 1px solid var(--color-neutral-3);">
            {{ selectedData.data?.view_construct || '' }}
          </div>
        </a-tab-pane>
        <a-tab-pane :key="2" class="a-tabs-one" title="视图字段">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="columnFilterData as Record<string,any>[]"
                     :pagination="false"
                     :scroll="{x: 70+180*5, y: scroll.y}"
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
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="title" title="名称(中文)"/>
                <a-table-column :ellipsis="true" :sortable="sortable.columnName" :tooltip="true" :width="180" data-index="column_name" title="字段标识"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="field_name" title="名称(英文)"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="select_type" title="数据类型"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="table_name" title="模型名称"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="3" class="a-tabs-one" title="视图权限">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="tablePermissionFilterData"
                     :pagination="false"
                     :scroll="scroll"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :ellipsis="true" :tooltip="false" :width="120" data-index="name" fixed="left" title="角色名称"/>
                <a-table-column :ellipsis="true" :tooltip="false" :width="60" align="center" data-index="weight" title="角色权重"/>
                <a-table-column v-for="(item,index) of tPermissionFilterData" :key="index" :data-index="item.id" :ellipsis="true" :title="item.name"
                                :tooltip="true"
                                :width="120" align="center">
                  <template #cell="{record}">
                    <a-switch v-model="record[item.id]" :disabled="true">
                      <template #checked>
                        YES
                      </template>
                      <template #unchecked>
                        NO
                      </template>
                    </a-switch>
                  </template>
                </a-table-column>
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