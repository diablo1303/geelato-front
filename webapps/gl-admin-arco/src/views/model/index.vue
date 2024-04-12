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
import {SelectOptionData} from "@arco-design/web-vue";
import {getOptionLabel, ListParams, PageSizeOptions, resetValueByOptions} from '@/api/base';
import {QueryConnectForm, QueryTableForm} from "@/api/model";
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import ModelTableTabs from "./table/tableTabs.vue";
import ModelTree from "./tree.vue";
import ModelConnectList from "./connect/list.vue";
import ModelTableList from "./table/list.vue";

// 常量使用
const ListDefaultPageSize = 20;
const ListUsedHeight = 510;
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

const appSelectOptions = ref<QueryAppForm[]>([]);

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return window.innerHeight - 180;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('320px');
const splitSize = ref<number | string>(splitMin.value);
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
  return window.innerHeight - 275;
}
/**
 * 调整tab高度
 */
const resetTabsHeight = () => {
  return window.innerHeight - 285;
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
  application: {},
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
const connectListParams = ref({
  visible: true,
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: props.formState,
  filterCol: 2,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});
// 模型列表
const tableListParams = ref({
  visible: false,
  parameter: {
    connectId: '',
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: props.formState,
  filterCol: 2,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});
/* 模型tab页所需参数 */
const tableTabsParams = ref({
  id: '',
  visible: false,
  formState: props.formState,
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
  pageData.value.application = appSelectOptions.value.find(v => v.id === item.appId) || {};
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
  // 应用信息
  getAppSelectOptions({
    id: '', tenantCode: routeParams.value.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
});
onUnmounted(() => {
  window.removeEventListener(EventNames.WindowResize, handleResize);
});
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['model.connect.index.menu.list', 'model.dataBase.index.menu.list']"/>
    <div class="general-card2">
      <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
        <template #first>
          <div class="general-card3">
            <div class="card-header">
              <div class="card-header-title">
                {{ $t('model.dataBase.index.menu.list') }}
              </div>
            </div>
            <a-divider style="margin:0 0 5px 0"/>
            <div class="card-body1">
              <ModelTree :height="treeParams.height"
                         :parameter="treeParams.parameter"
                         :visible="treeParams.visible"
                         @tree-selected="treeSelected"/>
            </div>
          </div>
        </template>
        <template #second>
          <div class="general-card3">
            <div class="card-header">
              <div class="card-header-title">
              <span>
                {{ pageData.tree.title !== '' ? pageData.tree.title : $t('model.connect.index.menu.list.searchTable') }}
              </span>
                <span v-if="pageData.isSystem" style="padding-right: 5px;">
                <a-button v-show="pageData.tree.level===2" class="list-action-button-default" status="warning" type="primary">
                  <span>{{ $t('model.table.index.form.sourceType.system') }}</span>
                </a-button>
              </span>
                <span v-if="pageData.application.name" style="padding-right: 5px;">
                  <a-button v-show="pageData.tree.level===2" class="list-action-button-default" status="success" type="primary">
                    <span>{{ pageData.application.name }}</span>
                  </a-button>
              </span>
                <span>
                <a-button v-show="pageData.tree.level===2" :disabled="pageData.isSync===0" class="list-action-button-default" type="primary">
                  <span v-if="pageData.isSync===2">{{ $t('model.table.index.form.tableName.yes') }}</span>
                  <span v-else-if="pageData.isSync===1">{{ $t('model.table.index.form.tableName.edit') }}</span>
                  <span v-else>{{ $t('model.table.index.form.tableName.no') }}</span>
                </a-button>
              </span>
              </div>
            </div>
            <a-divider style="margin:0 0 5px 0"/>
            <div class="card-body2">
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
            </div>
          </div>
        </template>
      </a-split>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.general-card2 {
  position: relative;
  background: var(--color-bg-2);
  border-radius: 4px;
  border: none;
  transition: box-shadow 0.2s cubic-bezier(0, 0, 1, 1);
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}

.general-card3 {
  .card-header {
    height: 41px;
    padding: 10px 16px;

    .card-header-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3715;
    }
  }

  .card-body1 {
    padding: 0px 10px 16px 16px;
    color: var(--color-text-2);
  }

  .card-body2 {
    padding: 0px 16px 20px 10px;
    color: var(--color-text-2);
  }
}
</style>