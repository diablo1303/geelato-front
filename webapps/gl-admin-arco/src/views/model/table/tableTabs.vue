<script lang="ts">
export default {
  name: 'ModelTableTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {createOrUpdateModelToTable, createOrUpdateTable, getTable, QueryTableForm, resetModelFormTable} from "@/api/model";
import {Modal, Notification} from "@arco-design/web-vue";
import ModelTableColumnList from "../column/list.vue";
import ModelTableForeignList from "../foreign/list.vue";
import ModelTableViewList from "../view/list.vue";
import ModelTableCopy from "./copy.vue";
import ModelTablePermissionList from "./permission/list.vue";
import ModelTableColumnPermissionList from "../column/permission/list.vue";

type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'toModel', 'toTable']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  height: {type: Number, default: 0},// 表单宽度
});

const {t} = useI18n();// 国际化
const tabsKey = ref<number>(1);// 定位tabs页面
const tableData = ref<QueryTableForm>({} as QueryTableForm);
const isSync = ref<number>(0);// 模型：未创建，未同步，已同步
const isSystem = ref<boolean>(false);// 是否是平台或系统表，不可修改

const generateListParams = () => {
  return {
    visible: false,
    parameter: {connectId: '', tableId: '', tableName: '', appId: '', tenantCode: ''},
    formState: props.formState,
    filterCol: 2,
    height: props.height - 235,
    pageSize: 10000,
  }
};
const columnListParams = ref(generateListParams());
const foreignListParams = ref(generateListParams());
const viewListParams = ref(generateListParams());
const tablePermissionListParams = ref(generateListParams());
const columnPermissionListParams = ref(generateListParams());
const tableCopyParams = ref({
  id: '',
  visible: false,
  parameter: {appId: '', tenantCode: ''},
  formState: 'add',
  formCol: 1,
  title: '',
  width: '',
});

/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getTable(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 从数据库中 将表同步至模型
 * @param entityName
 * @param successBack
 * @param failBack
 */
const resetModel = async (tableId: string, successBack: any, failBack: any) => {
  try {
    await resetModelFormTable(tableId);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}
/**
 *
 * @param ev
 */
const syncFromTableToModel = (ev?: MouseEvent) => {

}
/**
 *
 * @param ev
 */
const syncFromModelToTable = (ev?: MouseEvent) => {

}

/**
 * 获取模型数据，并处理
 * @param id
 */
const tableFormat = (id: string) => {
  getData(id, (data: QueryTableForm) => {
    data.seqNo = Number(data.seqNo);
    // eslint-disable-next-line no-nested-ternary
    isSync.value = (data.tableName != null && data.tableName.length > 0) ? (data.synced ? 2 : 1) : 0;
    isSystem.value = ['system', 'platform'].includes(data.sourceType);
    tableData.value = data;
    // 加载模型字段
    const listParameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型字段
    Object.assign(columnListParams.value, {
      formState: isSystem.value ? 'view' : props.formState,
      parameter: listParameter,
      height: props.height - 235,
      visible: true,
    });
    // 加载模型外键
    Object.assign(foreignListParams.value, {
      parameter: listParameter,
      height: props.height - 260,
      visible: true,
    });
    // 加载模型视图
    Object.assign(viewListParams.value, {
      parameter: listParameter,
      height: props.height - 235,
      visible: true,
    });
    // 加载模型权限
    Object.assign(tablePermissionListParams.value, {
      parameter: {...listParameter, type: 'dp,mp', object: data.entityName,},
      height: props.height - 200,
      visible: true,
    });
    // 加载字段权限
    Object.assign(columnPermissionListParams.value, {
      parameter: {...listParameter, type: 'cp', object: data.entityName,},
      height: props.height - 200,
      visible: true,
    });
  });
}

const copyTable = () => {
  Object.assign(tableCopyParams.value, {
    id: props.modelValue,
    title: t('model.connect.index.model.sync.copy'),
    parameter: {
      connectId: props.parameter.connectId,
      appId: props.parameter.appId, tenantCode: props.parameter.tenantCode
    },
    visible: true,
  });
}

/**
 * 复制成功
 * @param data
 * @param action
 */
const tableCopySuccess = (data: QueryTableForm, action: string) => {
  tableCopyParams.value.visible = false;
}

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
    // 编辑、查看 状态 查询数据
    if (props.modelValue) {
      tableFormat(props.modelValue);
    }
  }
}, {deep: true, immediate: true});
</script>

