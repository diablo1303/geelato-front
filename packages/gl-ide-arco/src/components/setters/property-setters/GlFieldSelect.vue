<template>
  <div>
    <a-select size="small" v-model="mv" @change="onChange" allow-search allow-clear>
      <a-option v-for="item in entityFieldMetas" :value="item.name">{{ item.title + ' ' + item.name }}</a-option>
    </a-select>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlFieldSelect'
}
</script>
<script lang="ts" setup>
/**
 *  基于inject('$entityDS')获取数据源
 */
import {inject, ref, watch} from 'vue'
import type {FieldMeta} from "@geelato/gl-ui";
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const entityFieldMetas = ref(new Array<FieldMeta>())
const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})
const ds = inject('$entityDS')
if(!ds){
  console.error('未注入实体数据源：$entityDS，请检查是否已从服务端加载数据源。')
}
console.log('field select inject ds:',ds)
// @ts-ignore
entityFieldMetas.value = ds.value.entityMeta.fieldMetas

const onChange = () => {

}
</script>

<style scoped>

</style>
