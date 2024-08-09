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
import {packBusDataOptions, sourceTypeOptions, tableSyncOptions} from "./searchTable";
import GlModelTableForm from "./form.vue";
import GlModelTableCopy from "./copy.vue";
import GlModelTableColumnList from '../column/list.vue';
import GlModelTableForeignList from '../foreign/list.vue';
import GlModelTableViewList from '../view/list.vue';
import GlModelTablePermissionForm from './permission/form.vue';
import GlModelTableColumnPermissionForm from '../column/permission/form.vue';
import GlModelTableAppList from '../application/table/list.vue';

type PageParams = {
  refApp: string; // 引用应用
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'updateSuccess', 'deleteSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  visible: {type: Boolean, default: false},// 显示
  formState: {type: String, default: 'edit'},// 表单状态
  width: {type: String, default: ''},// 表单宽度
  refApp: {type: Boolean, default: false},
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
const tableFormRef = ref(null);
const tableFormParams = ref({
  id: '', formState: props.formState, formCol: 2, parameter: {connectId: '', appId: '', tenantCode: ''}
});
const columnListParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  }
});
const foreignListParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '', appId: '', tenantCode: ''
  }
});
const viewListParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  }
});
const appListParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false, author: false,
    appId: '', tenantCode: ''
  }
});
const tablePermissionFormParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', tableId: '', object: '', type: '', appId: '', tenantCode: ''
  }
});
const columnPermissionFormParams = ref({
  formState: props.formState, isModal: true, height: 0, isSystem: false, parameter: {
    connectId: '', tableId: '', object: '', type: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  }
});
const tableCopyParams = ref({
  id: '', visible: false, formState: 'add', formCol: 1, title: '', width: '',
  parameter: {appId: '', tenantCode: ''}
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
    // 加载模型信息
    tableFormParams.value.id = tableData.value.id;
    tableFormParams.value.formState = isSystem.value || props.refApp ? 'view' : props.formState;
    tableFormParams.value.parameter = {
      connectId: data.connectId, appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型字段
    columnListParams.value.formState = isSystem.value || props.refApp ? 'view' : props.formState;
    columnListParams.value.height = tableTabHeight.value - 310;
    columnListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      isSync: isSync.value >= 1, isSystem: isSystem.value,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型外键
    foreignListParams.value.formState = props.refApp ? 'view' : props.formState;
    foreignListParams.value.height = tableTabHeight.value - 310;
    foreignListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型视图
    viewListParams.value.formState = props.refApp ? 'view' : props.formState;
    viewListParams.value.height = tableTabHeight.value - 310;
    viewListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      isSync: isSync.value === 2, isSystem: isSystem.value,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载模型权限
    tablePermissionFormParams.value.height = tableTabHeight.value - 250;
    tablePermissionFormParams.value.parameter = {
      connectId: data.connectId, tableId: data.id,
      type: 'dp,mp', object: data.entityName,
      appId: props.refApp ? props.parameter.appId : data.appId,
      tenantCode: data.tenantCode
    };
    // 加载字段权限
    columnPermissionFormParams.value.height = tableTabHeight.value - 210;
    columnPermissionFormParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, type: 'cp', object: data.entityName,
      isSync: isSync.value >= 1, isSystem: isSystem.value,
      appId: data.appId, tenantCode: data.tenantCode
    };
    // 加载应用授权
    appListParams.value.height = tableTabHeight.value - 260;
    appListParams.value.parameter = {
      connectId: data.connectId, tableId: data.id, tableName: data.entityName,
      isSync: isSync.value === 2, isSystem: isSystem.value, author: false,
      appId: data.appId, tenantCode: data.tenantCode
    }
  });
}

/**
 * 更新模型信息
 */
const updateTable = () => {
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryTableForm) => {
      global.$message.success({content: '更新成功！'})
      tableFormat(tableData.value.id);
      emits('updateSuccess', data, props.formState);
    }, () => {
      global.$message.error({content: '更新失败！'})
    });
  }
}
/**
 * 删除模型信息
 */
