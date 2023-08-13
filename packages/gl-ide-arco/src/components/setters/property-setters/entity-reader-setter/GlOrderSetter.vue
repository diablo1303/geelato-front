<template>
  <table>
    <tr v-if="mv&&mv.length>0">
      <td></td>
      <td>数据字段</td>
      <td>比较操作</td>
      <td></td>
    </tr>
    <gl-draggable
        :list="mv"
        animation="700"
        handle=".gl-dnd-item"
        :group="{ name: 'options',  put: false }"
        :sort="true"
        tag="tbody"
        itemKey="value"
    >
      <template #item="{element, index}">
        <tr>
          <td class="gl-drag">
            <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
          </td>
          <td style="width: 50%">
            <a-select size="small" v-model="mv[index].field"
                      @change="onChangeElement($event,element,index)">
              <a-option v-for="item in entityFieldMetas" :value="item.name" :title="item.name">{{ item.title }}
              </a-option>
            </a-select>
          </td>
          <td style="width: 50%">
            <a-select size="small" v-model="mv[index].order"
                      @change="onChangeElement($event,element,index)">
              <a-option value="+">升序</a-option>
              <a-option value="-">降序</a-option>
            </a-select>
          </td>
          <td class="gl-delete">
            <GlIconfont type="gl-delete" @click="removeElement(index)"
                        style="cursor: pointer;color: red"></GlIconfont>
          </td>
        </tr>
      </template>
    </gl-draggable>
    <tr>
      <td colspan="4" style="padding-left: 4px">
        <a @click="addElement" style="line-height: 2em;cursor: pointer">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlOptions from "../../GlOptions.vue";
import {FieldMeta, compareMeta, EntityReaderOrder} from "@geelato/gl-ui";

export default defineComponent({
  name: "FieldsSetter",
  components: {GlOptions},
  props: {
    modelValue: {
      type: Array as PropType<Array<EntityReaderOrder>>,
      default() {
        return new Array<EntityReaderOrder>()
      }
    },
    /**
     *  共选择的实体字段集合
     */
    entityFieldMetas: {
      type: Array as PropType<Array<FieldMeta>>,
      default() {
        return new Array<FieldMeta>()
      }
    }
  },
  created() {

  },
  beforeUpdate() {
    this.mv = this.modelValue
  },
  data() {
    return {
      compareMeta: compareMeta,
      mv: this.modelValue as Array<EntityReaderOrder>,
      selectedElement: {},
      selectedIndex: -1,
    }
  },
  watch: {
    'mv': {
      handler: function (val) {
        this.$emit('update', val)
      },
      deep: true
    }
  },
  methods: {
    addElement() {
      const item = new EntityReaderOrder()
      this.mv.push(item)
      this.$emit('update:modelValue', this.mv)
      this.$emit('addElement', item)
      this.selectedElement = item
      this.selectedIndex = this.mv.length - 1
      this.emitSelectedElement()
    },
    removeElement(index: number) {
      // let item = this.mv[index]
      if (this.selectedIndex === index) {
        this.selectedElement = {}
      }
      if (this.selectedIndex >= index) {
        this.selectedIndex -= 1
      }
      this.mv.splice(index, 1)
      this.$emit('update:modelValue', this.mv)
      this.$emit('removeElement', {index: index})
      this.emitSelectedElement()
    },
    onSelectElement($event: any, element: any, index: number) {
      this.selectedElement = element
      this.selectedIndex = index
      this.emitSelectedElement()
    },
    onChangeElement($event: any, element: any, index: number) {
      this.selectedElement = element
      this.selectedIndex = index
      console.log('onChangeElement>', element, $event.target)
      this.$emit('update:modelValue', this.mv)
      this.$emit('changeElement', element)
      // $event.target.focus()
      // this.$emit('update:modelValue', this.items)
      // this.emitSelectedElement()
    },
    emitSelectedElement() {
      // console.log('selectedElement:', {element: this.selectedElement, index: this.selectedIndex})
      this.$emit('selectedElement', {element: this.selectedElement, index: this.selectedIndex})
    },
  }
})
</script>

<style scoped>

</style>
