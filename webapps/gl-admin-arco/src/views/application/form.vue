<script lang="ts">
export default {
  name: 'ApplicationForm'
};
</script>

<script lang="ts" setup>
import {ref, shallowRef, watch} from "vue";
import {FormState, ModelParams} from "@/api/base";
// 引入组件
import ApplicationModel from './model.vue';

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

const visibleForm = ref<boolean>(false);
const tableFormRef = shallowRef(ApplicationModel);
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
      done();
      visibleForm.value = false;
      emits('saveSuccess', data, props.formState);
    }, () => {
      done(false);
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
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  modelParams.value.visible = visibleForm.value;
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-if="isModal"
           v-model:visible="visibleForm"
           :cancel-text="$t('security.permission.index.model.cancel.text')"
           :footer="formState!=='view'"
           :ok-text="$t('security.permission.index.model.ok.text')"
           :title="title || $t(`security.permission.index.model.title.${formState}`)"
           :width="width || ''" title-align="start"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <ApplicationModel ref="tableFormRef"
                      :visible="modelParams.visible"
                      :parameter="modelParams.parameter"
                      :formState="modelParams.formState"
                      :modelValue="modelParams.id"
                      :formCol="modelParams.formCol"/>
  </a-modal>
  <a-drawer v-if="!isModal"
            v-model:visible="visibleForm"
            :cancel-text="$t('security.permission.index.model.cancel.text')"
            :footer="formState!=='view'"
            :ok-text="$t('security.permission.index.model.ok.text')"
            :title="title || $t(`security.permission.index.model.title.${formState}`)"
            :width="width || ''" title-align="start"
            @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <ApplicationModel ref="tableFormRef"
                      :visible="modelParams.visible"
                      :parameter="modelParams.parameter"
                      :formState="modelParams.formState"
                      :modelValue="modelParams.id"
                      :formCol="modelParams.formCol"/>
  </a-drawer>
</template>

<style lang="less" scoped>

</style>