const deleteTable = async () => {
  try {
    await modelApi.deleteTable(tableData.value.id);
    global.$message.success({content: '删除成功！'});
    emits('deleteSuccess', tableData.value, props.formState);
    visibleForm.value = false;
  } catch (err) {
    global.$message.error({content: '删除失败！'})
  }
}

const refreshMeta = async () => {
  try {
    await modelApi.refreshMetaRedis({
      tableId: props.modelValue,
      connectId: props.parameter.connectId || '',
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || ''
    });
    global.$message.success({content: '刷新缓存成功！'})
  } catch (err) {
    global.$message.error({content: '刷新缓存失败！'})
  }
}

const copyTable = () => {
  tableCopyParams.value.id = props.modelValue;
  tableCopyParams.value.title = '复制模型';
  tableCopyParams.value.parameter = {
    appId: props.parameter.appId, tenantCode: props.parameter.tenantCode
  }
  tableCopyParams.value.visible = true;
}
/**
 * 复制成功
 * @param data
 * @param action
 */
const tableCopySuccess = (data: QueryTableForm, action: string) => {
  tableCopyParams.value.visible = false;
  visibleForm.value = false;
  emits('updateSuccess', data, action);
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
const syncFromModelToTable = () => {
  createOrUpdateTable(tableData.value.entityName, () => {
    global.$message.success({content: '更新成功！'})
    tableFormat(tableData.value.id);
  }, () => {
    global.$message.error({content: '更新失败！'})
  });
}

const getPackBusData = (value: number) => {
  for (const item of packBusDataOptions.value) {
    if (item.value === value) {
      return item;
    }
  }
  return {label: '', value: '', other: ''};
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
  tableFormParams.value.id = '';
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>
<template>
  <a-modal draggable :key="utils.gid()" v-model:visible="visibleForm" :footer="false" :width="width || ''" title-align="start">
    <template #title>
      <a-space>
        {{ tabsTitle }}
        <a-button v-if="isSystem" class="list-action-button-default" status="warning" type="primary">
          <span>{{ utils.getOptionLabel(tableData.sourceType, sourceTypeOptions) }}</span>
        </a-button>
        <a-button v-if="[1,2].includes(tableData.packBusData)" class="list-action-button-default" status="danger" type="primary">
          <a-tooltip :content="getPackBusData(tableData.packBusData).other">
            <span>{{ getPackBusData(tableData.packBusData).label }}</span>
          </a-tooltip>
        </a-button>
        <a-button :disabled="isSync===0" class="list-action-button-default" type="primary">
          <span>{{ utils.getOptionLabel(isSync, tableSyncOptions) }}</span>
        </a-button>
      </a-space>
    </template>

    <GlModelTableCopy v-model:visible="tableCopyParams.visible"
                      :formCol="tableCopyParams.formCol"
                      :formState="tableCopyParams.formState"
                      :modelValue="tableCopyParams.id"
                      :parameter="tableCopyParams.parameter"
                      :title="tableCopyParams.title"
                      :width="tableCopyParams.width"
                      @saveSuccess="tableCopySuccess"/>

    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="top" type="line">
      <a-tab-pane :key="1" class="a-tabs-one" title="模型信息">
        <a-card class="general-card">
          <GlModelTableForm v-if="tableFormParams.id" ref="tableFormRef"
                            :formCol="tableFormParams.formCol"
                            :formState="tableFormParams.formState"
                            :modelValue="tableFormParams.id"
                            :parameter="tableFormParams.parameter"
                            :visible="visibleForm"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" class="a-tabs-one" title="模型字段">
        <a-card class="general-card">
          <GlModelTableColumnList v-if="visibleForm" :formState="columnListParams.formState"
                                  :height="columnListParams.height"
                                  :isModal="columnListParams.isModal"
                                  :parameter="columnListParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tooltip content="仅展示表格之间的关联，不同步至数据表中。" position="top">
        <a-tab-pane :key="3" class="a-tabs-two" title="模型外键">
          <template #title>
            <a-tooltip content="仅展示表格之间的关联，不同步至数据表中。" position="right">
              模型外键
              <gl-iconfont type="gl-warning-circle"/>
            </a-tooltip>
          </template>
          <a-card class="general-card">
            <GlModelTableForeignList v-if="visibleForm" :formState="foreignListParams.formState"
                                     :height="foreignListParams.height"
                                     :isModal="foreignListParams.isModal"
                                     :parameter="foreignListParams.parameter"/>
          </a-card>
        </a-tab-pane>
      </a-tooltip>
      <a-tab-pane :key="4" class="a-tabs-three" title="模型视图">
        <a-card class="general-card">
          <GlModelTableViewList v-if="visibleForm" :formState="viewListParams.formState"
                                :height="viewListParams.height"
                                :isModal="viewListParams.isModal"
                                :parameter="viewListParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="5" class="a-tabs-four" title="模型权限">
        <a-card class="general-card">
          <GlModelTablePermissionForm v-if="visibleForm" :formState="tablePermissionFormParams.formState"
                                      :height="tablePermissionFormParams.height"
                                      :isModal="tablePermissionFormParams.isModal"
                                      :refApp="refApp"
                                      :parameter="tablePermissionFormParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-if="!refApp" :key="6" class="a-tabs-five" title="字段权限">
        <a-card class="general-card">
          <GlModelTableColumnPermissionForm v-if="visibleForm" :formState="columnPermissionFormParams.formState"
                                            :height="columnPermissionFormParams.height"
                                            :isModal="columnPermissionFormParams.isModal"
                                            :parameter="columnPermissionFormParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-if="!refApp" :key="7" class="a-tabs-three" title="授权应用">
        <a-card class="general-card">
          <GlModelTableAppList v-if="visibleForm" :formState="appListParams.formState"
                               :height="appListParams.height"
                               :isModal="appListParams.isModal"
                               :parameter="appListParams.parameter"/>
        </a-card>
      </a-tab-pane>
      <template #extra>
        <a-space v-if="!refApp">
          <a-popconfirm v-if="!isSystem&&tabsKey===1" content="是否更新该条模型数据？" position="br" type="info" @ok="updateTable">
            <a-button :disabled="formState==='view'" size="small" type="outline" title="更新模型信息">
              <template #icon>
                <gl-iconfont type="gl-save"/>
              </template>
              更新
            </a-button>
          </a-popconfirm>
          <a-popconfirm v-if="!isSystem&&tabsKey===1" content="是否删除该条模型数据？" position="br" type="warning" @ok="deleteTable">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="outline" title="删除模型信息">
              <template #icon>
                <gl-iconfont type="gl-delete"/>
              </template>
              删除
            </a-button>
          </a-popconfirm>
          <a-popconfirm content="是否刷新该模型及拥有的视图的缓存？" position="br" type="warning" @ok="refreshMeta">
            <a-button :disabled="formState==='view'" size="small" status="warning" type="outline"
                      title="若应用设计时，在选择实体、实体字段和视图没有该模型、字段和视图，可点击此按钮。">
              <template #icon>
                <gl-iconfont type="gl-sync"/>
              </template>
              刷新模型缓存
            </a-button>
          </a-popconfirm>
          <a-popconfirm :content="`${tableData.entityName}，是否将模型同步至数据库中？`" position="br" type="warning" @ok="syncFromModelToTable">
            <a-button :disabled="isSystem||formState==='view'" size="small" type="outline" title="将模型信息，模型字段在数据库中创建或更新。">
              <template #icon>
                <gl-iconfont type="gl-sync"/>
              </template>
              模型同步至数据库
            </a-button>
          </a-popconfirm>
          <a-dropdown position="br">
            <a-button :disabled="formState==='view'" size="small" type="outline">
              更多&nbsp;
              <gl-iconfont type="gl-arrow-down"/>
            </a-button>
            <template #content>
              <a-doption v-if="tabsKey===1" style="color: rgb(var(--primary-6));" @click="copyTable">
                <template #icon>
                  <gl-iconfont type="gl-copy"/>
                </template>
                复制模型
              </a-doption>
              <a-divider style="margin: 0px 0px;"/>
              <a-doption :disabled="isSystem" style="color: rgb(var(--primary-6));" @click="syncFromTableToModel">
                <template #icon>
                  <gl-iconfont type="gl-sync"/>
                </template>
                数据库同步至模型
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