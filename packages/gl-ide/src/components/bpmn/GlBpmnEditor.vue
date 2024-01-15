<script lang="ts">
export default {
  name: 'GlBpmnEditor'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from '../../stores/UseComponentStore'
import { useIdeStore } from '../../stores/UseIdeStore'
import { usePageStore } from '../../stores/UsePageStore'
import BpmnCore from './BpmnCore.vue'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue', 'click'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

// const addItem = (hoverIndex: number, item: ComponentInstance) => {
//   // console.log('GlInsts > addItem() > hoverIndex:', hoverIndex, 'item:', item)
//   item.id = utils.gid(componentStore.getAlias(item.componentName) || 'id')
//   item.group = componentStore.getComponentGroupName(item.componentName)
//   props.glComponentInst.children!.splice(hoverIndex, 0, item)
//   tryRemoveDndPlaceholder(props.glComponentInst.children)
//   componentStore.currentDragComponentId = ''
//   componentStore.setCurrentSelectedComponentByIdFromItems(item.id, props.glComponentInst.children, pageProvideProxy.pageInst.id)
//   // 记录操作
//   pageStore.operationLog('加组件', pageStore.currentPage.sourceContent, item)
//   refresh()
// }

const ideStore = useIdeStore()
const pageStore = usePageStore()
const componentStore = useComponentStore()
const pageInst = componentStore.currentComponentTree[0]
const bpmnInst = pageInst.children[0]

/**
 * 去掉字符串的中的“:”，同时将分号后一位字符转成大写，并在字符串加上'Gl'
 * 如输入：bpmn:startEvent，输出：GlBpmnStartEvent
 * @param input
 * @return
 */
const convertToComponentName = (input: string): string => {
  // 将字符串拆分为两部分，直到 ":" 字符
  const firstPart = input.split(':')[0]
  const secondPart = input.split(':')[1]
  // 将第一部分和第二部分的第一个字符转换为大写
  const firstPartUpper = firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
  const secondPartUpper = secondPart.charAt(0).toUpperCase() + secondPart.slice(1)
  console.log('Gl' + firstPartUpper + secondPartUpper)
  // 重新组合字符串
  return 'Gl' + firstPartUpper + secondPartUpper
}
const currentElement = ref({})
const bpmnRef: any = ref()

/**
 *  监听当前实例currentSelectedComponentInstance
 *  将IDE属性面板配置的值更新到图中
 */
watch(
  () => {
    return componentStore.currentSelectedComponentInstance
  },
  () => {
    const inst = componentStore.currentSelectedComponentInstance
    if (inst.refId) {
      let elementModel = bpmnRef.value.getLogicFlow().getNodeModelById(inst.refId)
      // console.log('elementModel1', elementModel)
      if (!elementModel) {
        elementModel = bpmnRef.value.getLogicFlow().getEdgeModelById(inst.refId)
        // console.log('elementModel2', elementModel)
      }
      if (elementModel) {
        // 更新标题,id不需要更新
        elementModel?.updateText(inst.props.text)
        // console.log('inst', inst, 'elementModel', elementModel)
        const ignoreProps: string[] = ['id', 'text']

        let props: Record<string, any> = {}
        // 更新其它属性
        Object.keys(inst.props).forEach((key: string) => {
          if (!ignoreProps.includes(key)) {
            props[key] = inst.props[key]
          }
        })
        elementModel.setProperties(props)
      } else {
        console.error('通过refId获取不到model', inst.refId, inst)
      }
      // console.log('currentComponent', componentStore.currentSelectedComponentInstance)
    }
  },
  { deep: true }
)

const onClick = (param: any) => {
  currentElement.value = param
  const inst = componentStore.findComponentFromTreeByRefId(param.data.id)
  if (inst) {
    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentById(inst.id, pageStore.currentPage.id)
  }
  param.e.stopPropagation()
}

const onTextUpdate = (params: any) => {
  componentStore.currentSelectedComponentInstance.props.text = params.text
}

const onAdd = (param: any) => {
  console.log('add', param)

  currentElement.value = param
  if (param.data.type) {
    const inst = new ComponentInstance()
    inst.id = utils.gid('bpmnEle')
    inst.componentName = convertToComponentName(param.data.type)
    inst.refId = param.data.id
    inst.props = {
      id: inst.refId,
      text: param.data.text.value
    }
    // inst.refId =
    bpmnInst.children.push(inst)

    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentById(inst.id, pageStore.currentPage.id)
    // 记录操作，这里不做记录，改由BPMN自行记录
    // pageStore.operationLog('加组件', pageStore.currentPage.sourceContent, inst)
  }
}

const onDelete = (param: any) => {
  console.log('onDelete', param)
  currentElement.value = {}
  const inst = componentStore.findComponentFromTreeByRefId(param.data.id)
  if (inst) {
    componentStore.deleteComponentInstById(inst.id)
  }
}
</script>

<template>
  <BpmnCore
    ref="bpmnRef"
    @click="onClick"
    @dbclick="onClick"
    @add="onAdd"
    @delete="onDelete"
    @textUpdate="onTextUpdate"
  />
</template>

<style scoped></style>
