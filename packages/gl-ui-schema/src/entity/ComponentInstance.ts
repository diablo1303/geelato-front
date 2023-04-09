import Action from "./actions/Action";

export default class ComponentInstance {
    id: string = ''
    title?: string = ''
    componentName: string = ''
    props: { [key: string]: any } = {}
    slots: { [key: string]: any } = {}
    children: Array<ComponentInstance> = []
    actions: Array<Action> = []
    // 是否禁用，默认为启用，用于设计时
    _disabled?: boolean
}
