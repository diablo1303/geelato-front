<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('model.view.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('model.view.index.model.ok.text')"
      :title="$t(`model.view.index.model.title.${pageData.formState}`)"
      width="32%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <ViewModel ref="viewModelRef"></ViewModel>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {QueryViewForm as QueryModel} from '@/api/model';
import {ListUrlParams} from '@/api/base';
import ViewModel from "@/views/model/view/model.vue";

const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const viewModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (done: any) => {
  if (viewModelRef.value) {
    // @ts-ignore
    viewModelRef.value?.submitModel(done, (data: QueryModel) => {
      done();
      pageData.value.okBack(data);
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
  urlParams.loadSuccessBack = (data: QueryModel) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  // 加载页面
  if (viewModelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    viewModelRef.value?.loadModel(urlParams);
  }
  // 显示
  visibleModel.value = true;
  pageData.value.okBack = urlParams.closeBack ? urlParams.closeBack : pageData.value.okBack;
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