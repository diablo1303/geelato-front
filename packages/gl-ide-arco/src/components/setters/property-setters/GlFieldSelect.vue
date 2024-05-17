<template>
  <a-select
    size="small"
    v-model="mv"
    @change="onChange"
    allow-search
    allow-clear
    :multiple="multiple"
    @click="onClick"
  >
    <a-option
      v-for="item in selectableFieldMetas"
      :value="item.name"
      :class="{ 'gl-selected': mv === item.name }"
    >
      {{ item.title + ' ' + item.name }}
    </a-option>
  </a-select>
</template>

<script lang="ts">
export default {
  name: 'GlFieldSelect'
}
</script>
<script lang="ts" setup>
import { computed, inject, onMounted, type PropType, ref, watch } from 'vue'
import type { FieldMeta } from '@geelato/gl-ui'
import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个entityMeta时，需要明确依赖哪一个
   */
  dependVarEntityMeta: {
    type: String,
    default() {
      return 'entityMeta'
    }
  },
  multiple: Boolean,
  /**
   * 忽略的字段，不可选择的字段
   */
  ignoreFields: Array as PropType<Array<string>>
})
const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const entityFieldMetas = ref(new Array<FieldMeta>())
const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const onChange = () => {}
const onClick = () => {
  setData()
}

/**
 *  过滤掉ignoreFields中的字段
 */
const selectableFieldMetas = computed(() => {
  if (props.ignoreFields && props.ignoreFields.length > 0)
    return entityFieldMetas.value?.filter((item) => !props.ignoreFields?.includes(item.name))
  return entityFieldMetas.value
})

const setData = () => {
  // console.log('componentSetterProvideProxy.getVarsRef():', componentSetterProvideProxy.getVarsRef())
  // console.log('componentSetterProvideProxy.getVar(props.dependVarEntityMeta):', componentSetterProvideProxy.getVarValue(props.dependVarEntityMeta))

  // entityFieldMetas.value = componentSetterProvideProxy.getEntityDsRef()?.value?.entityMeta?.fieldMetas
  entityFieldMetas.value = componentSetterProvideProxy.getVarValue(
    props.dependVarEntityMeta
  )?.fieldMetas
}
onMounted(() => {
  setData()
})
</script>

<style scoped></style>
