<script lang="ts">
export default {
  name: 'GlCopyToClipboardAdmin'
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {Message} from "@arco-design/web-vue";
import {utils} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue', 'clickCopy']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  title: {type: String, default: ''},
  width: {type: String, default: '16px'}
});

const {t} = useI18n();
const mv = ref({
  copyValue: props.modelValue,
  copyWidth: props.width,
  copyHeight: props.width,
  copyTitle: props.title
});

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  mv.value.copyValue = props.modelValue;
  mv.value.copyWidth = props.width || '16px';
  mv.value.copyHeight = props.width || '16px';
  mv.value.copyTitle = props.title;
}, {deep: true, immediate: true});

/**
 * 点击复制
 * @param value
 */
const onClickCopy = (value: string) => {
  utils.copyToClipboard(value, () => {
    Message.success(t('copyToClipboard.success'));
  }, () => {
    Message.error(t('copyToClipboard.fail'));
  });
  emits("clickCopy", value);
}
</script>
<template>
  <a-tooltip :content="`${mv.copyTitle?mv.copyTitle:$t('copyToClipboard.button.tip')}`" mini position="top">
    <a-button :style="{'width':`${mv.copyWidth}`,'height':`${mv.copyHeight}`}" type="text" @click="onClickCopy(mv.copyValue)">
      <template #icon>
        <icon-copy/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<style lang="less" scoped>
</style>