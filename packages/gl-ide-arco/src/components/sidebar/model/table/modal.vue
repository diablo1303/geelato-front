<script lang="ts">
export default {
  name: 'GlModelTableModal'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import type {QueryTableForm} from '@geelato/gl-ui';
import {utils} from '@geelato/gl-ui';
import GlModelTableForm from "./form.vue";

type PageParams = {
  connectId?: string; // 数据库连接主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型信息'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const tableFormRef = ref(null);
const visibleForm = ref<boolean>(false);
const formParams = ref({id: '', key: ''});

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryTableForm) => {
      done();
      visibleForm.value = false;
      emits('saveSuccess', data, props.formState);
    }, () => {
      done(false);
    });
  }
};
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  if (props.visible === true) {
    formParams.value.id = props.modelValue;
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal draggable v-model:visible="visibleForm" :footer="formState!=='view'" :title="title"
           :width="width || ''" cancel-text="取消" ok-text="确定"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <GlModelTableForm ref="tableFormRef" v-model="formParams.id"
                      :formCol="formCol"
                      :formState="formState"
                      :parameter="parameter"
                      :visible="visibleForm"/>
  </a-modal>
</template>

<style lang="less" scoped>

</style>