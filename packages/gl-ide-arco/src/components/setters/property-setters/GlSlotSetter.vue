<template>
  <a-switch v-model="checked">
    <template #checked> 开启插槽</template>
    <template #unchecked> 关闭插槽</template>
  </a-switch>
</template>
<script lang="ts">
/**
 *   插槽配置器，用于开启插槽
 */
export default {
  name: 'GlSlotSetter'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<ComponentInstance>,
    default() {
      return new ComponentInstance()
    }
  }
})
const mv = ref(props.modelValue)

const checked = ref(!!props.modelValue.componentName)

watch(
  checked,
  (val) => {
    if (checked.value) {
      // 有componentName，说明是已选择，不用改，无componentName，说明是新选择，需加上
      if (!mv.value.componentName) {
        const newInst = new ComponentInstance()
        newInst.props.label = mv.value?.props.label || '插槽'
        newInst.componentName = 'GlSlot'
        newInst.children = [
          {
            id: utils.gid('ph'),
            componentName: 'GlDndPlaceholder',
            props: {},
            slots: {},
            children: [],
            actions: []
          }
        ]
        mv.value = newInst
      }
    } else {
      mv.value = new ComponentInstance()
    }
    emits('update:modelValue', mv)
  },
  { immediate: true }
)
</script>
