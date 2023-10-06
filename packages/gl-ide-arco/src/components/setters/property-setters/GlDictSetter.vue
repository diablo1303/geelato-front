<template>
  <a-select v-model="mv" allow-search allow-clear>
    <a-option
      v-for="item in items"
      :value="item.value"
      :title="item.label"
      :class="{ 'gl-selected': mv === item.value }"
    >
      {{ item.label }}
    </a-option>
  </a-select>
</template>
<script lang="ts">
export default {
  name: 'GlDictSetter'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { entityApi } from '@geelato/gl-ui'

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const emits = defineEmits(['update:modelValue'])

const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})

const items: Ref<{ value: string; label: string }[]> = ref([])

const fetchData = () => {
  entityApi.queryAllDict().then((res) => {
    items.value = res.data
  })
}
fetchData()
</script>
