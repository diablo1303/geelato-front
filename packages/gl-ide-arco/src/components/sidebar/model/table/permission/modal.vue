<script lang="ts">
export default {
  name: 'GlModelTablePermissionModal'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import GlModelTablePermissionForm from "./form.vue";

type PageParams = {
  connectId: string; // 数据库链接id
  object: string; // 模型 entity
  type: string; // 权限类型
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型权限'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const visibleForm = ref<boolean>(false);
const tablePermissionFormParams = ref({
  formState: 'add', isModal: true, height: 0, parameter: {
    connectId: '', object: '', type: '', appId: '', tenantCode: ''
  }
});

watch(() => props, () => {
  if (props.visible === true) {
    tablePermissionFormParams.value.height = window.innerHeight - 340;
    tablePermissionFormParams.value.parameter = {
      connectId: props.parameter.connectId,
      type: props.parameter.type,
      object: props.parameter.object,
      appId: props.parameter?.appId,
      tenantCode: props.parameter?.tenantCode
    };
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="false" :title="title" :width="width"
           cancel-text="取消" ok-text="确认" title-align="start">
    <GlModelTablePermissionForm :formState="tablePermissionFormParams.formState"
                                :height="tablePermissionFormParams.height"
                                :isModal="tablePermissionFormParams.isModal"
                                :parameter="tablePermissionFormParams.parameter"/>
  </a-modal>
</template>

<style lang="less" scoped>

</style>