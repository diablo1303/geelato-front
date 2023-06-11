<template>
  <div>
    <a-row>
      <a-col flex="auto">
        <a-select v-model="mv.componentName" @change="changeComponent" allow-clear>
          <a-option v-for="item in options" :value="item.componentName" :title="getTitle(item.componentName)">
            {{ item.title + getTitle(item.componentName, '-') }}
          </a-option>
        </a-select>
      </a-col>
      <a-col flex="2em" v-if="mv.componentName">
        <a-button-group>
          <a-button type="text" title="设置属性" @click="openComponentSetterModal('1')" style="padding:0 5px">
            <gl-iconfont type="gl-setting"></gl-iconfont>
          </a-button>
          <a-button type="text" title="设置动作" @click="openComponentSetterModal('2')" style="padding:0 5px">
            <gl-iconfont type="gl-thunderbolt"></gl-iconfont>
          </a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-modal v-if="visible" draggable :visible="visible" title="设置组件" @ok="()=>{visible=false}"
             @cancel="()=>{visible=false}"
             :width="600" style="top: 20px" :hide-cancel="true" ok-text="关闭">
      <GlComponentSetter v-if="componentMeta" :componentMeta="componentMeta"
                         :componentInstance="mv"
                         :defaultActiveKey="defaultActiveKey"
                         @update="(val)=>{updateInstance(val)}"/>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlComponentSelect'
}
</script>
<script lang="ts" setup>
import {type PropType, ref, watch} from "vue";
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
            {componentName: 'AButton', title: '按钮'},
            {componentName: 'AInput', title: '单行文本'},
            {componentName: 'ASwitch', title: '开关'},
            {componentName: 'ASelect', title: '下拉选择'},
            {componentName: 'GlDict', title: '数据字典'},
            {componentName: 'ADatePicker', title: '日期选择器'},
            {componentName: 'ATimePicker', title: '时间选择器'},
            {componentName: 'GlUserSelect', title: '人员选择器'},
            {componentName: 'AUpload', title: '上传'}
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
// 依据不同的组件类型获取实体化标题
const getTitle = (componentName: string, pre: string = '') => {
  let name = ''
  if (componentName === 'AButton') {
    name = mv.value?.slots?.icon?.props?.text
  }
  return name ? pre + name : ''
}


watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})
let defaultActiveKey = ref("1")
const openComponentSetterModal = (activeKey: string) => {
  defaultActiveKey.value = activeKey
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
  if (componentName) {
    visible.value = true
  }
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
