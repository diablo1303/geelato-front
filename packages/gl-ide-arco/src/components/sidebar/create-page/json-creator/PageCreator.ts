import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { EntityMeta, type FieldMeta, PageType, utils } from '@geelato/gl-ui'
import { PageInfo } from '../CreatePageNav'

export class PageCreatorOptions {
  // 应用Id
  appId: string = ''
  // // 页面名称
  // pageLabel: string = ''
  // // 页面类型，如formPage
  // pageType: string = ''
  pageInfo: PageInfo = new PageInfo(PageType.emptyPage)
  // 实体元数据
  entityMeta: EntityMeta = new EntityMeta()
  // 该属性表单适用 每行默认三列
  colSpan: number = 3
  // 展示的字段，用于列表时，表示列，用于表单时，表示指定展示的表单字段
  showFields: FieldMeta[] = []
  // 该属性列表页面适用 每行默认三列
  queryFields: FieldMeta[] = []

}

export const usePageConfig = ( pageType: PageType,label?: string) => {
  return {
    id: utils.gid('page'),
    componentName: 'GlPage',
    props: {
      label: label || '页面',
      pageMargin: '0',
      pageType: pageType || PageType.emptyPage
    },
    slots: {},
    children: [],
    actions: []
  }
}

export abstract class PageCreator {
  async createPage(options: PageCreatorOptions) {
    const page = usePageConfig(options.pageInfo.type,options.pageInfo.label)
    return await this.buildChildren(page, options)
  }

  /**
   * 返回构建之后的页面信息
   * @param page
   * @param options
   */
   abstract buildChildren(page: ComponentInstance, options: PageCreatorOptions): Promise<ComponentInstance>
}
