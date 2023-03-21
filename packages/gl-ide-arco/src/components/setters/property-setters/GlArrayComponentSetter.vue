<template>
  <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="getTemplateInst()" @addItem="update"
                     @removeItem="update">
    <GlComponentSelect v-model="items[slotProps.index]"></GlComponentSelect>
  </GlArrayBaseSetter>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlComponentSelect from "./GlComponentSelect.vue";
import {ComponentInstance} from "@geelato/gl-ui-schema";

export default defineComponent({
  name: "GlArrayComponentSetter",
  components: {GlComponentSelect},
  props: {
    modelValue: {
      type: Array as PropType<Array<ComponentInstance>>,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      items: this.modelValue,
    }
  },
  methods: {
    getTemplateInst() {
      return new ComponentInstance();
    },
    update() {
      this.$emit('update:modelValue', this.items)
    }
  }
})
</script>

<style scoped>

</style>
