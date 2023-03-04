<template>
  <div class="gl-table">
    <div class="gl-table-row">
      <div class="gl-table-cell gl-label" style="position: relative;width: 7em">xx</div>
      <div class="gl-table-cell">xxx</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlComponentActionsSetter",
  props: {
    modelValue: {
      type: Object,
      default(){
        return {}
      }
    }
  }
})
</script>

<style scoped>

</style>
