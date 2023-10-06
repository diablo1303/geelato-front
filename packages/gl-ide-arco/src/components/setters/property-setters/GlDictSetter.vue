<template>
  <a-select @change="onChange" v-model="mv" allow-search allow-clear>
    <a-option
      v-for="item in items"
      :value="item.value"
      :title="item.label"
      :class="{ 'gl-selected': mv === item.value }"
    >
      {{ item.label}}
    </a-option>
  </a-select>
</template>
<script lang="ts">
export default {
  name: 'GlDictSetter'
}
</script>
<script lang="ts" setup>
import {  ref, watch } from 'vue'
import { entityApi,  EntityMeta } from '@geelato/gl-ui'
// import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  将选择的字典项信息设置到ComponentSetterProvideProxy的上下文环境变量中
   */
  // exposeVarDictItems: {
  //   type: String,
  //   default() {
  //     return 'dictItems'
  //   }
  // }
})
const emits = defineEmits(['update:modelValue'])

// const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const ds = ref({ entityMeta: new EntityMeta() })
const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})

const items = ref([])

const onChange = (dictId: string) => {
  // const foundItem = items.value.find((item: any) => {
  //   return (item.value = dictId)
  // })
  // componentSetterProvideProxy.setVarValue(props.exposeVarDict, foundItem)
}

if (props.modelValue) {
  onChange(props.modelValue)
}

const fetchData = () => {
  entityApi.queryAllDict().then((res) => {
    items.value = res.data
  })
}
fetchData()
</script>