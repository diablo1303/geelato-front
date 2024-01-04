<template>
  <div class="gl-property-setter-card">
    <gl-draggable
        :list="items"
        animation="700"
        handle=".gl-dnd-item"
        :group="{ name: 'options',  put: false }"
        :sort="true"
        tag="div"
        itemKey="value"
        @end="onEnd"
    >
      <template #item="{element, index}">
        <div>
          <div class="gl-m-header" v-if="maxCount!==1" @click="editElement(index)" style="cursor: pointer">
            <span v-if="enableSort">
              <GlIconfont type="gl-drag" class="gl-dnd-item" style="cursor: move" /></span>
            <span class="gl-m-title" v-html="getElementTitle(element, titleField)"></span>
            <span class="gl-m-sub-title" v-html="getElementTitle(element, subTitleField,alarmIfNoSubTitle)"></span>
            <span class="gl-m-action" v-if="enableDelete"><GlIconfont type="gl-delete" @click="removeElement(index)"
                                                                      style="color: red;cursor: pointer"></GlIconfont></span>
            <!--            <span class="gl-m-action" v-if="enableEdit"><FormOutlined /></span>-->
          </div>
          <div class="gl-m-body" v-if="selectedIndex===index" style="border: 1px solid #ccc">
            <slot :item="element" :index="index"></slot>
          </div>
        </div>
      </template>
    </gl-draggable>
    <div v-if="!(maxCount>0&&items?.length === maxCount)&&maxCount!==1">
      <a @click="addElement" style="line-height: 2em;cursor: pointer;padding-left: 1em">
        <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {utils} from "@geelato/gl-ui";

export default defineComponent({
  name: "GlPropertySetterCard",
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    titleField: {
      type: String,
      default() {
        return 'title'
      }
    },
    subTitleField: {
      type: String,
      default() {
        return ''
      }
    },
    alarmIfNoSubTitle: String,
    /**
     *  添加时，创建的元素，支持外部传入，以配置一些扩展字段信息
     */
    elementTemplate: {
      type: Object
    },
    /**
     *  0 表示不限制，无限大
     */
    maxCount: {
      type: Number,
      default() {
        return 0
      }
    },
    enableEdit: {
      type: Boolean,
      default() {
        return true
      }
    },
    enableDelete: {
      type: Boolean,
      default() {
        return true
      }
    }
    ,
    enableSort: {
      type: Boolean,
      default() {
        return true
      }
    },
    /**
     * 如果列表为空时，在初始时默认创建一项
     */
    autoAddWhenEmpty: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      cardTitleField: '',
      items: this.modelValue,
      selectedElement: {},
      selectedIndex: -1
    }
  },
  created() {
    // console.log('GlPropertySetterCard modelValue', this.modelValue)
    // 对于空的默认创建一个
    if (this.items.length === 0 && this.maxCount >= 0 && this.autoAddWhenEmpty) {
      this.addElement()
    }
    // 找出对象的第一个字段，作为卡片的标题字段
    let element = this.elementTemplate ? JSON.parse(JSON.stringify(this.elementTemplate)) : undefined
    if (element) {
      const keys = Object.keys(element)
      keys.length > 0 ? this.cardTitleField = keys[0] : ''
      // console.log('this.cardTitleField:', this.cardTitleField, keys, element)
    }
  },
  methods: {
    // alarmIfNoSubTitle
    getElementTitle(element: any, titleField?: string, alarmIfNoTitle?: string) {
      // console.log('getElementTitle() > label:', element._component.props.label, element._component.props.bindField.fieldName,'titleField:', titleField, 'alarmIfNoTitle:', alarmIfNoTitle)
      if (!titleField) return ''
      try {
        const keys = titleField.split('.')
        const getValue: any = (obj: any, keys: string[]) => {
          if (!obj || !keys || keys.length === 0) {
            if (alarmIfNoTitle) {
              return `<span style="color: red">${alarmIfNoTitle}</span>`
            } else {
              return ''
            }
          }
          const key: string = keys.shift()!
          return keys.length > 0 ? getValue(obj[key], keys) : (obj[key]?obj[key]:`<span style="color: red">${alarmIfNoTitle}</span>`)
        }
        return getValue(element, keys)
      } catch (e) {
        console.error(e)
      }
      return ''
    },
    addElement() {
      let element = this.elementTemplate ? JSON.parse(JSON.stringify(this.elementTemplate)) : {}
      if (this.items.length === this.maxCount && this.maxCount > 0) {
        return
      }
      // 为新增的子元素设置id
      if (!element.id) {
        element.id = utils.gid()
      }
      this.items.push(element)
      this.selectedIndex = this.items.length - 1
      this.selectedElement = element
      this.$emit('update:modelValue', this.items)
      this.$emit('addElement', element)

      this.emitSelectedElement()
    },
    editElement(index: number) {
      if (this.selectedIndex === index) {
        this.selectedIndex = -1
        this.selectedElement = {}
      } else {
        this.selectedIndex = index
        // @ts-ignore
        this.selectedElement = this.items[index]
      }
      this.emitSelectedElement()
    },
    removeElement(index: number) {
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
    emitSelectedElement() {
      // console.log('selectedElement:', {element: this.selectedElement, index: this.selectedIndex})
      this.$emit('selectedElement', {element: this.selectedElement, index: this.selectedIndex})
    },
    onEnd(evt: { newIndex: number }) {
      if (this.selectedIndex === -1) {
        return
      }
      this.editElement(evt.newIndex)
      // console.log('onEnd', evt)
    }
  }
})
</script>

<style>
.gl-property-setter-card {
  margin: 2px;
}

/* gl-m 即为 gl-modifier*/
.gl-property-setter-card .gl-m-title {
  padding-left: 0.5em;
}

.gl-property-setter-card .gl-m-sub-title {
  padding-left: 0.5em;
  color: #8f8f8f;
}

.gl-property-setter-card .gl-m-header {
  padding: 0 0.68em;
  line-height: 2em;
  border: 1px solid rgba(31, 56, 88, .2);
  border-left: 3px solid #c8cdd4;
  border-radius: 2px;
  margin: 2px 0px;
}

.gl-property-setter-card .gl-m-header .gl-m-action {
  float: right;
  margin-left: 1em;
}
</style>
