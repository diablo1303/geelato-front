import {ComponentMeta, ComponentInstance} from "@geelato/gl-ui-schema";
import BpmnStartEventMeta from "./setter-bpmn/BpmnStartEventMeta";
import BpmnUserTaskMeta from "./setter-bpmn/BpmnUserTaskMeta";
import BpmnServiceTaskMeta from "./setter-bpmn/BpmnServiceTaskMeta";

// @ts-ignore
const componentMetas: Array<ComponentMeta> = [BpmnStartEventMeta,BpmnUserTaskMeta,BpmnServiceTaskMeta]

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