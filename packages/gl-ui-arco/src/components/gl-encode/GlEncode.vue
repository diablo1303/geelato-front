<script lang="ts">
/**
 *  编码控件
 *  选择绑定后台的编码
 */
export default {
  name: 'GlEncode'
}
</script>
<script lang="ts" setup>
import {ref, watch, inject} from "vue";
import {encodingApi, mixins, PageProvideKey, type PageProvideProxy} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  编码ID
   *  对应编码表中的ID
   */
  codedId: String,
  ...mixins.props
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

watch(() => {
  return props.modelValue
}, () => {
  mv.value = props.modelValue
})
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

// 构建一个编码
const genOneCode = () => {
  if (props.glIsRuntime && pageProvideProxy?.isPageStatusCreate()) {
    // 无编码值，且有编码模板id时
    if (!props.modelValue && props.codedId) {
      encodingApi.generateCode(props.codedId).then((res) => {
        mv.value = res.data
      })
    }
  }
}

genOneCode()
</script>

<template>
  <a-input class="gl-encode" v-model="mv"></a-input>
</template>

