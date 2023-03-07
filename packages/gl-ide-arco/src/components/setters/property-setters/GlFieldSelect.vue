<template>
  <div>
    <a-select size="small" v-model="mv" @change="onChange">
      <a-option v-for="item in entityFieldMetas" :value="item.name">{{ item.title + ' ' + item.name }}</a-option>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
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
console.log('field select inject ds:',ds)
// @ts-ignore
entityFieldMetas.value = ds.value.entityMeta.fieldMetas

const onChange = () => {

}
</script>

<style scoped>

</style>
