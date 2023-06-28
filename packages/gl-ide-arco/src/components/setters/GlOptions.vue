<!--
 注意：dataIndex值为value时，在修改value所在input值时，页面会卡，比较慢，如：[{dataIndex: 'text', title: '显示名'}, {dataIndex: 'value', title: '值'}]
-->
<template>
  <table>
    <!--    <tr v-if="items&&items.length>0">-->
    <!--      <th v-for="(column,index) in convertedColumns" style="font-weight: normal;text-align: center"-->
    <!--          :style="{width: (100/convertedColumns.length+'%')}">{{ column.title }}-->
    <!--      </th>-->
    <!--    </tr>-->
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
            <table>
              <tr>
                <td v-for="(column,columnIndex) in convertedColumns" :key="index+'_'+columnIndex">
                  <a-input size="small" v-model="element[column.dataIndex]"
                           :placeholder="column.title"
                           @change="onChangeElement(element,index,$event)"
                           @click="onSelectElement(element,index)" style="width: 99%"
                           :key="index+'_'+columnIndex+'_'+column.dataIndex"
                  >
                    <template v-if="columnIndex===0" #prepend>
                      <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
                      <GlIconfont v-if="allowAddSub" :type="element._showSub?'gl-minus-square':'gl-plus-square'"
                                  class="gl-dnd-item" style="margin-left: 4px;cursor: pointer"
                                  @click="element._showSub=!element._showSub" title="添加子项"></GlIconfont>
                    </template>
                    <template v-if="columnIndex===convertedColumns.length-1" #append>
                      <GlIconfont type="gl-delete" @click="removeElement(index)"
                                  style="cursor: pointer;color: red"></GlIconfont>
                    </template>
                  </a-input>
                </td>
              </tr>
              <!--子级-->
              <tr>
                <td :colspan="convertedColumns.length">
                  <div style="padding-left: 1em" v-if="allowAddSub&&element._showSub">
                    <GlOptions v-model="element.properties" :columns="convertedColumns" :allowAddSub="allowAddSub"
                               @selectedElement="popSelectedElement"></GlOptions>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </template>
    </gl-draggable>
    <tr>
      <td colspan="3" style="padding-left: 4px">
        <a @click="addElement" style="line-height: 2em;cursor: pointer">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
// @ts-nocheck
import {defineComponent, type PropType} from 'vue'
import {utils} from "@geelato/gl-ui";
import type {ColumnType} from "@/components/setters/Types";

export default defineComponent({
  name: "GlOptions",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array as PropType<Array<ColumnType>>,
      default() {
        return [{dataIndex: 'label', title: '名称'}, {dataIndex: 'key', title: '值'}]
      }
    },
    /**
     *  添加时，创建的元素，支持外部传入，以配置一些扩展字段信息
     */
    elementTemplate: {
      type: Object
    },
    /**
     *  是否启用创建子项
     */
    allowAddSub: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      // 数据项中，是否有value字段
      hasValueDataIndex: false,
      columnDataIndexMap: {},
      convertedColumns: [],
      items: this.modelValue,
      selectedElement: {},
      selectedIndex: -1
    }
  },
  created() {
    this.hasValueDataIndex = this.columns.findIndex((col) => {
      return col.dataIndex === 'value'
    }) != -1
    this.columnDataIndexMap = {}
    this.convertedColumns = this.convertColumns(this.columns)
    this.items = this.convertValues(this.modelValue)
  },
  beforeUpdate() {
  },
  watch: {},
  methods: {
    // 将dataIndex为value的转成其它，该字段会导致输入卡顿，每输一个字符会失去焦点
    convertColumns(columns: Array<any>) {
      let cols = JSON.parse(JSON.stringify(columns))
      console.log('cols:', cols)
      for (let index in cols) {
        const col = cols[index]
        if (col.dataIndex === 'value') {
          this.columnDataIndexMap.value = this.columnDataIndexMap.value || utils.gid('_')
          col.dataIndex = this.columnDataIndexMap.value
          return cols
        }
      }
      return cols
    },
    /**
     * 初始化转换值
     * @param items
     */
    convertValues(items: Array<any>) {
      let newItems = items
      if (this.hasValueDataIndex) {
        this.columnDataIndexMap.value = this.columnDataIndexMap.value || utils.gid('_')
        for (let index in newItems) {
          const item = newItems[index]
          // 删除为了转换value字段而创建的列（历史数据），该列以__开头
          Object.keys(item).forEach((key) => {
            if (key.startsWith("__")) {
              delete item[key]
            }
          })
          item[this.columnDataIndexMap.value] = item.value
        }
      }
      return newItems
    },
    convertDataIndex(items: Array<any>) {

    },
    addElement() {
      let element = this.elementTemplate ? JSON.parse(JSON.stringify(this.elementTemplate)) : undefined
      if (!element) {
        element = {}
        for (let index in this.convertedColumns) {
          // @ts-ignore
          element[this.convertedColumns[index].dataIndex] = ''
        }
      }
      if (this.hasValueDataIndex) {
        element[this.columnDataIndexMap.value] = element.value
      }
      this.items.push(element)
      this.$emit('update:modelValue', this.items)
      this.$emit('addElement', element)
      this.selectedElement = element
      this.selectedIndex = this.items.length - 1
      this.emitSelectedElement()
    },
    addSubElement() {

    },
    removeElement(index: number) {
      let element = this.items[index]
      // console.log('removeElement', this.selectedIndex, index, this.selectedElement)
      if (this.selectedIndex === index) {
        this.selectedElement = {}
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
      this.selectedElement = element
      this.selectedIndex = index
      this.emitSelectedElement()
    },
    onChangeElement(element: any, index: number, $event: any) {
      if (this.hasValueDataIndex) {
        element.value = element[this.columnDataIndexMap.value]
      }
      this.selectedElement = element
      this.selectedIndex = index
      console.log('element>', element, $event)
      // $event.target.focus()
      this.$emit('update:modelValue', this.items)
      // this.emitSelectedElement()
    },
    emitSelectedElement() {
      // console.log('selectedElement:', {element: this.selectedElement, index: this.selectedIndex})
      this.$emit('selectedElement', {element: this.selectedElement, index: this.selectedIndex})
    },
    popSelectedElement(fromSub: { element: any, index: number }) {
      this.$emit('selectedElement', fromSub)
    }
  }
})
</script>

<style scoped>

</style>
