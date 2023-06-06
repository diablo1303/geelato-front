<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('sercurity.user.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.user.index.model.ok.text')"
      :title="$t(`sercurity.user.index.model.title.${pageData.formState}`)"
      width="65%"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <UserModel ref="userModelRef"></UserModel>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import UserModel from '@/views/security/user/model.vue'
import {QueryUserForm} from "@/api/service/sercurity_service";
import {ListUrlParams} from '@/api/service/base_service';

const pageData = ref({formState: 'add', button: true});
const userModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;

/* 表单 */
const handleModelOk = (done: any) => {
  if (userModelRef.value) {
    userModelRef.value?.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = () => {
  visibleModel.value = false;
}

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryUserForm) => {
    // eslint-disable-next-line no-console
    console.log(data);
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