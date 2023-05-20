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
      <a-col flex="2em" v-if="mv.componentName">
        <a-button type="text" title="设置组件信息" @click="openComponentSetterModal">
          <gl-iconfont type="gl-setting"></gl-iconfont>
        </a-button>
      </a-col>
    </a-row>
    <a-modal draggable :visible="visible" title="设置组件" @ok="()=>{visible=false}" @cancel="()=>{visible=false}" :width="600" style="top: 20px">
      <GlComponentSetter :componentMeta="componentMeta" :componentInstance="mv" @update="(val)=>{updateInstance(val)}"/>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlComponentSelect'
}
</script>
<script lang="ts" setup>
import {onUpdated, type PropType, ref, watch} from "vue";
import GlComponentSetter from "../GlComponentSetter.vue";
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update:modelValue'])
const props = defineProps(
    {
      modelValue: {
        type: Object as PropType<ComponentInstance>,
        default() {
          return new ComponentInstance()
        }
      },
      options: {
        type: Object,
        default() {
          return [
            {componentName: 'AInput', title: '单行文本'},
            {componentName: 'ASwitch', title: '开关'},
            {componentName: 'ASelect', title: '下拉选择'},
            {componentName: 'AButton', title: '按钮'}
          ]
        }
      }
    }
)
const mv = ref(props.modelValue)
const visible = ref(false)
const componentMeta = ref(new ComponentMeta())
const componentInstance = ref(new ComponentInstance())
const ideStore = useIdeStore()


watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})
const openComponentSetterModal = () => {
  visible.value = true
}
const findComponentMeta = (componentName: string) => {
  return useComponentMaterialStore().componentMetas.find((value: any) => {
    return value.componentName === componentName
  })
}
/**
 * 更改组件，同时重置组件实例信息
 * @param componentName
 */
const changeComponent = (componentName: string) => {
  mv.value.children = []
  mv.value.props = {}
  mv.value.slots = {}
  // @ts-ignore
  componentMeta.value = findComponentMeta(componentName)
  console.log('findComponentMeta by componentName:', componentName, 'get', componentMeta.value)
  visible.value = true
}
const updateInstance = (instance: ComponentInstance) => {
  mv.value = instance
  console.log(instance)
}

// 初始化设置元数据信息
if (mv.value.componentName) {
  // @ts-ignore
  componentMeta.value = findComponentMeta(mv.value.componentName)
}


</script>

<style scoped>

</style>
