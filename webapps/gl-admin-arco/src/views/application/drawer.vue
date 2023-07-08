<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('application.app.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('application.app.model.ok.text')"
      :title="$t(`application.app.model.title.${pageData.formState}`)"
      width="30%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <AppModel ref="appModelRef"></AppModel>
  </a-drawer>
</template>


<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import {ListUrlParams} from '@/api/service/base_service';
import AppModel from "@/views/application/model.vue";
import {QueryAppForm as QueryModel} from "@/api/service/app_service";

const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const appModelRef = shallowRef(AppModel);
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (done: any) => {
  if (appModelRef.value) {
    appModelRef.value?.submitModel(done, (data: QueryModel) => {
      visibleModel.value = false;
      pageData.value.okBack(data);
      done();
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
  if (appModelRef.value) {
    urlParams.formCol = 1;
    appModelRef.value?.loadModel(urlParams);
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