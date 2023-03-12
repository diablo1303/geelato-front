export default class Panel {

    title: string
    // 全局唯一
    name: string
    iconType: string
    componentName: string
    opts?: object

    constructor(options: { title: string, name: string, iconType: string, componentName: string }) {
        this.name = options.name
        this.title = options.title
        this.iconType = options.iconType
        this.componentName = options.componentName
    }
}
