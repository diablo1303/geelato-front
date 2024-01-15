export default class Panel {
  title: string
  // 全局唯一
  name: string
  iconType: string
  componentName: string

  constructor(options: {
    title: string
    name: string
    iconType: string
    componentName: string
    showSetterPanels?: []
  }) {
    this.name = options.name
    this.title = options.title
    this.iconType = options.iconType
    this.componentName = options.componentName
  }
}
