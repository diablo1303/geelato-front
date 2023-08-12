<template>
  <div>
    <gl-draggable
        :list="items"
        animation="700"
        handle=".gl-dnd-item"
        :group="{ name: 'options',  put: false }"
        :sort="true"
        tag="div"
        itemKey="value"
    >
      <template #item="{element, index}">
        <div v-if="filter(element)" style="width:100%;display: flex;margin-bottom: 1px" :style="wrapperStyle">
          <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
            <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
          </div>
          <div :key="index" style="flex:auto" @click="onSelectItem(element,index)">
            <slot key="index" :item="element" :index="index"></slot>
          </div>
          <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
            <a-button type="text" style="padding:0 5px 4px">
              <GlIconfont type="gl-delete" @click="removeItem(index)"
                          style="cursor: pointer;color: red"></GlIconfont>
            </a-button>
            <!--            <GlIconfont type="gl-delete" @click="removeItem(index)"-->
            <!--                        style="cursor: pointer;color: red"></GlIconfont>-->
          </div>
        </div>
      </template>
    </gl-draggable>
    <a v-if="addAble" @click="addItem" style="line-height: 2em;cursor: pointer;margin-left: 1.5em">
      <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加
    </a>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

const defaultItemType: any = ''
export default defineComponent({
  name: "GlArrayBaseSetter",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    defaultItemForAdd: {
      type: [Object, Number, String, Array, Boolean, Function],
      default() {
        return {}
      }
    },
    addAble: {
      type: Boolean,
      default() {
        return true
      }
    },
    wrapperStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    filter: {
      type: Function,
      default() {
        return (item: any) => {
          return true
        }
      }
    }
  },
  data() {
    return {
      items: new Array<any>(),
      selectedItem: defaultItemType,
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
    getDefaultItem() {
      // console.log('........', typeof this.defaultItemForAdd, this.defaultItemForAdd)
      let template = typeof this.defaultItemForAdd === 'function' ? this.defaultItemForAdd() : this.defaultItemForAdd
      try {
        return JSON.parse(JSON.stringify(template))
      } catch (e) {
        console.error('getDefaultItem', e)
      }
      return this.defaultItemForAdd
    },
    addItem() {
      let element = this.getDefaultItem()
      this.items.push(element)
      this.$emit('update:modelValue', this.items)
      this.$emit('add', element)
      // @ts-ignore
      this.selectedItem = element
      this.selectedIndex = this.items.length - 1
      this.emitSelectedItem()
    },

    removeItem(index: number) {
      // let element = this.items[index]
      // console.log('removeItem', this.items, index, element)
      if (this.selectedIndex === index) {
        // @ts-ignore
        this.selectedItem = this.getDefaultItem()
      }
      if (this.selectedIndex >= index) {
        this.selectedIndex -= 1
      }
      this.items.splice(index, 1)
      this.$emit('update:modelValue', this.items)
      this.$emit('removeItem', {index: index})
      this.emitSelectedItem()
    },
    onSelectItem(element: any, index: number) {
      // @ts-ignore
      this.selectedItem = element
      this.selectedIndex = index
      this.emitSelectedItem()
    },
    onChangeItem(element: any, index: number, $event: any) {
      // @ts-ignore
      this.selectedItem = element
      // this.selectedIndex = index
      // this.items[index] = this.selectedItem
      // console.log('element>', element, $event)
    },
    emitSelectedItem() {
      // console.log('selectedItem:', {element: this.selectedItem, index: this.selectedIndex})
      this.$emit('selectedItem', {element: this.selectedItem, index: this.selectedIndex})
    }
  }
})
</script>

<style scoped>

</style>