<template>
  <ModelTableCopy v-model:visible="tableCopyParams.visible"
                  :formCol="tableCopyParams.formCol"
                  :formState="tableCopyParams.formState"
                  :modelValue="tableCopyParams.id"
                  :parameter="tableCopyParams.parameter"
                  :title="tableCopyParams.title"
                  :width="tableCopyParams.width"
                  @saveSuccess="tableCopySuccess"/>
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
    <a-tab-pane :key="1" :title="$t('model.column.index.menu.list.searchTable')" class="a-tabs-one">
      <ModelTableColumnList :filterCol="columnListParams.filterCol"
                            :formState="columnListParams.formState"
                            :height="columnListParams.height"
                            :pageSize="columnListParams.pageSize"
                            :parameter="columnListParams.parameter"
                            :visible="columnListParams.visible"/>
    </a-tab-pane>
    <a-tooltip :content="$t('model.foreign.index.menu.list.tab.tip')" position="top">
      <a-tab-pane :key="2" :title="$t('model.foreign.index.menu.list.searchTable')" class="a-tabs-two">
        <template #title>
          <a-tooltip :content="$t('model.foreign.index.menu.list.tab.tip')" position="right">
            {{ $t('model.foreign.index.menu.list.searchTable') }}
            <icon-question-circle/>
          </a-tooltip>
        </template>
        <a-card class="general-card">
          <ModelTableForeignList :filterCol="foreignListParams.filterCol"
                                 :formState="foreignListParams.formState"
                                 :height="foreignListParams.height"
                                 :pageSize="foreignListParams.pageSize"
                                 :parameter="foreignListParams.parameter"
                                 :visible="foreignListParams.visible"/>
        </a-card>
      </a-tab-pane>
    </a-tooltip>
    <a-tab-pane :key="3" :title="$t('model.view.index.menu.list.searchTable')" class="a-tabs-three">
      <a-card class="general-card">
        <ModelTableViewList :filterCol="viewListParams.filterCol"
                            :formState="viewListParams.formState"
                            :height="viewListParams.height"
                            :pageSize="viewListParams.pageSize"
                            :parameter="viewListParams.parameter"
                            :visible="viewListParams.visible"/>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="4" :title="$t('model.table.permission.index.menu.list.searchTable')" class="a-tabs-four">
      <a-card class="general-card">
        <ModelTablePermissionList :filterCol="tablePermissionListParams.filterCol"
                                  :formState="tablePermissionListParams.formState"
                                  :height="tablePermissionListParams.height"
                                  :pageSize="tablePermissionListParams.pageSize"
                                  :parameter="tablePermissionListParams.parameter"
                                  :visible="tablePermissionListParams.visible"/>
      </a-card>
    </a-tab-pane>
    <a-tab-pane :key="5" :title="$t('model.column.permission.index.menu.list.searchTable')" class="a-tabs-five">
      <a-card class="general-card">
        <ModelTableColumnPermissionList :filterCol="columnPermissionListParams.filterCol"
                                        :formState="columnPermissionListParams.formState"
                                        :height="columnPermissionListParams.height"
                                        :pageSize="columnPermissionListParams.pageSize"
                                        :parameter="columnPermissionListParams.parameter"
                                        :visible="columnPermissionListParams.visible"/>
      </a-card>
    </a-tab-pane>
    <template #extra>
      <a-space v-if="!isSystem">
        <a-button type="outline" @click="syncFromModelToTable($event)">
          <template #icon>
            <icon-sync/>
          </template>
          {{ $t('model.connect.index.model.sync.table') }}
        </a-button>
        <a-dropdown position="br">
          <a-button type="outline">
            {{ $t('model.connect.index.model.sync.more') }}&nbsp;
            <icon-down/>
          </a-button>
          <template #content>
            <a-doption style="color: rgb(var(--primary-6));" @click="copyTable">
              <template #icon>
                <icon-copy/>
              </template>
              {{ $t('model.connect.index.model.sync.copy') }}
            </a-doption>
            <a-divider style="margin: 0px 0px;"/>
            <a-doption style="color: rgb(var(--primary-6));" @click="syncFromTableToModel">
              <template #icon>
                <icon-sync/>
              </template>
              {{ $t('model.connect.index.model.sync.model') }}
            </a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </template>
  </a-tabs>
</template>

<style lang="less" scoped>

</style>