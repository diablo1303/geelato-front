<script lang="ts">
export default {
  name: 'GlModelViewAppTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {modelApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryViewForm} from '@geelato/gl-ui';
import GlModelTablePermissionForm from '../../table/permission/form.vue';
import GlModelViewAppList from './list.vue';

type PageParams = {
  author: boolean; // 是否是作者
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
const tableData = ref<QueryViewForm>({} as QueryViewForm);
const tabsTitle = ref<string>('');
const tabsKey = ref<number>(1);// 定位tabs页面

const appListParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
    connectId: '', viewId: '', viewName: '',
    author: false, viewAppId: '', appId: '', tenantCode: ''
  }
});
const tablePermissionFormParams = ref({
  formState: props.formState, isModal: true, height: 0, parameter: {
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
    const {data} = await modelApi.getView(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 获取模型数据，并处理
 * @param id
 */
const tableFormat = (id: string) => {
  getData(id, (data: QueryViewForm) => {
    tabsTitle.value = `${data.title}（${data.viewName}）`;
    tableData.value = data;
    // 加载模型权限
    tablePermissionFormParams.value.height = tableTabHeight.value - 250;
    tablePermissionFormParams.value.parameter = {
      connectId: data.connectId, tableId: data.id,
      type: 'dp,mp', object: data.viewName,
      appId: props.refApp ? props.parameter.appId : data.appId,
      tenantCode: data.tenantCode
    };
    // 加载应用授权
    appListParams.value.height = tableTabHeight.value - 260;
    appListParams.value.parameter = {
      connectId: data.connectId, viewId: data.id, viewName: data.viewName,
      author: props.parameter.author,
      viewAppId: data.appId,
      appId: props.parameter.appId, tenantCode: props.parameter.tenantCode
    }
  });
}

const listChange = () => {
  emits('updateSuccess');
}

watch(() => props.visible, () => {
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
  <a-modal :key="utils.gid()" v-model:visible="visibleForm" :footer="false" :title="tabsTitle" :width="width || ''" title-align="start">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="left" type="line">
      <a-tab-pane :key="1" class="a-tabs-three" title="授权申请">
        <a-card class="general-card">
          <GlModelViewAppList v-if="visibleForm" :formState="appListParams.formState"
                              :height="appListParams.height"
                              :isModal="appListParams.isModal"
                              :parameter="appListParams.parameter"
                              @add="listChange" @delete="listChange"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="2" class="a-tabs-four" title="模型权限">
        <a-card class="general-card">
          <GlModelTablePermissionForm v-if="visibleForm" :formState="tablePermissionFormParams.formState"
                                      :height="tablePermissionFormParams.height"
                                      :isModal="tablePermissionFormParams.isModal"
                                      :refApp="refApp"
                                      :parameter="tablePermissionFormParams.parameter"/>
        </a-card>
      </a-tab-pane>
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