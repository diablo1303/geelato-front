<template>
  <div>
    <a-select size="small" v-model="mv" @change="onChange">
      <a-option v-for="item in ds.entityMeta.fieldMetas" :value="item.name">{{ item.title + ' ' + item.name }}</a-option>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
import {inject, ref, watch} from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const entityFieldMetas = ref([])
const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})
const ds = inject('$entityDS')
console.log('field select inject ds:',ds)
entityFieldMetas.value = ds.value.entityMeta.fieldMetas

const onChange = () => {

}
</script>

<style scoped>

</style>
