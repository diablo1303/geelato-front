export default class ComponentInstance{
    id: string = ''
    componentName: string = ''
    props: { [key: string]: any } = {}
    slots: { [key: string]: any } = {}
    children: Array<ComponentInstance> = []
}
