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
  entityMetaVarName: {
    type: String,
    default() {
      return 'entityMeta'
    }
  }
})
const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!


const entityFieldMetas = ref(new Array<FieldMeta>())
const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})

const onChange = () => {

}
const onClick = () => {
  setData()
}

const setData = () => {
  // console.log('componentSetterProvideProxy.getVarsRef():', componentSetterProvideProxy.getVarsRef())
  // console.log('componentSetterProvideProxy.getVar(props.entityMetaVarName):', componentSetterProvideProxy.getVar(props.entityMetaVarName))

  // entityFieldMetas.value = componentSetterProvideProxy.getEntityDsRef()?.value?.entityMeta?.fieldMetas
  entityFieldMetas.value = componentSetterProvideProxy.getVar(props.entityMetaVarName)?.fieldMetas

}
onMounted(() => {
  setData()
})
</script>

<style scoped>

</style>
