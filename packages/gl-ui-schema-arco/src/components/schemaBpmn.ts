import {ComponentInstance, ComponentMeta} from '@geelato/gl-ui-schema'
import BpmnSequenceFlowMeta from './setter-bpmn/BpmnSequenceFlowMeta'
import BpmnStartEventMeta from './setter-bpmn/BpmnStartEventMeta'
import BpmnUserTaskMeta from './setter-bpmn/BpmnUserTaskMeta'
import BpmnServiceTaskMeta from './setter-bpmn/BpmnServiceTaskMeta'
import BpmnStartTimerEventMeta from './setter-bpmn/BpmnStartTimerEventMeta'
import BpmnIntermediateCatchTimerEventMeta from './setter-bpmn/BpmnIntermediateCatchTimerEventMeta'
import BpmnBoundaryTimerEventMeta from './setter-bpmn/BpmnBoundaryTimerEventMeta'
import BpmnStartMessageEventMeta from './setter-bpmn/BpmnStartMessageEventMeta'
import BpmnEndEventMeta from './setter-bpmn/BpmnEndEventMeta'
import BpmnInclusiveGatewayMeta from './setter-bpmn/BpmnInclusiveGatewayMeta'
import BpmnParallelGatewayMeta from './setter-bpmn/BpmnParallelGatewayMeta'
import BpmnExclusiveGatewayMeta from './setter-bpmn/BpmnExclusiveGatewayMeta'
import BpmnSubProcessMeta from './setter-bpmn/BpmnSubProcessMeta'
import BpmnEditorMeta from './setter-bpmn/logicFlow/BpmnEditorMeta'

// @ts-ignore
const componentMetas: Array<ComponentMeta> = [
  BpmnStartEventMeta,
  BpmnUserTaskMeta,
  BpmnServiceTaskMeta,
  BpmnStartTimerEventMeta,
  BpmnIntermediateCatchTimerEventMeta,
  BpmnBoundaryTimerEventMeta,
  BpmnStartMessageEventMeta,
  BpmnEndEventMeta,
  BpmnInclusiveGatewayMeta,
  BpmnParallelGatewayMeta,
  BpmnExclusiveGatewayMeta,
  BpmnSubProcessMeta,
  BpmnSequenceFlowMeta,
  BpmnEditorMeta
]

// @ts-ignore
const customInstances: Array<ComponentInstance> = []
const componentInstances: Array<ComponentInstance> = []
// 对于没有个性化的实例，即没有个性编码配置的实例，采用以下程序构建的默认实例信息
for (const index in componentMetas) {
  const foundInstance = customInstances.find((item: ComponentInstance) => {
    return item.componentName === componentMetas[index].componentName
  })
  if (foundInstance) {
    componentInstances.push(foundInstance)
  } else {
    const componentInstance = new ComponentInstance()
    componentInstance.componentName = componentMetas[index].componentName
    componentInstance.props = {}
    componentInstance.slots = {}
    componentInstance.children = []
    componentInstances.push(componentInstance)
  }
}
const schemaBpmn = {componentMetas, componentInstances}
export {schemaBpmn}