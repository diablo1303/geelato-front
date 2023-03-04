<template>
  <gl-draggable
      :list="items"
      animation="700"
      handle=".gl-dnd-item"
      :group="{ name: 'options',  put: false }"
      :sort="true"
      tag="tbody"
      itemKey="value"
  >
    <template #item="{element, index}">
      <tr>
        <td style="width: 100%">
          <template v-if="mode==='String'||!mode">
            <a-input size="small" v-model:value="items[index]"
                     @click="onSelectElement(element,index)" style="width: 99%">
              <template #addonBefore>
                <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
              </template>
              <template #addonAfter>
                <GlIconfont type="gl-delete" @click="removeElement(index)"
                            style="cursor: pointer;color: red"></GlIconfont>
              </template>
            </a-input>
          </template>
          <template v-else-if="mode==='Number'">
            <a-input-number size="small" v-model:value="items[index]"
                            @click="onSelectElement(element,index)" style="width: 99%">
              <template #addonBefore>
                <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
              </template>
              <template #addonAfter>
                <GlIconfont type="gl-delete" @click="removeElement(index)"
                            style="cursor: pointer;color: red"></GlIconfont>
              </template>
            </a-input-number>
          </template>
          <template v-else-if="mode==='Boolean'">
            <span class="ant-input-group-wrapper ant-input-group-wrapper-sm" style="width: 99%;">
              <span class="ant-input-wrapper ant-input-group">
                <span class="ant-input-group-addon">
                   <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
                </span>
                <span>
                  <a-switch v-model:checked="items[index]" size="small"/>
                </span>
                <span class="ant-input-group-addon">
                  <GlIconfont type="gl-delete" @click="removeElement(index)"
                              style="cursor: pointer;color: red"></GlIconfont>
                </span>
              </span>
            </span>
          </template>
          <template v-else>
            不支持的mode:{{ mode }}
          </template>
        </td>
      </tr>
    </template>
  </gl-draggable>
  <tr>
    <td colspan="3" style="padding-left: 4px">
      <a @click="addElement" style="line-height: 2em">
        <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlSimpleArrayr",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    mode: {
      type: String,
      default() {
        return 'String'
      }
    }
  },
  data() {
    return {
      items: [],
      selectedElement: undefined,
      selectedIndex: -1
    }
  },
  watch: {
    mode: function (val) {
      if (val === 'String') {
        return
      }
      if (this.items) {
        for (let index in this.items) {
          this.items[index] = this.getDefaultElement()
        }
      }
    }
  },
  beforeMount() {
    this.items = this.modelValue
  },
  beforeUpdate() {
    this.items = this.modelValue
  },
  methods: {
    getDefaultElement() {
      let element: String | Boolean | Number | undefined
      if (this.mode === 'Boolean') {
        element = true
      } else if (this.mode === 'Number') {
        element = 0
      } else if (this.mode === 'String' || !this.mode) {
        element = ''
      } else {
        element = undefined
      }
      return element
    },
    addElement() {
      let element: String | Boolean | Number | undefined = this.getDefaultElement()
      this.items.push(element)
      this.$emit('update:modelValue', this.items)
      this.$emit('addElement', element)
      this.selectedElement = element
      this.selectedIndex = this.items.length - 1
      this.emitSelectedElement()
    },

    removeElement(index: number) {
      let element = this.items[index]
      // console.log('removeElement', this.selectedIndex, index, this.selectedElement)
      if (this.selectedIndex === index) {
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
    onSelectElement(element: String | Boolean | Number, index: number) {
      this.selectedElement = element
      this.selectedIndex = index
      this.emitSelectedElement()
    },
    onChangeElement(element: String | Boolean | Number, index: number, $event) {
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
