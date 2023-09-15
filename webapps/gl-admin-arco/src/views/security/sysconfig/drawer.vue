<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :cancel-text="$t('security.sysConfig.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.sysConfig.index.model.ok.text')"
      :title="$t(`security.sysConfig.index.model.title.${pageData.formState}`)"
      width="36%"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <SystemConfigModel ref="modelRef"/>
  </a-drawer>
</template>


<script lang="ts" setup>
import {ref} from "vue";
import {ListUrlParams} from '@/api/base';
import {QueryFileTemplateForm as QueryModel} from "@/api/template";
import SystemConfigModel from '@/views/security/sysconfig/model.vue';

const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const modelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (done: any) => {
  if (modelRef.value) {
    // @ts-ignore
    modelRef.value?.submitModel(done, (data: QueryModel) => {
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
  if (modelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    modelRef.value?.loadModel(urlParams);
  }
  // 显示
  visibleModel.value = true;
  pageData.value.okBack = urlParams.closeBack ? urlParams.closeBack : pageData.value.okBack;
}

// 将方法暴露出去
defineExpose({openForm});
</script>
<script lang="ts">
export default {
  name: 'SystemConfigDrawer'
};
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