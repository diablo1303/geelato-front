<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.permission.index.model.cancel.text')"
      :footer="false"
      :ok-text="$t('security.permission.index.model.ok.text')"
      :title="$t(`security.permission.index.model.title.${pageData.formState}`)"
      width="64%">
    <PermissionForm ref="permissionFormRef"></PermissionForm>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {QueryTableColumnForm as QueryModel} from '@/api/model';
import {ListUrlParams} from '@/api/base';
import PermissionForm from "@/views/model/table/permission/form.vue";

const pageData = ref({formState: 'add', button: true});
const permissionFormRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;
/* 表单 */

const openForm = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  urlParams.loadFailBack = () => {
    pageData.value.button = false;
  }
  urlParams.loadSuccessBack = (data: QueryModel) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  // 加载页面
  if (permissionFormRef.value) {
    // @ts-ignore
    permissionFormRef.value?.loadList(urlParams);
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