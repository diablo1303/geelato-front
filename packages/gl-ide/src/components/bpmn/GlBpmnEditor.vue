<script lang="ts">
export default {
  name: 'GlBpmnEditor'
}
</script>
<script lang="ts" setup>
/**
 *  在调用IDE工具栏的保存操作时，会保存当前打开的页面，而当前打开的页面pageInst存在refObject对象，存储了流程图原始json数据（rawData），故在保存页面时会将流程图也一起保存。
 *
 *
 *  TODO 放大、缩小、上一步、下一步，可参考：https://site.logic-flow.cn/demo/dist/organizer
 *  TODO 流程图可以放大全屏、可以有历史记录操作
 *  选中流程图节点，在右边属性栏点删除时，可以删除对应用节点和连线
 *  选中流程图连线，在右边属性栏点删除时，可以删除对应连线
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { utils } from '@geelato/gl-ui'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from '../../stores/UseComponentStore'
import { useIdeStore } from '../../stores/UseIdeStore'
import { usePageStore } from '../../stores/UsePageStore'
import BpmnCore from './BpmnCore.vue'
import { emitter } from '@geelato/gl-ui'
import EventNames from '../../entity/EventNames'

const BPMN_ELE_ID = 'bpmnEle'
const emits = defineEmits(['update:modelValue', 'click'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})

const ideStore = useIdeStore()
const pageStore = usePageStore()
const componentStore = useComponentStore()
// 当前页面树
const pageInst = componentStore.currentComponentTree[0]
// 初始流程图对象，设置到pageInst的refObject中；graphRawData对应流程图中的graphRawData
pageInst.refObject = pageInst.refObject || {
  graphRawData: { nodes: [], edges: [] },
  editor: {},
  history: [{ v: 'xx', graphRawData: {} }]
}

// 当前页面的BPMN组件树
const bpmnInst = pageInst.children[0]

/**
 * 去掉字符串的中的“:”，同时将分号后一位字符转成大写，并在字符串加上'Gl'
 * 如输入：bpmn:startEvent，输出：GlBpmnStartEvent
 * @param input
 * @return
 */
const convertToComponentName = (input: string, type: string): string => {
  // 将字符串拆分为两部分，直到 ":" 字符
  const firstPart = input.split(':')[0]
  const secondPart = input.split(':')[1]
  // 将第一部分和第二部分的第一个字符转换为大写
  const firstPartUpper = firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
  let secondPartUpper = secondPart.charAt(0).toUpperCase() + secondPart.slice(1)
  // 存在类型时，加入类型
  let typePart = ''
  if (type) {
    const secondTypePart = type.split(':')[1]
    typePart = secondTypePart.charAt(0).toUpperCase() + secondTypePart.slice(1)
    typePart = typePart.replace(/Definition$/i, '')
    secondPartUpper = secondPartUpper.replace(/Event$/i, '')
  }
  console.log('Gl' + firstPartUpper + secondPartUpper + typePart)
  // 重新组合字符串
  return 'Gl' + firstPartUpper + secondPartUpper + typePart
}
const currentElement = ref({})
const bpmnCoreRef: any = ref()

/**
 *  监听当前实例currentSelectedComponentInstance
 *  将IDE属性面板配置的值更新到流程图中
 */
