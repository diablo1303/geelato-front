/**
 *  在Page组件的所有子组件中注入的对象
 */
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import type { ComponentInternalInstance } from 'vue'
import type {InstPermission, Param, ParamMeta} from '../m/types/global'
import utils from '../m/utils/Utils'

export type PageParamConfigType = { pName: string; pValue: any; pType: string }
export type PageCustomType = {
  id: string
  pageId: string
  // key为页面中的组件的id,值为该组件的个性化配置
  cfg: Record<string, any>
}

/**
 * 页面权限管理
 */
export class PagePermission {
  perms: InstPermission[] = []

  setPermissions(perms: InstPermission[]) {
    this.perms = perms || []
  }

  /**
   * 是否有查看权限
   * @param instId 组件实例id
   */
  hasReadPermission(instId: string) {
    const found = this.perms?.find((permission: InstPermission) => {
      return permission.code === instId && permission.rule === 'r'
    })
    console.log('found',found)
    return !!found
  }

  /**
   * 是否有编辑权限
   * @param instId 组件实例id
   */
  hasWritePermission(instId: string) {
    const found = this.perms?.find((permission: InstPermission) => {
      return permission.code === instId && permission.rule === 'w'
    })
    return !!found
  }
}

export const PageProvideKey = 'PageProvideKey'
export const PageParamsKey = 'PageParamsKey'
export const PageProvideKeyNotBlockPage = 'PageProvideKeyNotBlockPage'

/**
 * 参数据对象序列化，形成代码块
 * @param params
 */
export const paramStringify = (params: Array<PageParamConfigType>) => {
  const strArray = []
  strArray.push('[')
  let index = 1
  params.forEach((param) => {
    strArray.push('{')
    strArray.push(`"${param.pName}":`)
    switch (param.pType) {
      case undefined:
        strArray.push(`"${param.pValue}"`)
        break
      case 'string':
        strArray.push(`"${param.pValue}"`)
        break
      case 'number':
        strArray.push(param.pValue)
        break
      case 'boolean':
        strArray.push(param.pValue)
        break
      case 'express':
        strArray.push(param.pValue)
        break
      case 'array':
        strArray.push(param.pValue)
        break
      case 'object':
        strArray.push(param.pValue)
        break
      default:
        strArray.push(`"${param.pValue}"`)
        break
    }
    strArray.push('}')
    if (index !== params.length) {
      strArray.push(',')
    }
    index++
  })
  strArray.push(']')
  return strArray.join('')
}

// 不计入统计的组件
const ignoreComponents = ['GlVirtual', 'GlPage', 'GlDndPlaceholder']

export default class PageProvideProxy {
  // 同pageInstId
  id: string = ''
  // 数据库中的字段，页面id
  pageId: string = ''
  pageStatus: string = 'read'
  pageCustom?: PageCustomType
  pagePermission?: PagePermission
  pageTemplateName: string = ''
  pageInst: ComponentInstance
  pageVueInst: ComponentInternalInstance | null
  pageParams: Array<Param> = []
  pageParamsMeta:Array<ParamMeta> = []
  pageCtx: object = {}
  vueRefMap: { [key: string]: ComponentInternalInstance | null } = {}
  componentInstMap: { [key: string]: ComponentInstance } = {}
  unMountedIds: { [key: string]: boolean } = {}
  onPageMountedEvents: { id: string; fn: Function }[] = []

  constructor(pageInst: ComponentInstance, pageVueInst: ComponentInternalInstance) {
    this.pageInst = pageInst
    this.pageVueInst = pageVueInst
    this.id = pageInst.id

    const statAllComponentIds = () => {
      const ids: { [key: string]: boolean } = {}
      const statId = (inst: ComponentInstance) => {
        if(inst&&inst.id&&inst.componentName){
          // 过滤无效的组件
          if (ignoreComponents.indexOf(inst.componentName) === -1) {
            ids[inst.id] = true
          }
          if (inst.children?.length > 0) {
            for (const index in inst.children) {
              statId(inst.children[index])
            }
          }
        }
      }
      statId(pageInst)
      // console.log('statAllComponentIds() > ids:', Object.keys(ids).length, ids)
      return ids
    }
    // 设置未加载完成（未mounted）的组件ids
    this.unMountedIds = statAllComponentIds()

    // console.log('new PageProvideProxy(),id:', this.id)
  }

  addPageMountedEvent(fn: Function) {
    const id = utils.gid('id')
    this.onPageMountedEvents.push({ id, fn })
    return id
  }

  removePageMountedEvent(id: string) {
    const index = this.onPageMountedEvents.findIndex((event) => {
      return event.id === id
    })
    if (index >= 0) {
      this.onPageMountedEvents.splice(index, 1)
    }
  }

