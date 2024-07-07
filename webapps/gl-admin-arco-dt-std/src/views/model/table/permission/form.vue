<script lang="ts">
export default {
  name: 'ModelTablePermissionForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import ModelTablePermissionList from "./list.vue";

interface PageParams {
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
  title: {type: String, default: ''},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const visibleForm = ref<boolean>(false);
const listParams = ref({
  visible: false,
  parameter: {
    connectId: props.parameter.connectId,
    type: props.parameter.type,
    object: props.parameter.object,
    appId: props.parameter?.appId,
    tenantCode: props.parameter?.tenantCode
  },
  formState: props.formState,
  filterCol: 3,
  pageSize: 10000,
  height: window.innerHeight - 340,
});

watch(() => props, () => {
  if (props.visible === true) {
    listParams.value.height = window.innerHeight - 340;
    listParams.value.visible = props.visible === true;
    listParams.value.parameter = {
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
  listParams.value.visible = visibleForm.value;
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="false"
           :title="title || $t(`security.permission.index.model.title.${formState}`)"
           :width="width || ''"
           title-align="start">
    <ModelTablePermissionList :filterCol="listParams.filterCol"
                              :formState="listParams.formState"
                              :height="listParams.height"
                              :pageSize="listParams.pageSize"
                              :parameter="listParams.parameter"
                              :visible="listParams.visible"/>
  </a-modal>
</template>

<style lang="less" scoped>

</style>