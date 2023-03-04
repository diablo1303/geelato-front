<template>
  <input :value="html"/>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  name: "GlHtmlSetter",
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default() {
        return ''
      }
    }
  },
  setup(props, ctx) {
    let html = ref('')
    html.value = props.modelValue
    watch(html, () => {
      ctx.emit('update:modelValue', html)
    })
    return {
      html
    }
  }
})
</script>

<style scoped>

</style>
