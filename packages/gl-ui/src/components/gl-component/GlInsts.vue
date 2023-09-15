<script lang="ts">
export default {
  name: 'GlInsts'
}
</script>
<script lang="ts" setup>
/**
 *  注册该组件到全局，确保在运行时解析时，能找到该名称的组件，不会告警
 *  注意，该组件不应在运行时渲染，如果有渲染，则代码存在问题，需检查
 *  在设计时中，存在同名的组件GlInsts，在加载设计器时，需注册覆盖该组件
 */
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
  <div>
    在运行时中不应出现GlInsts这个组件，请反馈给管理员检查。
  </div>
</template>

<style scoped>

</style>
