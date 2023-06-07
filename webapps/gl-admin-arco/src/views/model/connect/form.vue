<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      width="56%"
      :cancel-text="$t('model.connect.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('model.connect.index.model.ok.text')"
      :title="$t(`model.connect.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <ConnectModel ref="connectModelRef"></ConnectModel>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {QueryConnectForm as QueryModel} from '@/api/service/model_service';
import {ListUrlParams} from '@/api/service/base_service';
import ConnectModel from "@/views/model/connect/model.vue";

const pageData = ref({formState: 'add', button: true});
const connectModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;
/* 表单 */
const handleModelOk = (done: any) => {
  if (connectModelRef.value) {
    // @ts-ignore
    connectModelRef.value?.submitModel(done, () => {
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
  urlParams.loadSuccessBack = (data: QueryModel) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  // 加载页面
  if (connectModelRef.value) {
    urlParams.formCol = 2;
    // @ts-ignore
    connectModelRef.value?.loadModel(urlParams);
  }
  // 显示
  visibleModel.value = true;
  okSuccessBack = urlParams.closeBack || null;
}

// 将方法暴露出去
defineExpose({openForm});
</script>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>