import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { EntityMeta, utils } from '@geelato/gl-ui'

export class PageCreatorOptions {
  // 应用Id
  appId: string = ''
  // 页面名称
  pageLabel: string = ''
  // 实体元数据
  entityMeta: EntityMeta = new EntityMeta()
  // 该属性表单适用 每行默认三列
  colSpan: number = 3
}

export const usePageConfig = (label?: string) => {
  return {
    id: utils.gid('page'),
    componentName: 'GlPage',
    props: {
      label: label || '页面',
      pageMargin: '0',
      pageType: 'formPage'
    },
    slots: {},
    children: [],
    actions: []
  }
}

export abstract class PageCreator {
  create(options: PageCreatorOptions) {
    const page = usePageConfig(options.pageLabel)
    return this.buildChildren(page, options)
  }

  /**
   * 返回构建之后的页面信息
   * @param page
   * @param options
   */
  abstract buildChildren(page: ComponentInstance, options: PageCreatorOptions): ComponentInstance
}
