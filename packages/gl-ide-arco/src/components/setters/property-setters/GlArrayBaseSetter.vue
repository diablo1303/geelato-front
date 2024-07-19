<template>
  <div class="gl-array-base-setter">
    <gl-draggable
      :list="items"
      animation="700"
      handle=".gl-dnd-item"
      :group="{ name: 'options', put: false }"
      :sort="true"
      tag="div"
      itemKey="value"
    >
      <template #item="{ element, index }">
        <div v-if="cardMode">
          <div
            class="gl-m-header"
            v-if="maxCount !== 1"
            @click="onSelectItem(element, index)"
            style="cursor: pointer"
          >
            <span v-if="enableSort">
              <GlIconfont type="gl-drag" class="gl-dnd-item" style="cursor: move"
            /></span>
            <span class="gl-m-title" v-html="getElementTitle(element, titleField)"></span>
            <span
              class="gl-m-sub-title"
              v-html="getElementTitle(element, subTitleField, alarmIfNoSubTitle)"
            ></span>
            <span class="gl-m-action" v-if="enableDelete">
              <a-popconfirm type="warning" content="是否删除?" @ok="removeItem(index)">
                <GlIconfont
                  type="gl-delete"
                  style="color: red; cursor: pointer"
                ></GlIconfont>
              </a-popconfirm>
            </span>
            <!--            <span class="gl-m-action" v-if="enableEdit"><FormOutlined /></span>-->
          </div>
          <div class="gl-m-body" v-if="selectedIndex === index" style="border: 1px solid #ccc">
            <slot :item="element" :index="index"></slot>
          </div>
        </div>
        <template v-else>
          <div style="width: 100%; display: flex; margin-bottom: 1px" :style="wrapperStyle">
            <div v-if="enableSort" style="flex: 0 0 2em; text-align: center; line-height: 2em">
              <GlIconfont
                title="拖动"
                type="gl-drag"
                class="gl-dnd-item"
                style="cursor: move"
              ></GlIconfont>
            </div>
            <div :key="index" style="flex: auto" @click="onSelectItem(element, index)">
              <slot key="index" :item="element" :index="index"></slot>
            </div>
            <div style="flex: 0 0 2em; text-align: center; line-height: 2em">
              <a-button type="text" style="padding: 0 5px 4px">
                <a-popconfirm type="warning" content="是否删除?" @ok="removeItem(index)">
                <GlIconfont
                  type="gl-delete"
                  style="cursor: pointer; color: red"
                ></GlIconfont>
                </a-popconfirm>
              </a-button>
              <!--            <GlIconfont type="gl-delete" @click="removeItem(index)"-->
              <!--                        style="cursor: pointer;color: red"></GlIconfont>-->
            </div>
          </div>
        </template>
      </template>
    </gl-draggable>
    <a v-if="addAble" @click="addItem" style="line-height: 2em; cursor: pointer; margin-left: 1em">
      <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { utils } from '@geelato/gl-ui'

const defaultItemType: any = ''
export default defineComponent({
  name: 'GlArrayBaseSetter',
  props: {
    modelValue: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     *  是否采用卡片模式
     *  适合加入的内容较多（多行，用卡片的模式更合适），需要有独立标题的场景
     */
    cardMode: Boolean,
    /**
     *  cardMode为ture时有效，设置卡片的标题字段，默认为title
     */
    titleField: {
      type: String,
      default() {
        return 'title'
      }
    },
    /**
     *  cardMode为ture时有效，设置卡片的子标题字段
     */
    subTitleField: {
      type: String,
      default() {
        return ''
      }
    },
    /**
     *  如果未设置子标题时，在标题位置展示的告警信息
     */
    alarmIfNoSubTitle: String,
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
    /**
     *  0 表示不限制，无限大
     */
    maxCount: {
      type: Number,
      default() {
        return 0
      }
    },
    /**
     * 是否可以上下拖动排序
     */
    enableSort: {
      type: Boolean,
      default() {
        return true
      }
    },
    /**
     *  是否启用删除功能
     */
    enableDelete: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal, oldVal) {
        this.items = this.modelValue
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      items: this.modelValue,
      selectedItem: defaultItemType,
      selectedIndex: -1
    }
  },
  methods: {
    utils() {
      return utils
    },
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
          return keys.length > 0
            ? getValue(obj[key], keys)
            : obj[key]
            ? obj[key]
            : `<span style="color: red">${alarmIfNoTitle}</span>`
        }
        return getValue(element, keys)
      } catch (e) {
        console.error(e)
      }
      return ''
    },
    getDefaultItem() {
      // console.log('........', typeof this.defaultItemForAdd, this.defaultItemForAdd)
      let template =
        typeof this.defaultItemForAdd === 'function'
          ? this.defaultItemForAdd()
          : this.defaultItemForAdd
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
      this.$emit('addItem', element)
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
      const removeItems = this.items.splice(index, 1)
      this.$emit('update:modelValue', this.items)
      this.$emit('removeItem', { index: index, item: removeItems[0] })
      this.emitSelectedItem()
    },
    onSelectItem(element: any, index: number) {
      if (this.selectedIndex === index) {
        this.selectedIndex = -1
        this.selectedItem = {}
      } else {
        this.selectedIndex = index
        this.selectedItem = element
      }
      this.emitSelectedItem()
    },
    emitSelectedItem() {
      // console.log('selectedItem:', {element: this.selectedItem, index: this.selectedIndex})
      this.$emit('selectedItem', { element: this.selectedItem, index: this.selectedIndex })
    }
    // onEnd(evt: { newIndex: number }) {
    //   if (this.selectedIndex === -1) {
    //     return
    //   }
    //   this.onSelectItem(this.items[evt.newIndex], evt.newIndex)
    // }
  }
})
</script>

<style>
.gl-array-base-setter {
  margin: 2px;
}

/* gl-m 即为 gl-modifier*/
.gl-array-base-setter .gl-m-title {
  padding-left: 0.5em;
}

.gl-array-base-setter .gl-m-sub-title {
  padding-left: 0.5em;
  color: #8f8f8f;
}

.gl-array-base-setter .gl-m-header {
  padding: 0 0.68em;
  line-height: 2em;
  border: 1px solid rgba(31, 56, 88, 0.2);
  border-left: 3px solid #c8cdd4;
  border-radius: 2px;
  margin: 2px 0px;
}

.gl-array-base-setter .gl-m-header .gl-m-action {
  float: right;
  margin-left: 1em;
}
</style>
