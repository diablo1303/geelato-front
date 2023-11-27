<script lang="ts">
/**
 *  页面组件权限配置
 *  在页面组件的配置中，默认组件是可见可操作的，即不做权限控制，若需要做权限控制，则需要在组件设置时，对组件进行权限描述符标识
 *  在当前的配置页面中，只展示需要进行权限配置的组件（即带有权限描述符的组件）
 *
 *   一个角色对一个页面都有组页面组件权限
 *  当一个用户有多个角色时，不同角色对同一个页面有不一样的权限，需要对该页面组件权限进行合并
 */
export default {
  name: 'GlPagePermission'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   *  组件权限标识
   */
  modelValue: {
    type: Array as PropType<Array<string>>,
    default() {
      return []
    }
  },
  pageId: String
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <div></div>
</template>
