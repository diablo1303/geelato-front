<script lang="ts">
export default {
  name: 'GlOptionsDynamicBuilder'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        entityName: '',
        labelFieldName: '',
        valueFieldName: '',
        orderFieldName: '',
        ascOrDesc: '+'
      }
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const handleSubmit = (data: any) => {
  console.log(data);
};
</script>

<template>
  <a-form :model="mv" @submit="handleSubmit">
    <a-form-item field="entityName" label="实体名称">
      <a-input v-model="mv.entityName"/>
    </a-form-item>
    <a-form-item field="labelFieldName" label="标题字段">
      <a-input v-model="mv.labelFieldName"/>
    </a-form-item>
    <a-form-item field="valueFieldName" label="值字段">
      <a-input v-model="mv.valueFieldName"/>
    </a-form-item>
    <a-form-item field="valueFieldName" label="排序字段">
      <a-input v-model="mv.orderFieldName"/>
    </a-form-item>
    <a-form-item field="valueFieldName" label="升序降序">
      <a-switch v-model="mv.ascOrDesc" checked-value="+" unchecked-value="-">
        <template #checked>
          升序 asc(+)
        </template>
        <template #unchecked>
          降序 desc(-)
        </template>
      </a-switch>
    </a-form-item>
  </a-form>
</template>

<style scoped>

</style>
