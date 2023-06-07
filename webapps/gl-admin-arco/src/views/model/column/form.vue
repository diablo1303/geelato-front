<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      width="28%"
      :cancel-text="$t('model.column.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('model.column.index.model.ok.text')"
      :title="$t(`model.column.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <ColumnModel ref="columnModelRef"></ColumnModel>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {QueryTableColumnForm as QueryModel} from '@/api/service/model_service';
import {ListUrlParams} from '@/api/service/base_service';
import ColumnModel from "@/views/model/column/model.vue";

const pageData = ref({formState: 'add', button: true});
const columnModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;
/* 表单 */
const handleModelOk = (done: any) => {
  if (columnModelRef.value) {
    // @ts-ignore
    columnModelRef.value?.submitModel(done, () => {
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
  if (columnModelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    columnModelRef.value?.loadModel(urlParams);
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