watch(
  () => {
    return componentStore.currentSelectedComponentInstance
  },
  () => {
    const inst = componentStore.currentSelectedComponentInstance
    if (inst.refId && bpmnCoreRef.value) {
      let elementModel = bpmnCoreRef.value.getLogicFlow().getNodeModelById(inst.refId)
      // console.log('elementModel1', elementModel)
      if (!elementModel) {
        elementModel = bpmnCoreRef.value.getLogicFlow().getEdgeModelById(inst.refId)
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

/**
 * 打开线动画，范围：从节点流出的线
 * @param param
 */
const openEdgeAnimation = (param: any) => {
  if (isEdge(param.data.type)) {
    bpmnCoreRef.value.openEdgeAnimationByEdgeId(param.data.id)
  } else {
    bpmnCoreRef.value.openEdgeAnimationByNodeId(param.data.id)
  }
}

/**
 * 点击流程图节点或连线时触发
 * 同步修改组件的名称
 * @param param
 */
const onClick = (param: any) => {
  currentElement.value = param
  const inst = componentStore.findComponentFromTreeByRefId(param.data.id)
  if (inst) {
    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentById(inst.id, pageStore.currentPage.id)
  }
  console.log('onClick,find Inst', inst)

  // 去掉连线点击移动事件，解决点击就出现拖动的问题
  if (isEdge(param.data.type)) {
    console.log('lf-edge', document.querySelector('.lf-edge'))
    document.querySelector('.lf-edge')?.removeEventListener('mousemove', () => {
      // 停止冒泡，避免选中上级组件，如GlPage
      // 注意！！ 这里需放在回调事件中，否则会影响removeEventListener的执行，因为removeEventListener还没有执行完，就被停了
      param.e.stopPropagation()
    })
  } else {
    // 停止冒泡，避免选中上级组件，如GlPage
    param.e.stopPropagation()
  }
  openEdgeAnimation(param)
}

/**
 * 修改流程图节点或连线的文字时触发
 * 同步修改组件的名称
 * @param param
 */
const onTextUpdate = (param: any) => {
  componentStore.currentSelectedComponentInstance.props.text = param.text
}

/**
 * 点击空白地时，选中流程图组件GlBpmnEditor（注意这个组件没有ui，只有元数据定义）
 * @param param
 */
const onBlankClick = (param: any) => {
  componentStore.currentDragComponentId = ''
  componentStore.setCurrentSelectedComponentById(bpmnInst.id, pageStore.currentPage.id)
  param.e.stopPropagation()
}

const isEdge = (elementType: string) => {
  return elementType === 'bpmn:sequenceFlow'
}

/**
 * 在流程图上添加节点或连线时触发
 * 基于加入的流程图节点，构建一个对应的组件，加入组件树中
 * @param param
 */
const onAdd = (param: any) => {
  console.log('bpmnEditor > onAdd', param)

  currentElement.value = param
  if (param.data.type) {
    const inst = new ComponentInstance()
    // 注意！！字符“bpmnEle”用于控制右边操作按钮，不可修改
    inst.id = utils.gid(BPMN_ELE_ID)
    // 基于流程图节点的类型名称创建对应的组件名称
    inst.componentName = convertToComponentName(
      param.data.type,
      param.data.properties.definitionType
    )
    // 通过组件的refId和流程图元素的id做关联
    inst.refId = param.data.id
    inst.props = {
      id: inst.refId,
      text: param.data.text?.value || ''
    }
    bpmnInst.children.push(inst)

    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentById(inst.id, pageStore.currentPage.id)

    // 记录操作，这里不在IDE中记录，改由BPMN自行记录
    // pageStore.operationLog('加组件', pageStore.currentPage.sourceContent, inst)
  }
}

/**
 * 删除流程图上的节点时触发
 * 同步删除图外的bpmnInst组件树中相应的组件
 * @param param
 */
const onDelete = (param: any) => {
  // console.log('bpmnEditor > onDelete', param)
  currentElement.value = {}
  componentStore.deleteComponentByRefId(param.data.id)
}

/**
 * 组件属性面板删除之后触发
 * @param param {componentId:string}
 */
const onComponentDeleting = (param: any) => {
  // console.log('delete componentId', param.componentId)
  const inst = componentStore.findComponentFromTreeById(param.componentId)
  const lf = bpmnCoreRef.value.getLogicFlow()
  if (inst.componentName === 'GlBpmnSequenceFlow') {
    // 是线
    bpmnCoreRef.value.getLogicFlow().deleteEdge(inst.refId)
  } else {
    // 是节点
    // 获取节点的所有连线
    const edges: any[] = lf.getNodeEdges(inst.refId)
    edges?.forEach((edge: any) => {
      // 删除组件
      componentStore.deleteComponentByRefId(edge.id)
    })
    bpmnCoreRef.value.getLogicFlow().deleteNode(inst.refId)
  }
}
emitter.on(EventNames.GlIdeSetterComponentInstDeleting, onComponentDeleting)

onMounted(() => {})
onUnmounted(() => {
  emitter.off(EventNames.GlIdeSetterComponentInstDeleting, onComponentDeleting)
})
</script>

<template>
  <BpmnCore
    ref="bpmnCoreRef"
    v-model="pageInst.refObject.graphRawData"
    @click="onClick"
    @dbclick="onClick"
    @add="onAdd"
    @delete="onDelete"
    @textUpdate="onTextUpdate"
    @blankClick="onBlankClick"
  />
</template>

<style scoped></style>
