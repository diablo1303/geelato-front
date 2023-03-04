/**
 *  组件实例定义
 */
export default interface IComponentInstance {
    id: string
    componentName: string
    props?: { [key: string]: any }
    slots?: { [key: string]: any }
    children?: Array<IComponentInstance>
    style?: object
}
