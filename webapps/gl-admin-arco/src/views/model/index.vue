<script lang="ts">
export default {
  name: 'ModelIndex'
};
</script>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {useUserStore} from "@/store";
import {EventNames} from "@geelato/gl-ide";
import {emitter} from "@geelato/gl-ui";
import {ListParams, PageSizeOptions, resetValueByOptions} from '@/api/base';
import {QueryConnectForm, QueryTableForm} from "@/api/model";
import ModelTableTabs from "./table/tableTabs.vue";
import ModelTree from "./tree.vue";
import ModelConnectList from "./connect/list.vue";
import ModelTableList from "./table/list.vue";

// 常量使用
const ListDefaultPageSize = 20;
const ListUsedHeight = 520;
const ListRowHeight = 49;

const {t} = useI18n(); // 国际化
const route = useRoute(); // 路由
const userStore = useUserStore(); // 用户
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || userStore.tenantCode || ''
});// 页面的应用id、租户编码(路由或用户所属)

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  formState: {type: String, default: 'edit'},
  isModal: {type: Boolean, default: true},
});

/**
 * 调整列表高度
 */
const resetListHeight = () => {
  return window.innerHeight - ListUsedHeight;
}
/**
 * 调整树高度
 */
const resetTreeHeight = () => {
  return window.innerHeight - 290;
}
/**
 * 调整tab高度
 */
const resetTabsHeight = () => {
  return window.innerHeight - 290;
}
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

// 页面数据
const pageData = ref({
  isSync: 0,
  isSystem: false,
  tree: { // 选中节点：id，层级，标题，数据
    key: '0', level: 0, title: '', data: {}
  },
});

// 链接、模型树
const treeParams = ref({
  visible: true,
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  height: resetTreeHeight(),
});
// 连接列表
const connectListParams = ref<ListParams>({
  visible: true,
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: 'edit',
  filterCol: 2,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});
