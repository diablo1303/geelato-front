<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      width="30%"
      :cancel-text="$t('security.dict.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.dict.index.model.ok.text')"
      :title="$t(`security.dict.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel"
      @before-ok="handleModelOk">
    <DictModel ref="dictModelRef"></DictModel>
  </a-drawer>
</template>


<script lang="ts" setup>
import {ref} from "vue";
import {ListUrlParams} from '@/api/service/base_service';
import {QueryDictForm as QueryModel} from "@/api/service/security_service";
import DictModel from "@/views/security/dict/model.vue";


const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const dictModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (done: any) => {
  if (dictModelRef.value) {
    // @ts-ignore
    dictModelRef.value?.submitModel(done, (data: QueryModel) => {
      done();
      pageData.value.okBack(data);
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
  if (dictModelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    dictModelRef.value?.loadModel(urlParams);
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