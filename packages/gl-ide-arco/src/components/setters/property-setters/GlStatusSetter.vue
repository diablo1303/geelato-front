<template>
  <a-radio-group v-model="statusValue" button-style="solid">
    <a-radio value="a">Hangzhou</a-radio>
    <a-radio value="b">Shanghai</a-radio>
    <a-radio value="c">Beijing</a-radio>
    <a-radio value="d">Chengdu</a-radio>
  </a-radio-group>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  name: "GlStatusSetter",
  props: {
    modelValue: {
      type: String,
      default() {
        return ''
      }
    },
    selectableItemNames: {
      type: Array,
      default() {
        return ['normal','disabled','readonly']
      }
    }
  },
  setup(props, ctx) {
    let statusValue = ref('')
    statusValue.value = props.modelValue
    watch(statusValue, () => {
      ctx.emit('update:modelValue', statusValue)
    })
    return {
      statusValue
    }
  }
})
</script>

<style scoped>

</style>
