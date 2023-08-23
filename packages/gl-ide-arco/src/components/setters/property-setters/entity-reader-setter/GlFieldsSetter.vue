<template>
  <table>
    <!--    <tr v-if="mv&&mv.length>0">-->
    <!--      <td></td>-->
    <!--      <td>数据字段/字段重命名</td>-->
    <!--      <td></td>-->
    <!--    </tr>-->
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
            <div v-if="!mv[index].isLocalComputeFiled">
              <a-select size="small" v-model="element.name" style="width: 100%"
                        allow-search
                        allow-clear
                        placeholder="数据字段"
                        @change="onFieldChange($event,element,index)">
                <template #prefix>数据字段</template>
                <a-option v-for="item in entityFieldMetas" :value="item.name" :title="item.name+' '+item.title">
                  {{ item.name }}
                </a-option>
              </a-select>
              <a-select size="small" v-model="element.alias" style="width: 100%"
                        allow-clear
                        allow-search
                        placeholder="字段重命名"
                        @change="onAliasChange($event,element,index)"
                        title="选择重命名后的字段名"
              >
                <template #prefix>字段别名</template>
                <a-option v-for="item in aliasOptions" :value="item.value" :title="item.value+' '+item.label">
                  {{ item.label }}{{ item.value }}
                </a-option>
              </a-select>
            </div>
            <div v-else>
              <a-select size="small" v-model="element.name" style="width: 100%"
                        allow-clear
                        allow-search
                        placeholder="字段"
                        title="组件用到的字段"
              >
                <template #prefix>计算字段</template>
                <a-option v-for="item in aliasOptions" :value="item.value" :title="item.value+' '+item.label">
                  {{ item.label }}{{ item.value }}
                </a-option>
              </a-select>
              <GlExpressionSetter v-model="mv[index].valueExpression" :showInput="true">
                <template #prefix>计算公式</template>
              </GlExpressionSetter>
            </div>
          </td>
          <td class="gl-extra">
            <GlIconfont type="gl-delete" @click="removeElement(index)"/>
          </td>
        </tr>
      </template>
    </gl-draggable>
    <tr>
      <td colspan="4" style="padding-left: 4px;width: 100%">
        <a @click="addElement(false)" style="line-height: 2em;cursor: pointer"
           title="服务端的模型、服务存在的字段，直接查询获取">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;服务端字段</a>
        <a @click="addElement(true)" style="line-height: 2em;cursor: pointer"
           title="服务端没有该字段，本地的组件需要该字段时，可以通过加载后的数据记录在本地计算得到。">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;本地计算字段</a>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlOptions from "../../GlOptions.vue";
import {useEntityStore} from "@geelato/gl-ide";
import {FieldMeta} from "@geelato/gl-ui";
import GlExpressionSetter from "../../expression-setters/GlExpressionSetter.vue";

export default defineComponent({
  name: "FieldsSetter",
  components: {GlExpressionSetter, GlOptions},
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
    },
    /**
     *  重命名选项，指定实体需要重命名的字段，便于页面操作
     */
    aliasOptions: {
      type: Array as PropType<Array<Record<'label' | 'value', any>>>,
      default() {
        return []
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
    addElement(isLocal: boolean) {
      const item = new FieldMeta()
      item.isLocalComputeFiled = isLocal
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
      // console.log('onChangeElement>', element, $event.target)
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
      // console.log('onFieldChange', fieldName, element, index)
      const fieldMeta = this.entityFieldMetas.find((fieldMeta) => {
        return fieldMeta.name === fieldName
      })
      this.mv[index].title = fieldMeta?.title || ''
      this.onChangeElement(fieldName, element, index)
    },

    onAliasChange(fieldName: string, element: any, index: number) {

    }
  }
})
</script>

<style scoped>

</style>
