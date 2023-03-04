export default class ComponentRuntimeMeta {
    title: string = '标题'
    componentName: string = ''
    // layout\base\form
    group: string = ''
    props: object = {}
    children: Array<ComponentRuntimeMeta> = []

    // 其它属性
    innerHtml?: string
    [key: string]: any

    constructor() {
    }

}
