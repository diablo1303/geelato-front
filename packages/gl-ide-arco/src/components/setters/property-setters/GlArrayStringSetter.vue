<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="''" @addItem="update"
                     @removeItem="update">
    <a-input v-model="items[slotProps.index]" @change="update"></a-input>
  </GlArrayBaseSetter>
</template>

<script lang="ts">
// @ts-nocheck
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlArrayStringSetter",
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
