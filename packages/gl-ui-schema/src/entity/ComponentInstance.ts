export default class ComponentInstance{
    id: string = ''
    title?:string = ''
    componentName: string = ''
    props: { [key: string]: any } = {}
    slots: { [key: string]: any } = {}
    children: Array<ComponentInstance> = []
}
