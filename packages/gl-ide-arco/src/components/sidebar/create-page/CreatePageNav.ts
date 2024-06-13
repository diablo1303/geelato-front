import { ComponentInstance } from '@geelato/gl-ui-schema'
import { PageType } from '@geelato/gl-ui'

export class PageInfo {
  // 页面标题
  label: string = ''
  // 打开页面时页面宽度，默认为80%，也可以是1024px等
  openPageWidth: string = '80%'
  // 打开页面时页面的模式
  openPageMode = 'Drawer'
  // 页面图标
  iconType: string = ''
  // 页面类型
  type: PageType = PageType.emptyPage
  // 是否为菜单项
  isMenuitem: boolean = false
  // 页面内容，最终创建的页面内容源码，用于保存到数据库
  content: ComponentInstance = new ComponentInstance()
  // 对应树节点的id
  pageExtendId: string = ''
  // 引用的页面页面，如在配置列表时，引用的是表单页面
  pageExtendContent: ComponentInstance = new ComponentInstance()

  constructor(type?: PageType) {
    if (PageType.listPage === type) {
      this.isMenuitem = true
    }
    this.type = type || PageType.emptyPage
  }
}

export const FilteredFieldNames = [
  'id',
  'createAt',
  'creator',
  'creatorName',
  'updateAt',
  'updater',
  'updaterName',
  'delStatus',
  'deleteAt',
  'seqNo',
  'deptId',
  'buId',
  'tenantCode'
]
