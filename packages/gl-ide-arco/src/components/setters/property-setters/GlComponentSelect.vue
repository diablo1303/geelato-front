<template>
<!--  <div style="display: flex">-->
<!--    <div>-->
<!--      <a-select v-model="mv">-->
<!--        <a-option v-for="item in options" :value="item.componentName">{{ item.title }}</a-option>-->
<!--      </a-select>-->
<!--    </div>-->
<!--    <div>-->
<!--      <a-button type="text" title="设置组件信息">-->
<!--        <gl-iconfont type="gl-setting"></gl-iconfont>-->
<!--      </a-button>-->
<!--    </div>-->
<!--  </div>-->
  <div>
    <a-row>
      <a-col flex="auto">
        <a-select v-model="mv.componentName" @change="changeComponent">
          <a-option v-for="item in options" :value="item.componentName">{{ item.title }}</a-option>
        </a-select>
      </a-col>
      <a-col flex="2em">
        <a-button type="text" title="设置组件信息" @click="openComponentSetterModal">
          <gl-iconfont type="gl-setting"></gl-iconfont>
        </a-button>
      </a-col>
    </a-row>
    <a-modal :visible="visible" title="设置组件" @ok="()=>{visible=false}" :width="1024" style="top: 20px">
      <GlComponentSetter :componentMeta="componentMeta" :componentInstance="mv" @update="(val)=>{updateInstance(val)}"/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import GlComponentSetter from "../GlComponentSetter.vue";
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";

const emits = defineEmits(['update:modelValue'])
const props = defineProps(
    {
      modelValue: {
        type: Object,
        default() {
          return {
            componentName:'',
            props:{}
          }
        }
      },
      options: {
        type: Object,
        default() {
          return [
            {componentName: 'AInput', title: '单行文本'},
            {componentName: 'ASelect', title: '下拉选择'},
            {componentName: 'AButton', title: '按钮'}
          ]
        }
      }
    }
)
const mv = ref({
  componentName:'',
  props:{}
})
const visible = ref(false)
const componentMeta = ref({})
const componentInstance = ref({})
const ideStore = useIdeStore()

mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
},{deep:true})
const openComponentSetterModal = ()=>{
  visible.value = true
}
const findComponentMeta = (componentName:string) => {
  return useComponentMaterialStore().componentMetas.value.find((value)=>{
    return value.componentName === componentName
  })
}
const changeComponent = (componentName:string) => {
  componentMeta.value = findComponentMeta(componentName)
}
const updateInstance = (instance:object) => {
  mv.value = instance
  console.log(instance)
}

</script>

<style scoped>

</style>
