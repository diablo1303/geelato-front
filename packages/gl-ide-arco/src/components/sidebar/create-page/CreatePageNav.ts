import { ComponentInstance } from '@geelato/gl-ui-schema'
import { PageType } from '@geelato/gl-ui'

export class PageInfo {
  // 页面标题
  label: string = ''
  // 页面图标
  iconType: string = ''
  // 页面类型
  type: PageType = PageType.emptyPage
  // 是否为菜单项
  isMenuitem: boolean = false
  // 页面内容
  content: ComponentInstance = new ComponentInstance()
  // 对应树节点的id
  pageExtendId: string = ''
  // 引用的页面页面，如在配置列表时，引用的是表单页面
  refPageContent: ComponentInstance = new ComponentInstance()

  constructor(type?: PageType) {
    if (PageType.listPage === type) {
      this.isMenuitem = true
    }
    this.type = type || PageType.emptyPage
  }
}
