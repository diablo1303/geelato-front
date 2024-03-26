<script lang="ts">
export default {
  name: "GlColor"
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return '#165DFF'
    }
  }
})

const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const history = ref(['#165DFF'])
const addHistory = (visible:boolean, color:string) => {
  if (!visible) {
    const index = history.value.indexOf(color);
    if (index !== -1) {
      history.value.splice(index, 1);
    }
    history.value.unshift(color);
  }
}

</script>

<template>
  <a-color-picker class="gl-color" v-model="mv" @popup-visible-change="addHistory"></a-color-picker>
</template>
