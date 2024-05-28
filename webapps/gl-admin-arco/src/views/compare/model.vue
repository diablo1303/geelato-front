<script lang="ts">
export default {
  name: 'CompareModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {QueryAppForm, QueryAppVersionForm} from "@/api/application";
import UploadFile from "@/components/upload-file/index.vue";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {PageParams} from "@/views/compare/type";

const emits = defineEmits(['update:modelValue', 'fetch', 'add', 'edit', 'delete']);
const props = defineProps({
  modelValue: {type: Array<QueryAppVersionForm>, default: []},
  appValue: {type: Array<QueryAppForm>, default: []},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'view'}, // 页面状态
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

const renderData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appSelectOptions = ref<QueryAppForm[]>([]);

/**
 * 通过应用主键获取应用名称
 * @param appId
 */
const getAppOptionLabel = (appId: string) => {
  if (appSelectOptions.value && appSelectOptions.value.length > 0) {
    for (let i = 0; i < appSelectOptions.value.length; i += 1) {
      if (appSelectOptions.value[i].id === appId) {
        return `（${appSelectOptions.value[i].name}）`;
      }
    }
  }
  return '';
}

watch(() => props, (val) => {
  if (props.visible === true) {
    renderData.value = (props.modelValue || {}) as unknown as QueryAppVersionForm;
    appSelectOptions.value = props.appValue || [];
  }
}, {deep: true, immediate: true});
</script>
<template>
  <a-form :label-col-props="{ span: '2px' }" :model="renderData" class="form" style="padding-left: 16px;">
    <a-form-item field="appId" label="应用主键：">
      <CopyToClipboard v-if="renderData.appId" :model-value="renderData.appId"/>
      <span>{{ renderData.appId }}{{ getAppOptionLabel(renderData.appId) }}</span>
    </a-form-item>
    <a-form-item field="version" label="版本名称：">
      <span>{{ renderData.version }}</span>
    </a-form-item>
    <a-form-item field="packageSource" label="版本来源：">
      <span>{{ renderData.packageSource }}</span>
    </a-form-item>
    <a-form-item field="packetTime" label="打包时间：">
      <span>{{ renderData.packetTime }}</span>
    </a-form-item>
    <a-form-item field="creatorName" label="打包人员：">
      <span>{{ renderData.creatorName }}</span>
    </a-form-item>
    <a-form-item field="packagePath" label="应用包：">
      <UploadFile v-model="renderData.packagePath" :disabled="true"/>
    </a-form-item>
    <a-form-item field="description" label="版本描述：">
      <span :title="renderData.description">{{ renderData.description }}</span>
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped>

</style>