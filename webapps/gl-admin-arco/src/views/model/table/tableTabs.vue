<script lang="ts">
export default {
  name: 'ModelTableTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {createOrUpdateModelToTable, getTable, QueryTableForm, refreshMetaRedis, resetModelFormTable} from "@/api/model";
import {Message, Modal} from "@arco-design/web-vue";
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
    parameter: {
      connectId: '', tableId: '', tableName: '',
      isSync: false, isSystem: false,
      appId: '', tenantCode: ''
    },
    formState: props.formState,
    filterCol: 2,
    height: props.height - 255,
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
 * 将模型 同步至 数据库中
 * @param entityName
 * @param successBack
 * @param failBack
 */
const createOrUpdateTable = async (entityName: string, successBack?: any, failBack?: any) => {
  try {
    await createOrUpdateModelToTable(entityName);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}
/**
 * 从数据库中 将表同步至模型
 * @param entityName
 * @param successBack
 * @param failBack
 */
const resetModel = async (tableId: string, successBack?: any, failBack?: any) => {
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
  Modal.open({
    title: t('security.dict.index.modal.title'),
    titleAlign: 'start',
    content: `${tableData.value.entityName}，${t('model.table.index.modal.table.content')}`,
    cancelText: t('model.connect.index.model.cancel.text'),
    okText: t('security.dict.index.modal.ok.text'),
    onOk() {
      resetModel(tableData.value.id, () => {
        Message.success(t('model.table.index.notice.update.success'));
        tableFormat(tableData.value.id, () => {
          emits('toModel', tableData.value);
        });
      }, () => {
        Message.error(t('model.table.index.notice.update.fail'));
      });
    }
  });
}
/**
 *
 * @param ev
 */
const syncFromModelToTable = (ev?: MouseEvent) => {
  Modal.open({
    title: t('security.dict.index.modal.title'),
    titleAlign: 'start',
    content: `${tableData.value.entityName}，${t('model.table.index.modal.model.content')}`,
    cancelText: t('model.connect.index.model.cancel.text'),
    okText: t('security.dict.index.modal.ok.text'),
    onOk() {
      createOrUpdateTable(tableData.value.entityName, () => {
        Message.success(t('model.table.index.notice.update.success'));
        tableFormat(tableData.value.id, () => {
          emits('toTable', tableData.value);
        });
      }, () => {
        Message.error(t('model.table.index.notice.update.fail'));
      });
    }
  });
}

/**
 * 获取模型数据，并处理
 * @param id
 */
const tableFormat = (id: string, successBack?: any) => {
  getData(id, (data: QueryTableForm) => {
    data.seqNo = Number(data.seqNo);
    // eslint-disable-next-line no-nested-ternary
    isSync.value = (data.tableName != null && data.tableName.length > 0) ? (data.synced ? 2 : 1) : 0;
    isSystem.value = ['system', 'platform'].includes(data.sourceType);
    tableData.value = data;
    if (successBack && typeof successBack === 'function') successBack();
    // 加载模型字段
    const listParameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      isSystem: isSystem.value,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型字段
    Object.assign(columnListParams.value, {
      formState: isSystem.value ? 'view' : props.formState,
      parameter: {...listParameter, isSync: isSync.value >= 1},
      height: props.height - 255,
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
      parameter: {...listParameter, isSync: isSync.value === 2},
      height: props.height - 255,
      visible: true,
    });
    // 加载模型权限
    Object.assign(tablePermissionListParams.value, {
      parameter: {...listParameter, type: 'dp,mp', object: data.entityName,},
      height: props.height - 190,
      visible: true,
    });
    // 加载字段权限
    Object.assign(columnPermissionListParams.value, {
      parameter: {...listParameter, isSync: isSync.value >= 1, type: 'cp', object: data.entityName,},
      height: props.height - 150,
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

const refreshMeta = async () => {
  try {
    await refreshMetaRedis({
      tableId: props.modelValue,
      connectId: props.parameter.connectId || '',
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || ''
    });
    Message.success(t('searchTable.columns.operations.refresh.success'));
  } catch (err) {
    console.error(err);
  }
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
      <a-card class="general-card">
        <ModelTableColumnList :filterCol="columnListParams.filterCol"
                              :formState="columnListParams.formState"
                              :height="columnListParams.height"
                              :pageSize="columnListParams.pageSize"
                              :parameter="columnListParams.parameter"
                              :visible="columnListParams.visible"/>
      </a-card>
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
      <a-space>
        <a-popconfirm :content="$t('searchTable.columns.operations.refresh.tableMsg')"
                      position="br" type="warning" @ok="refreshMeta">
          <a-button :disabled="formState==='view'" status="warning" type="outline"
                    :title="$t('searchTable.columns.operations.refresh.table.title')">
            <template #icon>
              <icon-sync/>
            </template>
            {{ $t('searchTable.columns.operations.refresh.table') }}
          </a-button>
        </a-popconfirm>
        <a-button :disabled="isSystem || formState==='view'" type="outline"
                  :title="$t('model.connect.index.model.sync.table.title')"
                  @click="syncFromModelToTable($event)">
          <template #icon>
            <icon-sync/>
          </template>
          {{ $t('model.connect.index.model.sync.table') }}
        </a-button>
        <a-dropdown position="br">
          <a-button :disabled="formState==='view'" type="outline">
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
            <a-doption :disabled="isSystem" style="color: rgb(var(--primary-6));" @click="syncFromTableToModel">
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