  /**
   * 页面内子组件引用（在组件mounted之后执行）
   * 同时计算有多少组件还未mounted，记录在unMountedIds
   *
   * 注意！！！
   * 本方法可在gl-component的setup先执行一次，再在onMounted再执行一次
   * 第一次执行是为了确保基础组件的VueRef都已创建，便于后续的组件在事件中引用前端创建的组件
   * 第二次在onMounted中再执行一次，是为了确保像table这类复合的组件在create时，vueRef的refs为{}，无实际的组件实例，需要onMounted时才产生
   * @param componentId
   * @param vueRef vue实组件实例，这里的vueRef为GlComponent动态组件实例，需再进一步通过refs[componentId]获取最终的实例
   */
  setVueRef(componentId: string, vueRef: ComponentInternalInstance | null) {
    // console.log('setVueRef() > pageProxyId:', this.id, 'componentId:', componentId, 'vueRef:', vueRef)
    if (componentId && vueRef) {
      // console.log('setVueRef(),componentId:', componentId, ',vueRef:', vueRef, vueRef.props.glComponentInst)
      this.vueRefMap[componentId] = vueRef
      this.componentInstMap[componentId] = vueRef.props.glComponentInst as ComponentInstance
      if (!this.componentInstMap[componentId].componentName) {
        console.error(
          '在setVueRef时，存在组件名为空的组件',
          this.componentInstMap[componentId],
          vueRef
        )
      }
      // 由于动态组件的的onMounted事件次序中，父组件不是最后一个触发，这里自行实现
      if (this.unMountedIds[componentId]) {
        // vueRef.refs有实例时，才算有效设置，这时就可以标记已经onMounted
        if (vueRef.refs && Object.keys(vueRef.refs).length > 0) {
          delete this.unMountedIds[componentId]
          // console.log('delete unMounted id:', componentId, 'current unMountedIds:', Object.keys(this.unMountedIds).length, this.unMountedIds,)
          if (Object.keys(this.unMountedIds).length === 0) {
            if (this.onPageMountedEvents.length > 0) {
              for (const index in this.onPageMountedEvents) {
                this.onPageMountedEvents[index].fn()
              }
            }
          }
          // console.log('setVueRef() > 组件（' + componentId + '）已完成onMounted。', vueRef.refs)
        } else {
          // console.log('setVueRef() > 组件（' + componentId + '）未完成onMounted，当前的vueRef为空或vueRef.refs的对象为空。', vueRef.refs)
        }
      }
    }
  }

  removeVueInst(componentId: string) {
    if (componentId) {
      delete this.vueRefMap[componentId]
      delete this.componentInstMap[componentId]
    }
  }

  /**
   * 基于组件获取页面内的vue组件实例
   * @param componentId
   */
  getRef(componentId: string) {
    if (componentId) {
      // console.log('getRef() > vueRefMap:', this.vueRefMap)
      return this.vueRefMap[componentId]
    }
    return null
  }

  /**
   *  基于组件获取页面内的vue组件实例
   */
  getRefs(): { [key: string]: ComponentInternalInstance | null } {
    return this.vueRefMap
  }

  /**
   *  获取当前页面在下所有的组件配置实例
   */
  getInsts(): { [key: string]: ComponentInstance } {
    return this.componentInstMap
  }

  /**
   * 检查参数格式，看是否需要进行转换
   * @param params
   */
  isParamNeedConvert(params: Array<PageParamConfigType | Param>) {
    if (!params || (params && params.length === 0)) return false
    return Object.keys(params[0]).indexOf('pType') >= 0
  }

  paramStringify = paramStringify


  /**
   * 设置页面参数定义
   * @param paramsMeta
   */
  setParamsMeta(paramsMeta: Array<ParamMeta>) {
    this.pageParamsMeta = paramsMeta || []
  }

  /**
   *  获取页面参数定义
   */
  getParamsMeta(): Array<ParamMeta> {
    return this.pageParamsMeta
  }
  /**
   * 设置页面参数，这里设置的是已完成解析的，键值对，不是参数配置信息
   * @param params
   */
  setParams(params: Array<Param>) {
    this.pageParams = params || []
  }

  /**
   *  在动作面板中配置的页面参数，如recordId
   */
  getParams(): Array<Param> {
    return this.pageParams
  }

  /**
   *  获取页面参数中，带有开头信息的参数，形成参数数组
   *  如：prefix为form时，取的是form.xxx的参数，并形成一个对象返回
   */
  getParamsByPrefixAsArray(prefix: string) {
    if (!this.pageParams) return []
    const ary: Array<{ [key: string]: any }> = []
    this.pageParams.forEach((param) => {
      // const key:string = Object.keys(param)[0]
      if (param.name.startsWith(prefix + '.')) {
        ary.push({ [param.name.substring(prefix.length + 1)]: param.value })
      }
    })
    return ary
  }

