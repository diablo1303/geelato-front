<script lang="ts">
export default {
  name: 'PlatformRoleList'
};
</script>
<script lang="ts" setup>
import {computed, h, ref, watch} from 'vue';
import {TableColumnData, TableData, TableSortable} from '@arco-design/web-vue';
import {getOptionLabel, PageQueryFilter} from '@/api/base';
import {
  QueryPermissionForm,
  QueryRoleAppForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  QueryRoleTreeNodeForm,
  QueryTreeNodeForm
} from "@/api/security";
import cloneDeep from "lodash/cloneDeep";
import {IconFolder} from "@arco-design/web-vue/es/icon";
import {AppMeta, PageParams, TreeNodeModel, treeNodeTypeOptions} from "@/views/compare/type";

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: Array<AppMeta>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
  permission: {type: Array<PageQueryFilter>, default: () => []},
  role: {type: Array<PageQueryFilter>, default: () => []},
  roleApp: {type: Array<PageQueryFilter>, default: () => []},
  rolePermission: {type: Array<PageQueryFilter>, default: () => []},
  roleTreeNode: {type: Array<PageQueryFilter>, default: () => []},
  treeNode: {type: Array<PageQueryFilter>, default: () => []},
});

// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['descend', 'ascend'], sorter: false},
  weight: {sortDirections: ['ascend', 'descend'], sorter: false},
  createAt: {sortDirections: ['descend', 'ascend'], sorter: false}
});
const appMetaList = ref<AppMeta[]>([]);
const rootPid = 'root';
const roleTree = ref<TreeNodeModel[]>([]);
const selectedKeys = ref<string[]>([]);
const selectedData = ref<TreeNodeModel>({});
const roleData = ref<QueryRoleForm[]>([]);
const roleAppData = ref<Map<string, PageQueryFilter[]>>(new Map());
const rolePermissionData = ref<Map<string, PageQueryFilter[]>>(new Map());
const roleNodeData = ref<QueryRoleTreeNodeForm[]>([]);
const treeNodeData = ref<QueryTreeNodeForm[]>([]);

const appFilterData = ref<PageQueryFilter[]>([]);
const permissionFilterData = ref<PageQueryFilter[]>([]);
const roleTreeNodeFilterData = ref<QueryRoleTreeNodeForm[]>([]);
const treeNodeFilterData = ref<PageQueryFilter[]>([]);
/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return props.height - 75;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('320px');
const splitSize = ref<number | string>(splitMin.value);

const setRoleItemData = () => {
  const roles = [];
  if (roleData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of roleData.value) {
      // @ts-ignore
      roles.push({title: item.name, key: item.id, level: 1, data: item, children: []});
    }
  }
  const parentDict = {title: '角色管理', key: rootPid, icon: () => h(IconFolder), level: 0, data: {}, children: roles};
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

/**
 * 构建第一层
 * @param appId
 */
const buildGroundFloor = (appId: string) => {
  const items: PageQueryFilter[] = [];
  if (appFilterData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of appFilterData.value) {
      items.push({
        // @ts-ignore
        id: item.app_id, text: item.app_name, flag: 'app', iconType: '', isRoled: false, isLeaf: false
      } as unknown as PageQueryFilter);
    }
  } else if (treeNodeData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of treeNodeData.value) {
      // @ts-ignore
      if (item.pid === appId) {
        items.push({
          // @ts-ignore
          id: item.id, text: item.text, flag: item.flag, iconType: item.icon_type, type: item.type, updateAt: item.update_at,
          // @ts-ignore
          isRoled: roleTreeNodeFilterData.value.filter(roleItem => roleItem.tree_node_id === item.id).length > 0,
          // @ts-ignore
          isLeaf: treeNodeData.value.filter(treeItem => treeItem.pid === item.id).length <= 0
        } as unknown as PageQueryFilter);
      }
    }
  }
  treeNodeFilterData.value = items;
}

