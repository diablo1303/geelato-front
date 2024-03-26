<script lang="ts">
export default {
  name: 'GlCopyToClipboard'
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {utils, useGlobal} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue', 'clickCopy']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  width: {type: String, default: '16px'},
  title: {type: String, default: '点击复制'},
  successMsg: {type: String, default: '复制成功'},
  failMsg: {type: String, default: '复制失败'},
});

const global = useGlobal();
const mv = ref<string>('');

/**
 * 点击复制
 * @param ev
 */
const onClickCopy = (ev?: MouseEvent) => {
  utils.copyToClipboard(mv.value, (val: string) => {
    if (props.successMsg) global.$message.success({content: props.successMsg});
  }, (val: string) => {
    if (props.failMsg) global.$message.error({content: props.failMsg});
  });

  emits("clickCopy", mv.value);
}

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  mv.value = props.modelValue;
}, {deep: true, immediate: true});
</script>
<template>
  <a-tooltip :content="title" mini position="top">
    <a-button :style="{'width':`${width}`,'height':`${width}`}" type="text" @click="onClickCopy($event)">
      <template #icon>
        <gl-iconfont type="gl-copy"/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<style lang="less" scoped>
</style>