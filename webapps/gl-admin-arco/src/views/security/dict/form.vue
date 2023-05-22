<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('sercurity.dict.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('sercurity.dict.index.model.ok.text')"
      :title="$t(`sercurity.dict.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <DictModel ref="dictModelRef"></DictModel>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import DictModel from "@/views/security/dict/model.vue";
import {ListUrlParams, QueryDictForm} from '@/api/sercurity_service'

const pageData = ref({formState: 'add', button: true});
const dictModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
// 页面响应
let okSuccessBack: any;
/* 表单 */
const handleModelOk = (done: any) => {
  if (dictModelRef.value) {
    dictModelRef.value?.submitModel(done, () => {
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
  urlParams.loadSuccessBack = (data: QueryDictForm) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }
  // 加载页面
  if (dictModelRef.value) {
    dictModelRef.value?.loadModel(urlParams);
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