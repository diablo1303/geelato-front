<script lang="ts">
export default {
  name: 'ModelConnectForm'
};
</script>

<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import {FormState, ModelParams} from "@/api/base";
// 引入组件
import ModelConnectModel from './model.vue';

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  isModal: {type: Boolean, default: true},// 弹层 - 方式，true-弹窗；false-抽屉
  title: {type: String, default: ''},// 弹层 - 标题
  width: {type: String, default: ''},// 弹层 - 高度，为空-自然变化
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 页面状态
  height: {type: [Number, String], default: ''},// 弹层 - 高度，为空-自然变化
  formCol: {type: Number, default: 1},// 表单 - 一行显示个数
});

const tableFormRef = shallowRef(ModelConnectModel);
const visibleForm = ref<boolean>(false);
const connectLoading = ref<boolean>(false);
const modelParams = ref<ModelParams>({
  visible: false,
  parameter: props.parameter,
  formState: props.formState as FormState,
  id: props.modelValue,
  formCol: props.formCol,
});

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: Record<string, any>) => {
      visibleForm.value = false;
      emits('saveSuccess', data, props.formState);
    });
  }
};
/**
 * 取消按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}
/**
 * 测试连接
 * @param ev
 */
const connectLinkTest = (ev?: Event) => {
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.linkTest === 'function') {
    connectLoading.value = true;
    // @ts-ignore
    tableFormRef.value?.linkTest();
  }
}

watch(() => props, () => {
  if (props.visible === true) {
    Object.assign(modelParams.value, {
      visible: props.visible === true,
      parameter: props.parameter,
      formState: props.formState as FormState,
      id: props.modelValue,
      formCol: props.formCol,
    })
  }
  // 显示页面
  visibleForm.value = props.visible === true;
  connectLoading.value = false;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  modelParams.value.visible = visibleForm.value;
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-if="isModal"
           v-model:visible="visibleForm"
           :footer="formState!=='view'"
           :title="title || $t(`model.connect.index.model.title.${formState}`)"
           :width="width || ''" title-align="start">
    <ModelConnectModel ref="tableFormRef"
                       :formCol="modelParams.formCol"
                       :formState="modelParams.formState"
                       :modelValue="modelParams.id"
                       :parameter="modelParams.parameter"
                       :visible="modelParams.visible"
                       @linkTestFinish="args => {connectLoading=false;}"/>
    <template #footer>
      <a-space style="float: left;">
        <a-button :loading="connectLoading" status="success" @click="connectLinkTest">
          {{ $t('model.connect.index.model.title.link') }}
        </a-button>
      </a-space>
      <a-space>
        <a-button :disabled="connectLoading" @click="handleModelCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
        <a-button :disabled="connectLoading" type="primary" @click="handleModelOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
      </a-space>
    </template>
  </a-modal>
  <a-drawer v-if="!isModal"
            v-model:visible="visibleForm"
            :footer="formState!=='view'"
            :title="title || $t(`model.connect.index.model.title.${formState}`)"
            :width="width || ''" title-align="start">
    <ModelConnectModel ref="tableFormRef"
                       :formCol="modelParams.formCol"
                       :formState="modelParams.formState"
                       :modelValue="modelParams.id"
                       :parameter="modelParams.parameter"
                       :visible="modelParams.visible"
                       @linkTestFinish="args => {connectLoading=false;}"/>
    <template #footer>
      <a-space style="float: left;">
        <a-button :loading="connectLoading" status="success" @click="connectLinkTest">
          {{ $t('model.connect.index.model.title.link') }}
        </a-button>
      </a-space>
      <a-space>
        <a-button :disabled="connectLoading" @click="handleModelCancel($event)">{{ $t('model.connect.index.model.cancel.text') }}</a-button>
        <a-button :disabled="connectLoading" type="primary" @click="handleModelOk($event)">{{ $t('model.connect.index.model.ok.text') }}</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<style lang="less" scoped>

</style>