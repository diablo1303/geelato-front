<script lang="ts">
export default {
  name: 'GlOptionsDynamicBuilder'
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        entityName: '',
        labelFieldNames: [],
        valueFieldName: '',
        orderFieldName: '',
        ascOrDesc: '+',
        allowClear: true,
        allowSearch: true
      }
    }
  }
})
const labelFieldName = ref(
  props.modelValue.labelFieldNames.length > 0 ? props.modelValue.labelFieldNames[0] : ''
)
watch(labelFieldName, () => {
  mv.value.labelFieldNames = [labelFieldName.value]
})
const mv = ref(props.modelValue)
watch(
  mv,
  () => {
    emits('update:modelValue', mv.value)
  },
  { deep: true }
)

const handleSubmit = (data: any) => {}
</script>

<template>
  <a-form :model="mv" @submit="handleSubmit">
    <a-form-item field="entityName" label="实体名称">
      <a-input v-model="mv.entityName" />
    </a-form-item>
    <a-form-item field="labelFieldName" label="标题字段">
      <a-input v-model="labelFieldName" />
    </a-form-item>
    <a-form-item field="valueFieldName" label="值字段">
      <a-input v-model="mv.valueFieldName" />
    </a-form-item>
    <a-form-item field="allowClear" label="可清除">
      <a-switch v-model="mv.allowClear" />
    </a-form-item>
    <a-form-item field="allowClear" label="可搜索">
      <a-switch v-model="mv.allowSearch" />
    </a-form-item>
    <a-form-item field="orderFieldName" label="排序字段">
      <a-input v-model="mv.orderFieldName" />
    </a-form-item>
    <a-form-item field="ascOrDesc" label="升序降序">
      <a-switch v-model="mv.ascOrDesc" checked-value="+" unchecked-value="-">
        <template #checked> 升序 asc(+)</template>
        <template #unchecked> 降序 desc(-)</template>
      </a-switch>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
