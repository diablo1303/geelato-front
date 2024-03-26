<script lang="ts">
export default {
  name: 'GlModelTableTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import {modelApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryTableForm} from '@geelato/gl-ui';
import {sourceTypeOptions, tableSyncOptions} from "./searchTable";
import GlModelTableColumnList from '../column/list.vue';
import GlModelTableForeignList from '../foreign/list.vue';
import GlModelTableViewList from '../view/list.vue';
import GlModelTablePermissionForm from './permission/form.vue';
import GlModelTableColumnPermissionForm from '../column/permission/form.vue';

type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  visible: {type: Boolean, default: false},// 显示
  formState: {type: String, default: 'edit'},// 表单状态
  width: {type: String, default: ''},// 表单宽度
});

const global = useGlobal();
const visibleForm = ref<boolean>(false);
const tableTabHeight = ref<number>(555);
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});
const tableData = ref<QueryTableForm>({} as QueryTableForm);
const tabsTitle = ref<string>('');
const isSync = ref<number>(0);
const isSystem = ref<boolean>(false);
const tabsKey = ref<number>(1);// 定位tabs页面
const columnListParams = ref({
  formState: 'edit', isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '', appId: '', tenantCode: ''
  }
});
const foreignListParams = ref({
  formState: 'edit', isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '', appId: '', tenantCode: ''
  }
});
const viewListParams = ref({
  formState: 'edit', isModal: true, height: 0, tableSync: false, parameter: {
    connectId: '', tableId: '', tableName: '', appId: '', tenantCode: ''
  }
});
const tablePermissionFormParams = ref({
  formState: 'edit', isModal: true, height: 0, parameter: {
    connectId: '', object: '', type: '', appId: '', tenantCode: ''
  }
});
const columnPermissionFormParams = ref({
  formState: 'edit', isModal: true, height: 0, isSystem: false, parameter: {
    connectId: '', tableId: '', object: '', type: '', appId: '', tenantCode: ''
  }
});
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.getTable(id);
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
const createOrUpdateTable = async (entityName: string, successBack: any, failBack: any) => {
  try {
    await modelApi.createOrUpdateModelToTable(entityName);
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
const resetModel = async (tableId: string, successBack: any, failBack: any) => {
  try {
    await modelApi.resetModelFormTable(tableId);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
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
    tabsTitle.value = `${data.title}（${data.entityName || data.tableName}）`;
    tableData.value = data;
    // 加载模型字段
    columnListParams.value.formState = isSystem.value ? 'view' : props.formState;
    columnListParams.value.height = tableTabHeight.value - 310;
    columnListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型外键
    foreignListParams.value.height = tableTabHeight.value - 310;
    foreignListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型视图
    viewListParams.value.height = tableTabHeight.value - 310;
    viewListParams.value.tableSync = isSync.value === 2;
    viewListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型权限
    tablePermissionFormParams.value.height = tableTabHeight.value - 250;
    tablePermissionFormParams.value.parameter = {
      connectId: data.connectId, type: 'dp,mp', object: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载字段权限
    columnPermissionFormParams.value.isSystem = isSystem.value;
    columnPermissionFormParams.value.height = tableTabHeight.value - 210;
    columnPermissionFormParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, type: 'cp', object: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
  });
}

/**
 *
 * @param ev
 */
const syncFromTableToModel = (ev?: MouseEvent) => {
  Modal.open({
    title: '提示',
    titleAlign: 'start',
    content: `${tableData.value.entityName}，是否将数据库表同步至模型中？`,
    cancelText: '取消',
    okText: '提交',
    onOk() {
      resetModel(tableData.value.id, () => {
        global.$message.success({content: '更新成功！'})
        tableFormat(tableData.value.id);
      }, () => {
        global.$message.error({content: '更新失败！'})
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
    title: '提示',
    titleAlign: 'start',
    content: `${tableData.value.entityName}，是否将模型同步至数据库中？`,
    cancelText: '取消',
    okText: '提交',
    onOk() {
      createOrUpdateTable(tableData.value.entityName, () => {
        global.$message.success({content: '更新成功！'})
        tableFormat(tableData.value.id);
      }, () => {
        global.$message.error({content: '更新失败！'})
      });
    }
  });
}

watch(() => props, () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    tableTabHeight.value = window.innerHeight * 0.8;
    tableTabStyle.value.height = `${tableTabHeight.value}px`;
    // 编辑、查看 状态 查询数据
    if (props.modelValue) {
      tableFormat(props.modelValue);
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="false" :width="width || ''" title-align="start">
    <template #title>
      <a-space>
        {{ tabsTitle }}
        <a-button v-if="isSystem" class="list-action-button-default" status="warning" type="primary">
          <span>{{ utils.getOptionLabel(tableData.sourceType, sourceTypeOptions) }}</span>
        </a-button>
        <a-button :disabled="isSync===0" class="list-action-button-default" type="primary">
          <span>{{ utils.getOptionLabel(isSync, tableSyncOptions) }}</span>
        </a-button>
      </a-space>
    </template>
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="top" type="line">
      <a-tab-pane :key="1" class="a-tabs-one" title="模型字段">
        <a-card class="general-card">
          <GlModelTableColumnList :formState="columnListParams.formState"
                                  :height="columnListParams.height"
                                  :isModal="columnListParams.isModal"
                                  :parameter="columnListParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tooltip content="仅展示表格之间的关联，不同步至数据表中。" position="top">
        <a-tab-pane :key="2" class="a-tabs-two" title="模型外键">
          <template #title>
            <a-tooltip content="仅展示表格之间的关联，不同步至数据表中。" position="right">
              模型外键
              <gl-iconfont type="gl-warning-circle"/>
            </a-tooltip>
          </template>
          <a-card class="general-card">
            <GlModelTableForeignList :formState="foreignListParams.formState"
                                     :height="foreignListParams.height"
                                     :isModal="foreignListParams.isModal"
                                     :parameter="foreignListParams.parameter"/>
          </a-card>
        </a-tab-pane>
      </a-tooltip>
      <a-tab-pane :key="3" class="a-tabs-three" title="模型视图">
        <a-card class="general-card">
          <GlModelTableViewList :formState="viewListParams.formState"
                                :height="viewListParams.height"
                                :isModal="viewListParams.isModal"
                                :parameter="viewListParams.parameter"
                                :tableSync="viewListParams.tableSync"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="4" class="a-tabs-four" title="模型权限">
        <a-card class="general-card">
          <GlModelTablePermissionForm :formState="tablePermissionFormParams.formState"
                                      :height="tablePermissionFormParams.height"
                                      :isModal="tablePermissionFormParams.isModal"
                                      :parameter="tablePermissionFormParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="5" class="a-tabs-five" title="字段权限">
        <a-card class="general-card">
          <GlModelTableColumnPermissionForm :formState="columnPermissionFormParams.formState"
                                            :height="columnPermissionFormParams.height"
                                            :isModal="columnPermissionFormParams.isModal"
                                            :isSystem="columnPermissionFormParams.isSystem"
                                            :parameter="columnPermissionFormParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <template #extra>
        <a-space v-if="!isSystem">
          <a-button type="outline" @click="syncFromModelToTable($event)">
            <template #icon>
              <gl-iconfont type="gl-sync"/>
            </template>
            模型同步至数据库
          </a-button>
          <a-dropdown position="br">
            <a-button type="outline">
              更多&nbsp;
              <gl-iconfont type="gl-arrow-down"/>
            </a-button>
            <template #content>
              <a-doption @click="syncFromTableToModel($event)">
                <template #icon>
                  <gl-iconfont type="gl-sync"/>
                </template>
                从数据库同步至模型
              </a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </a-tabs>
  </a-modal>
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
  padding: 20px;
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