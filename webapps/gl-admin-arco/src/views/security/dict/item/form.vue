<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.dictItem.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.dictItem.index.model.ok.text')"
      :title="$t(`security.dictItem.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
  </a-modal>
  <DictItemModel ref="dictItemModelRef"></DictItemModel>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ListUrlParams} from '@/api/service/base_service';
import DictItemModel from "@/views/security/dict/item/model.vue";
import {QueryDictForm as QueryModel} from '@/api/service/security_service';

const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const dictItemModelRef = ref(null);
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (done: any) => {
  if (dictItemModelRef.value) {
    // @ts-ignore
    dictItemModelRef.value?.submitModel(done, (data: QueryModel) => {
      visibleModel.value = false;
      pageData.value.okBack(data);
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
  if (dictItemModelRef.value) {
    urlParams.formCol = 1;
    // @ts-ignore
    dictItemModelRef.value?.loadModel(urlParams);
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