// 模型列表
const tableListParams = ref<ListParams>({
  visible: false,
  parameter: {
    connectId: '',
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: 'edit',
  filterCol: 2,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});
/* 模型tab页所需参数 */
const tableTabsParams = ref({
  id: '',
  visible: false,
  formState: 'edit',
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  height: resetTabsHeight(),
});
/**
 * 标题显示
 * @param item
 */
const swapConnectTitle = (item: QueryConnectForm): string => {
  // mysql://localhost/geelato
  return `${item.dbConnectName}（${item.dbType && item.dbType.toLowerCase()}://${item.dbHostnameIp}:${item.dbPort}/${item.dbName}）`;
}
const swapTableTitle = (item: QueryTableForm): string => {
  // eslint-disable-next-line no-nested-ternary
  pageData.value.isSync = (item.tableName != null && item.tableName.length > 0) ? (item.synced ? 2 : 1) : 0;
  pageData.value.isSystem = ['system', 'platform'].includes(item.sourceType);
  return `${item.title}（${item.entityName || item.tableName}）`;
}

/**
 * 模型树选中事件
 * @param key 选中id
 * @param level 层级
 * @param form 节点数据
 */
const treeSelected = (key: string, level: number, form: QueryTableForm | QueryConnectForm) => {
  pageData.value.tree = {key: key || '0', level: level || 0, title: '', data: form || {}};
  if (pageData.value.tree.level === 0) {
    connectListParams.value.visible = true;
    tableListParams.value.visible = false;
    tableTabsParams.value.visible = false;
  } else if (pageData.value.tree.level === 1) {
    connectListParams.value.visible = false;
    tableListParams.value.visible = true;
    tableTabsParams.value.visible = false;
    tableListParams.value.parameter = {connectId: (form as QueryConnectForm).id};
    pageData.value.tree.title = swapConnectTitle(form as unknown as QueryConnectForm);
  } else if (pageData.value.tree.level === 2) {
    connectListParams.value.visible = false;
    tableListParams.value.visible = false;
    tableTabsParams.value.id = (form as QueryTableForm).id;
    tableTabsParams.value.visible = true;
    pageData.value.tree.title = swapTableTitle(form as unknown as QueryTableForm);
  }
}

const modelConnectListAdd = (data: QueryConnectForm) => {
  emitter.emit('MODEL-TREE-REFRESH-ONE');
}
const modelConnectListEdit = (data: QueryConnectForm) => {
  emitter.emit('MODEL-TREE-REFRESH-ONE');
}
const modelConnectListDelete = (data: QueryConnectForm) => {
  emitter.emit('MODEL-TREE-REFRESH-ONE');
}
const modelTableListAdd = (data: QueryConnectForm) => {
  emitter.emit('MODEL-TREE-REFRESH-TWO', {node: data, isSelected: true});
}
const modelTableListEdit = (data: QueryTableForm) => {
  emitter.emit('MODEL-TREE-REFRESH-TWO', {node: data, isSelected: false});
}
const modelTableListDelete = (data: QueryTableForm) => {
  emitter.emit('MODEL-TREE-REFRESH-TWO', {node: data, isSelected: false});
}
const modelTableTabsToModel = (data: QueryTableForm) => {
  emitter.emit('MODEL-TREE-REFRESH-TWO', {node: data, isSelected: true});
}
const modelTableTabsToTable = (data: QueryTableForm) => {
  emitter.emit('MODEL-TREE-REFRESH-TWO', {node: data, isSelected: true});
}

/**
 * 浏览器高度调整时事件
 */
const handleResize = () => {
  const listRecord = {height: resetListHeight(), pageSize: resetListPageSize()}
  switch (pageData.value.tree.level) {
    case 0:
      Object.assign(connectListParams.value, listRecord);
      break;
    case 1:
      Object.assign(tableListParams.value, listRecord);
      break;
    case 2:
      Object.assign(tableTabsParams.value, {height: resetTabsHeight()});
      break;
    default:
      break;
  }
  Object.assign(treeParams.value, {height: resetTreeHeight()});
}

onMounted(() => {
  window.addEventListener(EventNames.WindowResize, handleResize);
});
onUnmounted(() => {
  window.removeEventListener(EventNames.WindowResize, handleResize);
});
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['model.connect.index.menu.list', 'model.dataBase.index.menu.list']"/>
    <a-card class="general-card general-card1">
      <a-row>
        <a-col :span="6">
          <a-spin>{{ $t('model.dataBase.index.menu.list') }}</a-spin>
        </a-col>
        <a-col :span="18">
          <a-spin>
            {{ pageData.tree.title !== '' ? pageData.tree.title : $t('model.connect.index.menu.list.searchTable') }}
          </a-spin>
          <a-spin v-if="pageData.isSystem" style="padding-right: 5px;">
            <a-button v-show="pageData.tree.level===2" class="list-action-button-default" status="warning" type="primary">
              <a-spin>{{ $t('model.table.index.form.sourceType.system') }}</a-spin>
            </a-button>
          </a-spin>
          <a-spin>
            <a-button v-show="pageData.tree.level===2" :disabled="pageData.isSync===0" class="list-action-button-default" type="primary">
              <a-spin v-if="pageData.isSync===2">{{ $t('model.table.index.form.tableName.yes') }}</a-spin>
              <a-spin v-else-if="pageData.isSync===1">{{ $t('model.table.index.form.tableName.edit') }}</a-spin>
              <a-spin v-else>{{ $t('model.table.index.form.tableName.no') }}</a-spin>
            </a-button>
          </a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <div class="general-card1" style="padding-right: 10px;border-right: 1px solid var(--color-neutral-3);">
            <ModelTree :height="treeParams.height"
                       :parameter="treeParams.parameter"
                       :visible="treeParams.visible"
                       @tree-selected="treeSelected"/>
          </div>
        </a-col>
        <a-col :span="18">
          <div v-if="pageData.tree.level===0" style="padding-left: 10px;">
            <ModelConnectList :filterCol="connectListParams.filterCol"
                              :formState="connectListParams.formState"
                              :height="connectListParams.height"
                              :pageSize="connectListParams.pageSize"
                              :parameter="connectListParams.parameter"
                              :visible="connectListParams.visible"
                              @add="modelConnectListAdd"
                              @delete="modelConnectListDelete"
                              @edit="modelConnectListEdit"/>
          </div>
          <div v-if="pageData.tree.level===1" style="padding-left: 10px;">
            <ModelTableList :filterCol="tableListParams.filterCol"
                            :formState="tableListParams.formState"
                            :height="tableListParams.height"
                            :pageSize="tableListParams.pageSize"
                            :parameter="tableListParams.parameter"
                            :visible="tableListParams.visible"
                            @add="modelTableListAdd"
                            @delete="modelTableListDelete"
                            @edit="modelTableListEdit"/>
          </div>
          <div v-if="pageData.tree.level===2" style="padding-left: 10px;">
            <ModelTableTabs :formState="tableTabsParams.formState"
                            :height="tableTabsParams.height"
                            :model-value="tableTabsParams.id"
                            :parameter="tableTabsParams.parameter"
                            :visible="tableTabsParams.visible"
                            @toModel="modelTableTabsToModel"
                            @toTable="modelTableTabsToTable"/>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
  position: relative;
}

.general-card1 .list-item1 {
  cursor: pointer;
  padding: 10px 10px !important;
}

.general-card1 .list-item1.active {
  background-color: var(--color-fill-3);
  color: rgb(var(--primary-6));
}

.arco-btn {
  border-radius: 6px;
}

.arco-btn-size-medium {
  /* padding: 0 8px; */
}

.general-card > .arco-tabs-content {
  padding: 10px 0px 0px 10px;
}

.general-card1 > .arco-card-body > .arco-row:first-child {
  height: auto;
  padding: 20px 10px 10px 10px;
  border: none;
}

.general-card1 > .arco-card-body > .arco-row > .arco-col > .arco-spin {
  flex: 1;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5715;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


.form {
  width: 500px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.tree-extra-icon {
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}
</style>