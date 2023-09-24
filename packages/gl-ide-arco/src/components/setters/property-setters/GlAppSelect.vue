<script lang="ts">
export default {
  name: 'GlAppSelect'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { entityApi, EntityReader } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const apps: Ref<Array<Record<string, any>>> = ref([])

const fetchData = () => {
  const er: EntityReader = new EntityReader()
  er.entity = 'platform_app'
  entityApi.queryByEntityReader(er).then((res) => {
    apps.value = res.data
  })
}
</script>

<template>
  <a-select v-model="mv" allow-search>
    <a-option v-for="item in apps" :value="item.id" :class="{ 'gl-selected': mv === item.id }">
      {{ item.name }}
    </a-option>
  </a-select>
</template>
