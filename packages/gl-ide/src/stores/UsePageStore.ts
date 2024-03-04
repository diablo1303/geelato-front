import { ref } from 'vue'
import { defineStore } from 'pinia'
import { emitter, entityApi, EntitySaver, type PageType } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from './UseComponentStore'
import Page from '../entity/Page'
import History from '../utils/History'
import EventNames from '../entity/EventNames'

export const usePageStore = defineStore('GlPageStore', () => {
  /**
   *  最大的页面数
   */
  // const maxPage = ref(20)
  /**
   *  当前打开激活的页面
   */
  const currentPage = ref(new Page())

  /**
   *  当前打开激活的页面索引
   */
  const currentPageIndex = ref(-1)
  /**
   *  打开的页面集
   */
  const pages = ref<Array<Page>>([])

  // 以pageExtendId为key，记录每一个page的history
  const pageHistories: { [key: string]: History } = {}

  const currentPageHistory = ref(new History())

  const componentStore = useComponentStore()

  /**
   *  创建页面时的页面模板json,key为页面类型，如formPage、freePage
   */
  const pageTemplates: { [key: string]: any } = {}

  /**
   * 添加页面模板，同类型的只加一次
   * @param pageType
   * @param template
   */
  function addPageTemplate(pageType: string, template: any) {
    // console.log('addPageTemplate', pageType, template)
    if (!template || pageTemplates[pageType] !== undefined) return
    if (typeof template.then === 'function') {
      template.then((result: any) => {
        // console.log('addPageTemplate template.then result.default:', result.default)
        pageTemplates[pageType] = result.default
      })
    } else {
      pageTemplates[pageType] = template
    }
  }

  /**
   * 获取页面模板，并为页面模板中无id的组件加上id
   * @param pageType
   */
  function getPageTemplate(pageType: PageType): ComponentInstance {
    return JSON.parse(JSON.stringify(pageTemplates[pageType]))
  }

  function addPage(page: Page) {
    // console.log('push page to pageStore,page:', page)
    pages.value.push(page)
    // 为新增的页面创建历史记录对象
    pageHistories[page.extendId] = new History()

    switchToPage(pages.value.length - 1)
  }

  /**
   *  当前打开激活的页面实例id
   */
  function getCurrentPageInstId() {
    return currentPage.value.sourceContent?.id
  }

  /**
   * 通过页面id从打开的页面集中查找
   * @param id
   * @return e.g. {page: new Page(), index: -1}
   */
  function findPageById(id: string) {
    for (let index in pages.value) {
      if (pages.value[index].id === id) {
        return { page: pages.value[index], index: index }
      }
    }
    return { page: new Page(), index: -1 }
  }

  /**
   * 通过扩展id(页面所在的树id)从打开的页面集中查找
   * @param extendId
   * @return e.g. {page: new Page(), index: -1}
   */
  function findPageByExtendId(extendId: string) {
    for (let index in pages.value) {
      if (pages.value[index].extendId === extendId) {
        return { page: pages.value[index], index: index }
      }
    }
    return { page: new Page(), index: -1 }
  }

  function switchToPage(index: number) {
    // 如果是由于删除引起的切换，页面长度有时会为0
    if (pages.value.length === 0) {
      currentPageIndex.value = -1
      currentPage.value = new Page()
      currentPageHistory.value = new History()
      componentStore.$reset()
      return
    }
    const lastPageIndex = currentPageIndex.value
    // pages页面数量调整时，如做了删除操作，需要重新计算lastPageIndexAfter的值，确保索引到调整的数组上
    const lastPageIndexAfter =
      lastPageIndex >= pages.value.length ? lastPageIndex - 1 : lastPageIndex
    const newPageIndex = Number.parseInt(index + '')
    // console.log('switchToPage from index:', lastPageIndex, 'to index', newPageIndex, 'lastPage:', currentPage.value, 'componentStore:', componentStore)

    // 在切换页面时，记录原页面(lastPageIndex>=0)当前选中的组件
    if (lastPageIndexAfter >= 0) {
      pages.value[lastPageIndexAfter].currentSelectedComponentId =
        componentStore.currentSelectedComponentId
    }
    currentPageIndex.value = newPageIndex
    currentPage.value = pages.value[newPageIndex]
    currentPageHistory.value = pageHistories[currentPage.value.extendId]
    // 切换页面之后，重置页面组件状态，并重新选中页面记录的已选组件
    componentStore.$reset()
    componentStore.currentComponentTree.push(currentPage.value.sourceContent)
    if (currentPage.value.currentSelectedComponentId) {
      componentStore.setCurrentSelectedComponentById(currentPage.value.currentSelectedComponentId)
    }
  }

  function getPageLength() {
    return pages.value.length
  }

  /**
   * 加载页面
   * @param params
   * @return promise
   */
  function loadPage(params: object): Promise<any> {
    // console.log('loadPage from server by params:', params)
    return entityApi.query(
      'platform_app_page',
      'id,extendId,appId,code,sourceContent,description',
      params,
      false
    )
  }

  /**
   * 关闭页面
   * @param index
   */
  function closePage(index: number) {
    if (pages.value.length > index) {
      const page = pages.value.splice(index, 1)[0]
      // 关闭页面时，删除对应页面的历史记录
      delete pageHistories[page.extendId]
    }
    if (index <= currentPageIndex.value) {
      let toIndex = index - 1
      if (index - 1 < 0 && pages.value.length > 0) {
        toIndex = 0
      }
      switchToPage(toIndex)
    }
  }

  /**
   * 在保存页面之前，转换页面内容
   * @param page
   */
  function convertPageContent(page: Page) {
    // 需要删除的属性名
    // const deleteProps = ['']

    function convertToRelease(sourceContent?: object) {
      if (!sourceContent) return sourceContent
      const copyContent = JSON.parse(JSON.stringify(sourceContent))

      // console.log('copyContent:', copyContent)

      function convertObj(obj: object) {
        if (!obj) return
        // 检测当前的obj是否为组件实例，如果是，则压缩组件实例，则否按通用的对象进行处理
        // TODO const isComponentInst = true
        Object.keys(obj).forEach((key: string) => {
          // @ts-ignore
          let value = obj[key]
          // console.log('key', key, 'value:', value)
          // 去掉设计时属性：以“__”开头命名的属性
          // if (key.startsWith('__') || deleteProps.indexOf(key) >= 0) {
          if (key.startsWith('__')) {
            // @ts-ignore
            // console.log('delete obj[key]:', obj[key])
            // @ts-ignore
            delete obj[key]
            // console.log('after delete obj:', obj)
          } else {
            //
            if (typeof value === 'object') {
              convertObj(value)
            }
          }
          // 待做代码压缩，去掉设计时的或可默认的属性
          // TODO 更多属性处理
        })
        // @ts-ignore
        if (obj.children && obj.children.length > 0) {
          // @ts-ignore
          obj.children.forEach((subInst) => {
            convertObj(subInst)
          })
        }
      }

      convertObj(copyContent)
      return copyContent
    }

    /**
     * 暂时不保存preview信息直接返回
     * @param sourceContent
     */
    function convertToPreview(sourceContent?: ComponentInstance) {
      return {}
    }

    function convertToSource(sourceContent?: object) {
      if (!sourceContent) return sourceContent
      const copyContent = JSON.parse(JSON.stringify(sourceContent))

      function convertInst(inst: ComponentInstance) {
        if (!inst) return
        // console.log('inst.componentName', inst.componentName)

        if (inst.componentName) {
          // @ts-ignore
          delete inst.propsExpress
          // @ts-ignore
          delete inst.slotsExpress
          // @ts-ignore
          delete inst.title

          if (inst.props?.title) {
            inst.props.label = inst.props.label || inst.props.title
            delete inst.props?.title
            console.error(
              '#自动将props的title改成了label，需要同步改组件元数据：',
              inst.componentName
            )
          }
        }

        if (
          ['GlEntityTablePlus', 'GlEntityTable', 'GlEntityTableSub'].indexOf(inst.componentName) !==
          -1
        ) {
          // console.log('inst.componentName convert GlEntityTablePlus', inst)
          inst.props.query?.forEach((item: any) => {
            convertInst(item?.component)
          })
          inst.props.toolbar?.leftItems?.forEach((item: any) => {
            convertInst(item)
          })
          inst.props.toolbar?.rightItems?.forEach((item: any) => {
            convertInst(item)
          })
          inst.props.toolbar?.centerItems?.forEach((item: any) => {
            convertInst(item)
          })
          inst.props.columnActions?.forEach((item: any) => {
            convertInst(item)
          })
          inst.props.columns?.forEach((item: any) => {
            if (item._editComponent) {
              item._component = JSON.parse(JSON.stringify(item._editComponent))
              delete item._editComponent
              convertInst(item._component)
            }
          })
        }

        if (inst.componentName === 'AButton' && inst.slots) {
          // console.log('inst.componentName convert AButton')
          if (inst.slots?.icon?.componentName === 'GlIconfont') {
            inst.props.label = inst.slots?.icon?.props?.text
            inst.props.iconType = inst.slots?.icon?.props?.type
            inst.componentName = 'GlButton'
            delete inst.slots?.icon
          }
        }

        if (inst.componentName === 'ASelect') {
          inst.componentName = 'GlSelect'
        }

        // @ts-ignore
        if (inst.children && inst.children.length > 0) {
          // @ts-ignore
          inst.children.forEach((subInst) => {
            convertInst(subInst)
          })
        }
      }

      convertInst(copyContent)
      return copyContent
    }

    const convertedSource = convertToSource(page.sourceContent)
    const convertedRelease = convertToRelease(convertedSource)
    const convertedPreview = convertToPreview(convertedRelease)
    return { source: convertedSource, release: convertedRelease, preview: convertedPreview }
  }

  function getPageEntitySaver(page: Page) {
    const convertedPageContent = convertPageContent(page)
    const es: EntitySaver = new EntitySaver()
    es.entity = 'platform_app_page'
    es.record = {
      id: page.id,
      appId: page.appId,
      extendId: page.extendId,
      code: page.code,
      type: page.type,
      sourceContent: JSON.stringify(convertedPageContent.source),
      releaseContent: JSON.stringify(convertedPageContent.release),
      previewContent: JSON.stringify(convertedPageContent.preview),
      description: page.description
    }

    const esSub: EntitySaver = new EntitySaver()
    esSub.entity = 'platform_app_page_log'
    esSub.record = {
      pageId: page.id,
      label: convertedPageContent.source.props?.label,
      appId: page.appId,
      extendId: page.extendId,
      code: page.code,
      type: page.type,
      sourceContent: es.record.sourceContent,
      releaseContent: es.record.releaseContent,
      previewContent: es.record.previewContent,
      description: page.description
    }
    es.children = [esSub]
    return es
  }

  /**
   * 保存页面
   */
  function savePage(page: any) {
    function savePageToServer() {
      emitter.emit(EventNames.GlIdeToolbarPageSaving, { page: page })
      const entitySaver = getPageEntitySaver(page)
      return entityApi.saveEntity(entitySaver).then((res) => {
        page.id = res.data
        entitySaver.record.id = res.data
        emitter.emit(EventNames.GlIdeToolbarPageSaved, { page: entitySaver.record })
      })
    }

    // console.log('before savePage', page)
    // 获取当前服务端的页面数据
    if (page.id) {
      loadPage({ id: page.id }).then((pageRes: any) => {
        const sourceToSave = JSON.stringify(page.sourceContent)
        const lastSourceFromServer = pageRes.data?.length > 0 ? pageRes.data[0].sourceContent : ''
        if (
          sourceToSave.length === lastSourceFromServer.length &&
          sourceToSave == lastSourceFromServer
        ) {
          // 和服务端一样，不需保存
          const message = '当前页面和服务端的一致，不需要保存。'
          console.log('savePage', message)
          emitter.emit(EventNames.GlIdeToolbarPageSaveIgnore, { message, page })
        } else {
          savePageToServer()
        }
      })
    } else {
      savePageToServer()
    }
  }

  /**
   * 保存当前的页面到后台服务中
   */
  function saveCurrentPage() {
    return savePage(currentPage.value)
  }

  function setCurrentSourceContent(content?: ComponentInstance) {
    currentPage.value.sourceContent = content
  }

  /**
   * 回滚版本
   * @param sourceContent 页面的配置源码
   */
  function rollbackPage(sourceContent: ComponentInstance) {
    componentStore.$reset()
    componentStore.currentComponentTree.push(sourceContent)
    componentStore.clearCurrentSelectedComponent(currentPage.value.id)
    setCurrentSourceContent(sourceContent)
  }

  function logInit(title: string, sourceContent: any, targetComponentInst: ComponentInstance) {
    currentPageHistory.value.init(
      targetComponentInst.id,
      `${title}-${targetComponentInst.id}`,
      sourceContent,
      `组件ID：${targetComponentInst.id}，组件类型：${targetComponentInst.componentName}`
    )
  }

  function log(title: string, sourceContent: any, targetComponentInst: ComponentInstance) {
    currentPageHistory.value.push(
      targetComponentInst.id,
      `${title}-${targetComponentInst.id}`,
      sourceContent,
      `组件ID：${targetComponentInst.id}，组件类型：${targetComponentInst.componentName}`
    )
  }

  function undo() {
    currentPageHistory.value.undo()
    const step = currentPageHistory.value.getCurrentValue()
    if (step) {
      componentStore.setComponentTree(step.getValue())
      componentStore.setCurrentSelectedComponentById(step.getId())
      currentPage.value.resetSourceContent(step.getValue())
    }
  }

  function redo() {
    // const steps: Array<HistoryStep> | null = currentPageHistory.value.redo()
    currentPageHistory.value.redo()
    const step = currentPageHistory.value.getCurrentValue()
    if (step) {
      componentStore.setComponentTree(step.getValue())
      componentStore.setCurrentSelectedComponentById(step.getId())
      currentPage.value.resetSourceContent(step.getValue())
    }
  }

  return {
    addPageTemplate,
    getPageTemplate,
    pages,
    currentPageIndex,
    currentPage,
    currentPageHistory,
    addPage,
    closePage,
    findPageById,
    findPageByExtendId,
    switchToPage,
    setCurrentSourceContent,
    savePage,
    saveCurrentPage,
    loadPage,
    operationLogInit: logInit,
    operationLog: log,
    operationUndo: undo,
    operationRedo: redo,
    rollbackPage,
    getCurrentPageInstId,
    convertPageContent,
    getPageEntitySaver
  }
})
