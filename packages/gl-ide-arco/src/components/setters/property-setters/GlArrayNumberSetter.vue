<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="0" @addItem="update"
                     @removeItem="update">
    <a-input-number v-model="items![slotProps.index]"></a-input-number>
  </GlArrayBaseSetter>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlArrayNumberSetter",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      items: this.modelValue,
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
