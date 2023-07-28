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
// TODO 待集成后台服务
import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <a-input v-model="mv" placeholder="TODO 待集成后台服务"></a-input>
</template>

<style scoped>

</style>
