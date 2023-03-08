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
          <td style="width: 2em;text-align: center">
              <span>
                <GlIconfont title="拖动" type="gl-drag" class="gl-dnd-item" style="cursor: move"></GlIconfont>
              </span>
          </td>
          <td>
            <a-select  size="small" v-model="mv[index].name" style="width: 8em"  @change="onChangeElement($event,element,index)">
              <a-option v-for="item in entityFieldMetas" :value="item.name" :title="item.name">{{item.title}}</a-option>
            </a-select>
          </td>
          <td>
            <a-select  size="small" v-model="mv[index].cop" style="width: 8em"  @change="onChangeElement($event,element,index)">
              <a-option v-for="item in compareMeta.cops" :value="item.value" :title="item.text">{{item.text}}</a-option>
            </a-select>
          </td>
          <!--                <td>-->
          <!--                  <a-input size="small" v-model="mv[index].value" allowClear="true"-->
          <!--                           @change="onChangeElement(element,index,$event)"-->
          <!--                           @click="onSelectElement(element,index)" style="width: 99%">-->
          <!--                  </a-input>-->
          <!--                </td>-->
          <td style="width: 2em;text-align: center">
                  <span>
                    <GlIconfont type="gl-delete" @click="removeElement(index)"
                                style="cursor: pointer;color: red"></GlIconfont>
                  </span>
          </td>
        </tr>
      </template>
    </gl-draggable>
    <tr>
      <td colspan="4"  style="padding-left: 4px">
        <a @click="addElement" style="line-height: 2em;cursor: pointer">
          <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加</a>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlOptions from "../../GlOptions.vue";
import {FieldMeta, compareMeta, EntityReaderParam} from "@geelato/gl-ui";
export default defineComponent({
  name: "FieldsSetter",
  components: {GlOptions},
  props: {
    modelValue: {
      type: Array as PropType<Array<EntityReaderParam>>,
      default() {
        return new Array<EntityReaderParam>()
      }
    },
    /**
     *  供选择的实体字段集合
     */
    entityFieldMetas:{
      type:Array as PropType<Array<FieldMeta>>,
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
      compareMeta:compareMeta,
      mv: this.modelValue as Array<EntityReaderParam>,
      selectedElement:{},
      selectedIndex:-1,
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
  methods:{
    addElement() {
      const item = new EntityReaderParam()
      this.mv.push(item)
      this.$emit('update:modelValue', this.mv)
      this.$emit('addElement', item)
      this.selectedElement = item
      this.selectedIndex = this.mv.length - 1
      this.emitSelectedElement()
    },
    removeElement(index:number) {
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
    onSelectElement($event:any,element:any, index:number) {
      this.selectedElement = element
      this.selectedIndex = index
      this.emitSelectedElement()
    },
    onChangeElement($event:any,element:any, index:number) {
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
      console.log('selectedElement:', {element: this.selectedElement, index: this.selectedIndex})
      this.$emit('selectedElement', {element: this.selectedElement, index: this.selectedIndex})
    },
  }
})
</script>

<style scoped>

</style>
