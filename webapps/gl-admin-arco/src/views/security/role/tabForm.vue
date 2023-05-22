<template v-model="pageData">
  <div class="container">
    <a-card class="general-card general-card1">
      <a-modal
          v-model:visible="visibleModel"
          :cancel-text="$t('sercurity.role.index.model.cancel.text')"
          :footer="pageData.button"
          :ok-text="$t('sercurity.role.index.model.ok.text')"
          :title="$t(`sercurity.role.index.model.title.${pageData.formState}`)"
          width="80%"
          @cancel="handleModelCancel"
          @before-ok="handleModelOk">
        <a-row>
          <a-col :span="24">
            <a-tabs v-model:active-key="pageData.tabKey" :default-active-tab="1" :position="'left'" type="rounded" @tab-click="tabsChange">
              <a-tab-pane key="1" :title="$t('sercurity.role.form.tab.title.one')">
                <RoleModel ref="roleModelRef"></RoleModel>
              </a-tab-pane>
              <a-tab-pane key="2" :title="$t('sercurity.role.form.tab.title.two')">
                <a-card class="general-card">
                  <RoleAppList ref="roleAppListRef"></RoleAppList>
                </a-card>
              </a-tab-pane>
              <a-tab-pane key="3" :title="$t('sercurity.role.form.tab.title.three')">
                <a-card class="general-card">
                  <RolePermissionList ref="rolePermissionListRef"></RolePermissionList>
                </a-card>
              </a-tab-pane>
              <a-tab-pane key="4" :title="$t('sercurity.role.form.tab.title.four')">
                <a-card class="general-card">
                  <RoleTreeNodeList ref="roleTreeNodeListRef"></RoleTreeNodeList>
                </a-card>
              </a-tab-pane>
              <a-tab-pane key="5" :title="$t('sercurity.role.form.tab.title.five')">
                <a-card class="general-card">
                  <RoleUserList ref="roleUserListRef"></RoleUserList>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ListUrlParams, QueryRoleForm} from "@/api/sercurity_service";
import RoleModel from '@/views/security/role/model.vue'
import RoleAppList from '@/views/security/role/app/list.vue'
import RolePermissionList from '@/views/security/role/permission/list.vue'
import RoleTreeNodeList from '@/views/security/role/treenode/list.vue'
import RoleUserList from '@/views/security/role/user/list.vue'

const pageData = ref({formState: 'add', button: true, tabKey: '1'});
const roleModelRef = ref(null);
const roleAppListRef = ref(null);
const rolePermissionListRef = ref(null);
const roleTreeNodeListRef = ref(null);
const roleUserListRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;

const tabsChange = (key: string) => {
  pageData.value.tabKey = key;
}
/* 表单 */
const handleModelOk = (done: any) => {
  pageData.value.tabKey = '1';
  if (roleModelRef.value) {
    roleModelRef.value?.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = () => {
  visibleModel.value = false;
  okSuccessBack();
}

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryRoleForm) => {
    urlParams.params = {roleId: data.id, roleName: data.name};
    if (roleAppListRef.value) {
      roleAppListRef.value?.loadList(urlParams);
    }
    if (rolePermissionListRef.value) {
      rolePermissionListRef.value?.loadList(urlParams);
    }
    if (roleTreeNodeListRef.value) {
      roleTreeNodeListRef.value?.loadList(urlParams);
    }
    if (roleUserListRef.value) {
      roleUserListRef.value?.loadList(urlParams);
    }
  }
  // 加载页面
  if (roleModelRef.value) {
    roleModelRef.value?.loadModel(urlParams);
  }
  // 显示
  visibleModel.value = true;
  okSuccessBack = urlParams.closeBack || null;
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style lang="less" scoped>

</style>