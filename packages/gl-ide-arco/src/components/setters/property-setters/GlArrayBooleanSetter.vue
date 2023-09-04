<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="true" @addItem="update"
                     @removeItem="update">
    <a-switch size="small" v-model="items[slotProps.index]"></a-switch>
  </GlArrayBaseSetter>
</template>

<script lang="ts">
// @ts-nocheck
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlArrayBooleanSetter",
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
