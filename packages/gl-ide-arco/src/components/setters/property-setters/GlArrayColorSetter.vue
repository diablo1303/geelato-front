<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="'#165DFF'" @addItem="update"
                     @removeItem="update">
    <a-color-picker defaultValue="#165DFF" showText disabledAlpha/>
  </GlArrayBaseSetter>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlArrayColorSetter",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      items: this.modelValue!,
    }
  },
  methods: {
    update() {
      this.$emit('update:modelValue', this.items)
    }
  }
})
</script>

<style scoped>

</style>