  /**
   *  获取页面参数中，带有开头信息的参数，形成参数对象
   *  如：prefix为form时，取的是form.xxx的参数，并形成一个对象返回
   */
  getParamsByPrefixAsObject(prefix: string) {
    if (!this.pageParams) return {}
    const obj: { [key: string]: any } = {}
    this.pageParams.forEach((param) => {
      // console.log('param', param, toRaw(param))
      // const key = Object.keys(toRaw(param))[0]
      if (param.name.startsWith(prefix + '.')) {
        obj[param.name.substring(prefix.length + 1)] = param.value
      }
    })
    // console.log('pageParams',prefix,this.pageParams)
    return obj
  }

  /**
   *  获取在动作面板中配置的页面参数值
   */
  getParamValue(paramName: string) {
    const foundParam = this.pageParams?.find((param: Param) => {
      return param.name === paramName
    })
    return foundParam ? foundParam.value : null
  }

  /**
   * 是否存在参数
   * @param paramName
   */
  hasPageParam(paramName: string) {
    const foundParam = this.pageParams?.find((param: Param) => {
      return param.name === paramName
    })
    return !!foundParam
  }

  /**
   * 设置组件值glComponentInst.value
   * @param componentId
   * @param value
   */
  setComponentValue(componentId: string, value: any) {
    // console.log('setComponentValue', componentId, value, this.pageInst, this.vueRefMap)
    const vueRef = this.getRef(componentId)
    const proxy = vueRef?.proxy
    if (proxy) {
      // @ts-ignore
      proxy.glComponentInst.value = value
    }
    return proxy
  }

  /**
   * 获取组件实例信息glComponentInst
   * @param componentId
   */
  getComponentInst(componentId: string) {
    const vueRef = this.getRef(componentId)
    const proxy = vueRef?.proxy
    if (proxy) {
      // @ts-ignore
      return proxy.glComponentInst
    }
    return undefined
  }

  /**
   * 获取组件值glComponentInst.value
   * @param componentId
   */
  getComponentValue(componentId: string) {
    return this.getComponentInst(componentId)?.value
  }

  /**
   * 设置组件GlComponent的属性，即glComponentInst.props
   * @param componentId
   * @param props 按一个个的属性值进行设置
   */
  setComponentProps(componentId: string, props: { [key: string]: any }) {
    const vueRef = this.getRef(componentId)
    // console.log('setComponentProps() > vueRef:', vueRef, 'props:', props)
    // @ts-ignore
    const vueProps = vueRef?.props?.glComponentInst?.props
    if (vueProps) {
      Object.assign(vueProps, props)
      // vueRef?.exposed?._reRender()
      return vueProps
    }
    return null
  }

  /**
   * 获取组件属性
   * @param componentId
   */
  getComponentProps(componentId: string) {
    const vueRef = this.getRef(componentId)
    // @ts-ignore
    return vueRef?.props?.glComponentInst?.props
  }

  /**
   * 获取vue组件实例对外开放的方法
   * @param componentId
   * @param methodName
   */
  getMethod(componentId: string, methodName: string): Function | null {
    const vueRef = this.getRef(componentId)
    // @ts-ignore
    // console.log('PageProvideProxy > getMethod() > componentName:', vueRef?.props?.glComponentInst?.componentName, 'methodName:', methodName, 'componentId:', componentId, 'vueRef:', vueRef, 'pageProxy', this)
    // GlPage组件的exposed通过vueRef?.exposed 取得，其它的通过vueRef?.subTree?.component?.exposed取得
    let fn = vueRef?.subTree?.component?.exposed![methodName] || vueRef?.exposed![methodName]
    if (fn) {
      return fn
    }
    return null
  }

  setPageStatus(pageStatus: string) {
    this.pageStatus = pageStatus || 'read'
  }

  setPageCustom(pageCustom?: PageCustomType) {
    this.pageCustom = pageCustom
  }

  getPageCustom() {
    return this.pageCustom
  }

  setPagePermission(pagePermission?: PagePermission) {
    this.pagePermission = pagePermission
  }

  getPagePermission() {
    return this.pagePermission
  }

  isPageStatusRead() {
    return this.pageStatus === 'read'
  }

  isPageStatusCreate() {
    return this.pageStatus === 'create'
  }

  isPageStatusCopyCreate() {
    return this.pageStatus === 'copyCreate'
  }

  isPageStatusCreateOrCopyCreate() {
    return this.pageStatus === 'create' || this.pageStatus === 'copyCreate'
  }

  isPageStatusUpdate() {
    return this.pageStatus === 'update'
  }

  isPageStatusCreateOrUpdate() {
    return this.isPageStatusCreate() || this.isPageStatusUpdate()
  }
}