const loadMore = (record: TableData, done: any) => {
  const items: PageQueryFilter[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of treeNodeData.value) {
    // @ts-ignore
    if (item.pid === record.id) {
      items.push({
        // @ts-ignore
        id: item.id, text: item.text, flag: item.flag, iconType: item.icon_type, type: item.type, updateAt: item.update_at,
        // @ts-ignore
        isRoled: roleTreeNodeFilterData.value.filter(roleItem => roleItem.tree_node_id === item.id).length > 0,
        // @ts-ignore
        isLeaf: treeNodeData.value.filter(treeItem => treeItem.pid === item.id).length <= 0
      } as unknown as PageQueryFilter);
    }
  }
  done(items);
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
    scroll.value.y = props.height - 200;
    appFilterData.value = roleAppData.value.get(selectedData.value?.data?.id) || [];
    permissionFilterData.value = rolePermissionData.value.get(selectedData.value?.data?.id) || [];
    // @ts-ignore
    roleTreeNodeFilterData.value = roleNodeData.value.filter(item => item.role_id === selectedData.value?.data?.id);
    buildGroundFloor(selectedData.value?.data?.app_id);
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    splitHeight.value = resetSplitHeight();
    scroll.value.y = props.height - 135;
    // 加载数据
    appMetaList.value = cloneDeep(props.modelValue) || [];
    roleData.value = cloneDeep(props.role) as unknown as QueryRoleForm[];
    roleData.value.sort((a, b) => b.weight - a.weight);
    setRoleItemData();
    // @ts-ignore
    roleAppData.value = new Map();
    const roleAppList = cloneDeep(props.roleApp);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of roleData.value) {
      // @ts-ignore
      roleAppData.value.set(item.id, roleAppList.filter(appItem => appItem.role_id === item.id));
    }
    // @ts-ignore
    rolePermissionData.value = new Map();
    const rolePermissionList = cloneDeep(props.rolePermission);
    const permissionList = cloneDeep(props.permission);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of roleData.value) {
      // @ts-ignore
      const permissionIds = rolePermissionList.filter(pItem => pItem.role_id === item.id).map(pItem => pItem.permission_id);
      // @ts-ignore
      rolePermissionData.value.set(item.id, permissionList.filter(pItem => permissionIds.includes(pItem.id)));
    }

    roleNodeData.value = cloneDeep(props.roleTreeNode) as unknown as QueryRoleTreeNodeForm[];
    treeNodeData.value = cloneDeep(props.treeNode) as unknown as QueryTreeNodeForm[];
    // @ts-ignore
    treeNodeData.value.sort((a, b) => a.seq_no - b.seq_no);
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
          :show-line="true"
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
               :data="roleData"
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
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="name" title="名称"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="code" title="编码"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="type" title="类型"/>
          <a-table-column :ellipsis="true" :sortable="sortable.weight" :tooltip="true" :width="90" data-index="weight" title="权重"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="app_id" title="所属应用"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="use_app" title="用于应用"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="enable_status" title="状态"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="seq_no" title="排序"/>
          <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
          <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="描述"/>
        </template>
      </a-table>
      <a-tabs v-if="selectedData.level===1" :default-active-tab="1" :lazy-load="true" position="top" type="line">
        <a-tab-pane :key="1" class="a-tabs-one" title="应用关联">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="appFilterData"
                     :pagination="false"
                     :scroll="{x: 70+180*3, y: scroll.y}"
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
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="app_id" title="应用主键"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="app_name" title="应用名称"/>
                <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="2" class="a-tabs-one" title="权限关联">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="permissionFilterData"
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
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="name" title="名称"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="code" title="编码"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="type" title="类型"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="object" title="对象"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="rule" title="规则"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="description" title="描述"/>
                <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="create_at" title="创建时间"/>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :key="3" class="a-tabs-one" title="菜单关联">
          <a-card class="general-card6">
            <a-table :bordered="{cell:true}"
                     :columns="([] as TableColumnData[])"
                     :data="treeNodeFilterData"
                     :load-more="loadMore"
                     :pagination="false"
                     :scroll="{x: 720, y: scroll.y}"
                     :scrollbar="scrollbar"
                     :stripe="true"
                     column-resizable
                     row-key="id">
              <template #columns>
                <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="text" title="标题">
                  <template #cell="{ record }">
                    &nbsp;
                    <span :style="{color: record.flag==='app'?'rgb(var(--primary-6))':''}"><gl-iconfont :type="record.iconType"/> {{ record.text }}</span>
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="flag" title="菜单">
                  <template #cell="{ record }">
                    {{ record.flag === 'app' ? '应用' : (record.flag === 'menuItem' ? '菜单' : '') }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="type" title="类型">
                  <template #cell="{ record }">
                    {{ getOptionLabel(record.type, treeNodeTypeOptions) }}
                  </template>
                </a-table-column>
                <a-table-column :ellipsis="true" :tooltip="true" :width="180" data-index="updateAt" title="更新时间"/>
                <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="isRoled" title="选中">
                  <template #cell="{ record }">
                    <a-switch v-model="record.isRoled" :disabled="true">
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