<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.role.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.role.index.model.ok.text')"
      :title="$t(`security.role.index.model.title.${pageData.formState}`)"
      width="65%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <RoleModel ref="roleModelRef"></RoleModel>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import RoleModel from '@/views/security/role/model.vue'
import {QueryRoleForm} from "@/api/service/security_service";
import {ListUrlParams} from '@/api/service/base_service';

const pageData = ref({formState: 'add', button: true});
const roleModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;

/* 表单 */
const handleModelOk = (done: any) => {
  if (roleModelRef.value) {
    // @ts-ignore
    roleModelRef.value?.submitModel(done, () => {
      done();
      okSuccessBack();
    }, () => {
      done(false);
    });
  }
};
const handleModelCancel = (e: Event) => {
  visibleModel.value = false;
}

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryRoleForm) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  // 加载页面
  if (roleModelRef.value) {
    // @ts-ignore
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