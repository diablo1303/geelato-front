<template>
  <div>xx
    <div v-for="key in modelValue">
      {{key}}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlSimpleObjectSetter",
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
