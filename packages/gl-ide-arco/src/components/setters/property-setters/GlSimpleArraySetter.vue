<template>
  <GlArrayBaseSetter>

  </GlArrayBaseSetter>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlArrayBaseSetter from "./GlArrayBaseSetter.vue";
const defaultElementType: any = ''
export default defineComponent({
  name: "GlSimpleArraySetter",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    defaultElement: {
      type: Object
    }
  },
  data() {
    return {
      items: new Array<any>(),
      selectedElement: defaultElementType,
      selectedIndex: -1
    }
  },
  beforeMount() {
    this.items = this.modelValue
  },
  beforeUpdate() {
    this.items = this.modelValue
  },
  methods: {
    addElement() {
      let element = this.defaultElement
      this.items.push(element)
      this.$emit('update:modelValue', this.items)
      this.$emit('addElement', element)
      // @ts-ignore
      this.selectedElement = element
      this.selectedIndex = this.items.length - 1
      this.emitSelectedElement()
    },

    removeElement(index: number) {
      let element = this.items[index]
      // console.log('removeElement', this.selectedIndex, index, this.selectedElement)
      if (this.selectedIndex === index) {
        // @ts-ignore
        this.selectedElement = this.getDefaultElement()
      }
      if (this.selectedIndex >= index) {
        this.selectedIndex -= 1
      }
      this.items.splice(index, 1)
      this.$emit('update:modelValue', this.items)
      this.$emit('removeElement', {index: index})
      this.emitSelectedElement()
    },
    onSelectElement(element: any, index: number) {
      // @ts-ignore
      this.selectedElement = element
      this.selectedIndex = index
      this.emitSelectedElement()
    },
    onChangeElement(element: any, index: number, $event: any) {
      // @ts-ignore
      this.selectedElement = element
      // this.selectedIndex = index
      // this.items[index] = this.selectedElement
      console.log('element>', element, $event)
    },
    emitSelectedElement() {
      console.log('selectedElement:', {element: this.selectedElement, index: this.selectedIndex})
      this.$emit('selectedElement', {element: this.selectedElement, index: this.selectedIndex})
    }
  }
})
</script>

<style scoped>

</style>
