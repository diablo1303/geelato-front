<template>
  <table>
    <tr v-if="mv&&mv.length>0">
      <td></td>
      <td>数据字段/标题/字段重命名</td>
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
          <td style="width: 100%">
            <a-select size="small" v-model="mv[index].name" style="width: 100%"
                      allow-clear
                      placeholder="数据字段"
                      @change="onFieldChange($event,element,index)">
              <a-option v-for="item in entityFieldMetas" :value="item.name" :title="item.name+' '+item.title">
                {{ item.name }}
              </a-option>
            </a-select>
            <a-space :size="1" style="width: 100%;">
              <a-input size="small" v-model="element.title" allow-clear
                       @change="onChangeElement($event,element,index)"
                       @click="onSelectElement($event,element,index)"
                       style="width: 100%;"
                       placeholder="字段标题"
                       title="字段标题"
              />
              <a-input size="small" v-model="element.alias" allow-clear
                       @change="onChangeElement($event,element,index)"
                       @click="onSelectElement($event,element,index)" style="width: 100%"
                       placeholder="字段重命名"
                       title="字段重命名"
              />
            </a-space>

          </td>
          <td class="gl-extra">
            <GlIconfont type="gl-delete" @click="removeElement(index)"/>
          </td>
        </tr>
      </template>
    </gl-draggable>
    <tr>
      <td colspan="4" style="padding-left: 4px;width: 100%">
        <a @click="addElement" style="line-height: 2em;cursor: pointer">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
        <!--              <a-button @click="addElement" size="mini" type="primary" long>添加</a-button>-->
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlOptions from "../../GlOptions.vue";
import {useEntityStore} from "@geelato/gl-ide";
import {FieldMeta} from "@geelato/gl-ui";
import {compareMeta} from "@geelato/gl-ui";

export default defineComponent({
  name: "FieldsSetter",
  components: {GlOptions},
  props: {
    modelValue: {
      type: Array as PropType<Array<FieldMeta>>,
      default() {
        return new Array<FieldMeta>()
      }
    },
    /**
     *  供选择的实体字段集合
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
      entityStore: useEntityStore(),
      mv: this.modelValue as Array<FieldMeta>,
      selectedElement: {},
      selectedIndex: -1,
      visible: false
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
      const item = new FieldMeta()
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

    onFieldChange(fieldName: string, element: any, index: number) {
      console.log('onFieldChange', fieldName, element, index)
      const fieldMeta = this.entityFieldMetas.find((fieldMeta) => {
        return fieldMeta.name === fieldName
      })
      this.mv[index].title = fieldMeta?.title || ''
      this.onChangeElement(fieldName, element, index)
    }
  }
})
</script>

<style scoped>

</style>
