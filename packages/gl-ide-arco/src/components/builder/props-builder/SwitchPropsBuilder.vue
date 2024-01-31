<template>
  <a-form :model="mv">
    <a-form-item field="entityName" label="选中时文案">
      <a-input v-model="mv.checkedText"/>
    </a-form-item>
    <a-form-item field="labelFieldName" label="关闭时文案">
      <a-input v-model="mv.uncheckedText"/>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
export default {name: "SwitchPropsBuilder"}
</script>
<script setup lang="ts">
import {ref} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        checkedText: '',
        uncheckedText: ''
      }
    }
  }
})
const mv = ref(props.modelValue)
const update = () =>{
  emits('update:modelValue', mv.value)
}

</script>