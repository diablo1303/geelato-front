<script lang="ts">
export default {
  name: 'GlSelect'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { inject, PropType, ref, watch } from 'vue'
import { PageProvideKey, type PageProvideProxy } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  options: {
    type: Array,
    default() {
      return []
    }
  },
  readonly: Boolean,
  size: String as PropType<'medium' | 'small' | 'mini' | 'large' | undefined>,
  placeholder: String,
  disabled: Boolean,
  /**
   *  选择的名称绑定的组件id
   *  在选择时，同时将名称值绑定到另一个组件中，如果不设置，则不需绑定
   *  可以有多个id，多个id之间用“,”分隔
   */
  nameFieldBindComponentId: {
    type: String,
    default() {
      return ''
    }
  },
  valueFieldBindComponentId: {
    type: String,
    default() {
      return ''
    }
  }
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

watch(
  () => {
    return props.modelValue
  },
  () => {
    mv.value = props.modelValue
  },
  { deep: true }
)

watch(
  mv,
  () => {
    // 回写名称
    const foundOption: any = props.options.find((option: any) => {
      return option.value === mv.value
    })
    const label = foundOption?.label || ''
    if (props.nameFieldBindComponentId) {
      const ids = props.nameFieldBindComponentId.split(',')
      ids.forEach((id: string) => {
        pageProvideProxy.setComponentValue(id, label)
      })
    }
    // 回写值
    if (props.valueFieldBindComponentId) {
      const ids = props.valueFieldBindComponentId.split(',')
      ids.forEach((id: string) => {
        pageProvideProxy.setComponentValue(id, mv.value)
      })
    }

    emits('update:modelValue', mv.value)
  },
  { deep: true }
)
</script>

<template>
  <ASelect
    :options="options"
    v-model="mv"
    :readonly="readonly"
    :size="size"
    :disabled="disabled"
  ></ASelect>
</template>
