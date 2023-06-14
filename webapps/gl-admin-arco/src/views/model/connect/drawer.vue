<template v-model="pageData">
  <a-drawer
      v-model:visible="visibleModel"
      :footer="pageData.button"
      :title="$t(`model.connect.index.model.title.${pageData.formState}`)"
      width="32%">
    <ConnectModel ref="connectModelRef"></ConnectModel>
    <template #footer>
      <a-space style="float: left;">
        <a-button type="outline" @click="connectLinkTest($event)">
          {{ $t('model.connect.index.model.title.link') }}
        </a-button>
      </a-space>
      <a-space>
        <a-button @click="handleModelCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
        <a-button type="primary" @click="handleModelOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n';
import {QueryConnectForm as QueryModel} from '@/api/service/model_service';
import {ListUrlParams} from '@/api/service/base_service';
import ConnectModel from "@/views/model/connect/model.vue";
import {Notification} from "@arco-design/web-vue";

const pageData = ref({
  formState: 'add', button: true, okBack: (data: QueryModel) => {
  }
});
const connectModelRef = ref(null);
// 国际化
const {t} = useI18n();
// 显示隐藏
const visibleModel = ref(false);
/* 表单 */
const handleModelOk = (ev: MouseEvent, done?: any) => {
  if (connectModelRef.value) {
    // @ts-ignore
    connectModelRef.value?.submitModel(done, (data: QueryModel) => {
      visibleModel.value = false;
      pageData.value.okBack(data);
    });
  }
};
const handleModelCancel = (ev: MouseEvent) => {
  visibleModel.value = false;
}
const connectLinkTest = (ev: MouseEvent) => {
  if (connectModelRef.value) {
    // @ts-ignore
    connectModelRef.value?.connectModel(function (result: boolean) {
      if (result === true) {
        Notification.success(t('model.connect.index.model.title.link.success'));
      } else {
        Notification.error(t('model.connect.index.model.title.link.fail'));
      }
    });
  }
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
    urlParams.formCol = 1;
    // @ts-ignore
    connectModelRef.value?.loadModel(urlParams);
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