<template v-model="pageData">
  <div class="container">
    <a-card class="general-card general-card1">
      <a-modal
          v-model:visible="visibleModel"
          :cancel-text="$t('security.user.index.model.cancel.text')"
          :footer="pageData.button"
          :ok-text="$t('security.user.index.model.ok.text')"
          :title="$t(`security.user.index.model.title.${pageData.formState}`)"
          width="80%"
          @cancel="handleModelCancel($event)"
          @before-ok="handleModelOk">
        <a-row>
          <a-col :span="24">
            <a-tabs v-model:active-key="pageData.tabKey"
                    :default-active-tab="1" position="left" type="rounded" @tab-click="tabsChange">
              <a-tab-pane key="1" :title="$t('security.user.forml.tab.title.one')">
                <UserModel ref="userModelRef"></UserModel>
              </a-tab-pane>
              <a-tab-pane key="2" :title="$t('security.user.forml.tab.title.two')">
                <a-card class="general-card">
                  <OrgUserList ref="orgUserListRef"></OrgUserList>
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
import {ref, shallowRef} from "vue";
import {QueryUserForm} from "@/api/security";
import {ListUrlParams} from '@/api/base';
import UserModel from '@/views/security/user/model.vue'
import OrgUserList from '@/views/security/user/org/list.vue'

const pageData = ref({formState: 'add', button: true, tabKey: '1'});
const userModelRef = shallowRef(UserModel);
const orgUserListRef = ref(null);
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
  if (userModelRef.value) {
    userModelRef.value.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = (e: Event) => {
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
  urlParams.loadSuccessBack = (data: QueryUserForm) => {
    if (orgUserListRef.value) {
      urlParams.params = {userId: data.id, userName: data.name};
      // @ts-ignore
      orgUserListRef.value?.loadList(urlParams);
    }
  }
  // 加载页面
  if (userModelRef.value) {
    userModelRef.value?.loadModel(urlParams);
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