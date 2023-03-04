export default class Panel {

    title: string
    // 全局唯一
    name: string
    icon: string
    componentName: string
    opts?: object

    constructor(options: { title: string, name: string, icon: string, componentName: string }) {
        this.name = options.name
        this.title = options.title
        this.icon = options.icon
        this.componentName = options.componentName
    }
}
