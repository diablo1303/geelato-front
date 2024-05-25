<script lang="ts">
import type { RenderFunction } from 'vue'

export default {
  name: 'GlDescriptions'
}

export interface GlDescData {
  label: string | RenderFunction
  // 由于用value字段时，UI异常，这使用content字段代替，后续进行转换
  content: string | RenderFunction
  span?: number
}
</script>
<script lang="ts" setup>
import { computed, type PropType, ref, watch } from 'vue'
import type { DescData } from '@arco-design/web-vue'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<DescData[]>,
    default: () => []
  },
  label: String,
  items: {
    type: Array as PropType<GlDescData[]>,
    default() {
      return []
    }
  }
})

// 由于用value字段时，UI异常，这使用content字段代替，这里用valueItems进行转换
const valueItems = computed(() => {
  let ary: DescData[] = []
  props.items.forEach((item) => {
    ary.push({
      label: item.label,
      value: item.content,
      span: item.span
    })
  })
  return ary
})

watch(
  props,
  () => {
    mv.value = valueItems.value
  },
  { deep: true }
)

const mv = ref(
  utils.isArray(props.modelValue) && props.modelValue.length > 0
    ? props.modelValue
    : valueItems.value
)
watch(mv, (val) => {
  emits('update:modelValue', val)
})
</script>

<template>
  <div>
    <a-descriptions v-bind="$attrs" :title="label" :data="mv"></a-descriptions>
  </div>
</template>
