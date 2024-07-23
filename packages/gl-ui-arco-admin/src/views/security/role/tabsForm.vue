<script lang="ts">
export default {
  name: 'RoleTabsForm'
};
</script>

<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import {Message} from "@arco-design/web-vue";
import {utils, securityApi} from "@geelato/gl-ui";
import type {QueryRoleForm} from "@geelato/gl-ui";
import useLoading from "../../../hooks/loading";
import RoleModel from './model.vue';
import RoleAppList from './app/list.vue';
import RolePermissionList from './permission/list.vue';
import RoleTreeNodeList from './treenode/list.vue';
import RoleUserList from './user/list.vue';

// 页面所需 参数
type PageParams = {
  type: string; // 角色类型
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  isModal: {type: Boolean, default: true},// 弹层 - 方式，true-弹窗；false-抽屉
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: 544},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const {loading, setLoading} = useLoading(false);
const visibleForm = ref<boolean>(false);
const formData = ref<QueryRoleForm>({} as unknown as QueryRoleForm);
const tableFormRef = shallowRef(RoleModel);
const tabsKey = ref<number>(1);// 定位tabs页面

// 角色应用关联
const appListParams = ref({
  visible: false,
  parameter: {roleId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 300,
  pageSize: 50,
});
// 角色与权限关联
const permissionListParams = ref({
  visible: false,
  parameter: {roleId: '', permissionId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 245,
  pageSize: 50,
});
// 角色菜单关联
const nodeKey = ref(utils.generateRandom());
const nodeListParams = ref({
  visible: false,
  parameter: {roleId: '', treeNodeId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 125,
  pageSize: 10000,
});
// 角色用户关联
const userListParams = ref({
  visible: false,
  parameter: {roleId: '', userId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: (props.height as number) - 300,
  pageSize: 50,
});

/**
 * 获取应用信息
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await securityApi.getRole(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 获取应用信息后格式化数据
 * @param data
 */
const roleFormat = (data: QueryRoleForm) => {
  // 表格数据处理
  data.seqNo = Number(data.seqNo);
  formData.value = data;
  // 角色应用关联
  Object.assign(appListParams.value, {
    formState: props.formState, visible: true, parameter: {
      roleId: data.id,
      appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
  });
  // 角色权限关联
  Object.assign(permissionListParams.value, {
    formState: props.formState, visible: true, parameter: {
      roleId: props.modelValue, permissionId: '',
      appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
  });
  // 角色菜单关联
  Object.assign(nodeListParams.value, {
    formState: props.formState, visible: true, parameter: {
      roleId: props.modelValue, treeNodeId: '',
      appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
  });
  // 角色用户关联
  Object.assign(userListParams.value, {
    formState: props.formState, visible: true, parameter: {
      roleId: props.modelValue, userId: '',
      appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
  });
}

/**
 * 更新应用信息
 */
const updateRole = () => {
  setLoading(true)
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryRoleForm) => {
      setLoading(false);
      Message.success("更新成功！");
      roleFormat(data);
      emits('saveSuccess', data, props.formState);
    }, () => {
      setLoading(false);
    });
  }
};

watch(() => props, () => {
  if (props.visible === true) {
    tabsKey.value = 1;
    formData.value.id = props.modelValue;
    if (props.modelValue) {
      getData(props.modelValue, (data: QueryRoleForm) => {
        roleFormat(data);
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  if (visibleForm.value === false) {
    appListParams.value.visible = false;
    permissionListParams.value.visible = false;
    nodeListParams.value.visible = false;
    userListParams.value.visible = false;
  }
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal draggable  v-if="isModal" v-model:visible="visibleForm" :footer="false"
           :title="title || $t(`security.role.index.model.title.${formState}`)"
           :width="width || ''" title-align="start">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="{height: `${height}px`}" position="left" type="line">
      <a-tab-pane :key="1" :title="$t('security.role.form.tab.title.one')">
        <a-card class="">
          <template #extra>
            <a-space>
              <a-popconfirm :content="$t('searchTable.columns.operations.update.msg')" position="br" type="info" @ok="updateRole">
                <a-button :disabled="formState==='view'" :loading="loading" class="app-button" type="text">
                  <template #icon>
                    <icon-save/>
                  </template>
                  {{ $t('searchTable.columns.operations.update') }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <RoleModel ref="tableFormRef" :formCol="formCol"
                     :formState="formState" :model-value="formData.id"
                     :parameter="parameter" :visible="visibleForm"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-if="formData.type==='platform'&&formData.usedApp===true" :key="2" :title="$t('security.role.form.tab.title.two')">
        <a-card class="">
          <RoleAppList :filterCol="appListParams.filterCol"
                       :formState="appListParams.formState"
                       :height="appListParams.height"
                       :pageSize="appListParams.pageSize"
                       :parameter="appListParams.parameter"
                       :visible="appListParams.visible"
                       @add="()=>{nodeKey = utils.generateRandom()}"
                       @delete="()=>{nodeKey = utils.generateRandom()}"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="3" :title="$t('security.role.form.tab.title.three')">
        <a-card class="">
          <RolePermissionList :filterCol="permissionListParams.filterCol"
                              :formState="permissionListParams.formState"
                              :height="permissionListParams.height"
                              :pageSize="permissionListParams.pageSize"
                              :parameter="permissionListParams.parameter"
                              :visible="permissionListParams.visible"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :title="$t('security.role.form.tab.title.four')">
        <a-card class="">
          <template #extra>
            <a-space>
              <a-button class="app-button" type="text" @click="ev => {nodeKey = utils.generateRandom()}">
                <template #icon>
                  <icon-refresh/>
                </template>
                {{ $t('searchTable.actions.refresh') }}
              </a-button>
            </a-space>
          </template>
          <RoleTreeNodeList :key="nodeKey"
                            :filterCol="nodeListParams.filterCol"
                            :formState="nodeListParams.formState"
                            :height="nodeListParams.height"
                            :pageSize="nodeListParams.pageSize"
                            :parameter="nodeListParams.parameter"
                            :visible="nodeListParams.visible"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane :key="5" :title="$t('security.role.form.tab.title.five')">
        <a-card class="">
          <RoleUserList :filterCol="userListParams.filterCol"
                        :formState="userListParams.formState"
                        :height="userListParams.height"
                        :pageSize="userListParams.pageSize"
                        :parameter="userListParams.parameter"
                        :visible="userListParams.visible"/>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="less" scoped>

</style>