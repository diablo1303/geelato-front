<template>
  <span class="gl-text">
    {{modelValue}}
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlText",
  props: {
    modelValue: [String,Number,Boolean]
  }
})
</script>

<style>
.gl-text {
}
</style>
