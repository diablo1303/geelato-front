<template>
  <div class="gl-component-select">
    <a-row>
      <a-col flex="auto">
        <a-select v-model="mv.componentName" @change="changeComponent" allow-clear>
          <a-option v-for="item in options" :value="item.componentName" :title="getTitle(item.componentName)"
                    :class="{'gl-selected':mv.componentName===item.componentName}">
            {{ item.title + getTitle(item.componentName, '-') }}
          </a-option>
        </a-select>
      </a-col>
      <a-col flex="2em" v-if="mv.componentName">
        <a-button-group>
          <a-button type="text" title="设置属性" @click="openComponentSetterModal('props')" style="padding:0 5px">
            <gl-iconfont type="gl-setting"></gl-iconfont>
          </a-button>
          <a-button type="text" title="设置动作" @click="openComponentSetterModal('actions')" style="padding:0 5px">
            <gl-iconfont type="gl-thunderbolt"></gl-iconfont>
          </a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-modal :visible="visible" title="设置组件" @ok="()=>{visible=false}"
             @cancel="()=>{visible=false}"
             :width="600" style="top: 20px" :hide-cancel="true" ok-text="关闭"
             draggable
    >
      <template v-if="visible&&componentMeta">
        <GlComponentSetter :componentMeta="componentMeta"
                           :componentInstance="mv"
                           :defaultActiveKey="defaultActiveKey"
                           :hideToolbar="true"
                           @update="(val)=>{updateInstance(val)}"/>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlComponentSelect'
}
</script>
<script lang="ts" setup>
import {getCurrentInstance, type PropType, ref, watch} from "vue";
import {ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import GlComponentSelectOptions from "./GlComponentSelectOptions";
import GlComponentSetter from "../GlComponentSetter.vue";
import {BindField} from "@geelato/gl-ui-schema";

const currentInstance = getCurrentInstance()

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
        type: Array as PropType<Array<{ componentName: string, title: string }>>,
        default() {
          return GlComponentSelectOptions
        }
      }
    }
)
const mv = ref(props.modelValue)
const visible = ref(false)
const componentMeta = ref(new ComponentMeta())
const componentInstance = ref(new ComponentInstance())
// 依据不同的组件类型获取实例化标题
const getTitle = (componentName: string, pre: string = '') => {
  let name = mv.value?.props?.label
  return name ? pre + name : ''
}


watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})
let defaultActiveKey = ref("props")
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
  // mv.value.children = []
  // mv.value.props = {}
  // mv.value.slots = {}

  const newInst = new ComponentInstance()
  newInst.props.label = mv.value?.props.label

  componentMeta.value = findComponentMeta(componentName)!
  const foundPropertyMeta = componentMeta.value.properties.find((property) => {
    return property.name === 'bindField'
  })
  if (foundPropertyMeta) {
    newInst.props.bindField = mv.value?.props.bindField || new BindField()
  }

  // 切换组件时，所有的信息重置
  mv.value = newInst
  mv.value.componentName = componentName
  // console.log('findComponentMeta by componentName:', componentName, 'get', componentMeta.value)
  if (componentName) {
    // visible.value = true
    //强制更新dom，无效？
    // currentInstance!.proxy!.$forceUpdate()
  }
}
const updateInstance = (instance: ComponentInstance) => {
  mv.value = instance
  // console.log(instance)
}

// 初始化设置元数据信息
if (mv.value.componentName) {
  componentMeta.value = findComponentMeta(mv.value.componentName)!
}


</script>

<style scoped>

</style>
