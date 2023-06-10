<template>
  <a-select size="small" v-model="mv" @change="onChange" allow-search allow-clear @click="onClick">
    <a-option v-for="item in entityFieldMetas" :value="item.name">{{ item.title + ' ' + item.name }}</a-option>
  </a-select>
</template>

<script lang="ts">
export default {
  name: 'GlFieldSelect'
}
</script>
<script lang="ts" setup>

import {inject, onMounted, provide, ref, watch} from 'vue'
import type {FieldMeta} from "@geelato/gl-ui";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "../ComponentSetterProvideProxy";

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
  }
})
const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!


const entityFieldMetas = ref(new Array<FieldMeta>())
const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const onChange = () => {

}
const onClick = () => {
  setData()
}

const setData = () => {
  // console.log('componentSetterProvideProxy.getVarsRef():', componentSetterProvideProxy.getVarsRef())
  // console.log('componentSetterProvideProxy.getVar(props.dependVarEntityMeta):', componentSetterProvideProxy.getVar(props.dependVarEntityMeta))

  // entityFieldMetas.value = componentSetterProvideProxy.getEntityDsRef()?.value?.entityMeta?.fieldMetas
  entityFieldMetas.value = componentSetterProvideProxy.getVarValue(props.dependVarEntityMeta)?.fieldMetas

}
onMounted(() => {
  setData()
})
</script>

<style scoped>

</style>
