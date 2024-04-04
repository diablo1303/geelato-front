<script lang="ts">
export default {
  name: 'RoleTabsForm'
};
</script>

<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import useLoading from "@/hooks/loading";
import {getRole, QueryRoleForm as QueryForm} from "@/api/security";
import {Message} from "@arco-design/web-vue";
import {generateRandom} from "@/utils/strings";
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
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const {loading, setLoading} = useLoading(false);
const visibleForm = ref<boolean>(false);
const formData = ref<QueryForm>({} as unknown as QueryForm);
const tableFormRef = shallowRef(RoleModel);
const tabsKey = ref<number>(1);// 定位tabs页面
const tableTabHeight = ref<number>(544);
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});

// 角色应用关联
const appListParams = ref({
  visible: false,
  parameter: {roleId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: tableTabHeight.value - 300,
  pageSize: 50,
});
// 角色与权限关联
const permissionListParams = ref({
  visible: false,
  parameter: {roleId: '', permissionId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: tableTabHeight.value - 245,
  pageSize: 50,
});
// 角色菜单关联
const nodeKey = ref(generateRandom());
const nodeListParams = ref({
  visible: false,
  parameter: {roleId: '', treeNodeId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: tableTabHeight.value - 125,
  pageSize: 10000,
});
// 角色用户关联
const userListParams = ref({
  visible: false,
  parameter: {roleId: '', userId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: tableTabHeight.value - 300,
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
    const {data} = await getRole(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 更新应用信息
 */
const updateRole = () => {
  setLoading(true)
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryForm) => {
      setLoading(false);
      Message.success("更新成功！");
      formData.value = data;
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
      getData(props.modelValue, (data: QueryForm) => {
        // 表格数据处理
        data.seqNo = Number(data.seqNo);
        formData.value = data;

        // 角色应用关联
        appListParams.value.formState = props.formState;
        appListParams.value.parameter = {
          roleId: props.modelValue,
          appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
        }
        // 角色权限关联
        permissionListParams.value.formState = props.formState;
        permissionListParams.value.parameter = {
          roleId: props.modelValue, permissionId: '',
          appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
        }
        // 角色菜单关联
        nodeListParams.value.formState = props.formState;
        nodeListParams.value.parameter = {
          roleId: props.modelValue, treeNodeId: '',
          appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
        }
        // 角色用户关联
        userListParams.value.formState = props.formState;
        userListParams.value.parameter = {
          roleId: props.modelValue, userId: '',
          appId: props.parameter?.appId || data.appId || '', tenantCode: props.parameter?.tenantCode || ''
        }
        appListParams.value.visible = true;
        permissionListParams.value.visible = true;
        nodeListParams.value.visible = true;
        userListParams.value.visible = true;
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
  <a-modal v-if="isModal" v-model:visible="visibleForm" :footer="false"
           :title="title || $t(`security.role.index.model.title.${formState}`)"
           :width="width || ''" title-align="start">
    <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" :style="tableTabStyle" position="left" type="line">
      <a-tab-pane :key="1" :title="$t('security.role.form.tab.title.one')">
        <a-card class="">
          <template #extra>
            <a-space>
              <a-popconfirm content="是否更新该角色的基本信息？" position="br" type="info" @ok="updateRole">
                <a-button :loading="loading" class="app-button" type="text">
                  <template #icon>
                    <icon-save/>
                  </template>
                  更新
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <RoleModel ref="tableFormRef" :formCol="formCol"
                     :formState="formState" :model-value="formData.id"
                     :parameter="parameter" :visible="visibleForm"/>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-if="formData.type!=='app'" :key="2" :title="$t('security.role.form.tab.title.two')">
        <a-card class="">
          <RoleAppList :filterCol="appListParams.filterCol"
                       :formState="appListParams.formState"
                       :height="appListParams.height"
                       :pageSize="appListParams.pageSize"
                       :parameter="appListParams.parameter"
                       :visible="appListParams.visible"/>
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
              <a-button class="app-button" type="text" @click="ev => {nodeKey = generateRandom()}">
                <template #icon>
                  <icon-refresh/>
                </template>
                刷新
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