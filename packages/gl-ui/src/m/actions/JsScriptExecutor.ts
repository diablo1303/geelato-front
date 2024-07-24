import type {App} from 'vue'
import {h} from 'vue'
import axios, {type CreateAxiosDefaults} from 'axios'
import type {Action} from '@geelato/gl-ui-schema'
import utils from '../utils/Utils'
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'
import type PageProvideProxy from '../../components/PageProvideProxy'
import type {Param} from '../types/global'
import {entityApi} from '../datasource/EntityApi'
import * as fileApi from '../datasource/FileApi'
import {getUserCompany} from '../datasource/SecurityApi'
import type {EntityReader, EntityReaderParam} from '../datasource/EntityDataSource'
import dayjs from 'dayjs'
import {useDateTimeFns} from './fns/datetime'
import {useMathFns} from './fns/math'

const pageProxyMap: { [key: string]: PageProvideProxy | undefined } = {}
type OptionsType = { [key: string]: any }

export class Ctx {
  pageProxy?: PageProvideProxy;

  [key: string]: any
}

/**
 *  获取系统api
 *  如获取用户信息等
 */
const sysApi = {
  getCompanyOfUser: getUserCompany
}

export class JsScriptExecutor {
  app: App | undefined

  pageIds: string[] = []
  $gl = {}

  constructor() {
  }

  /**
   * 设置整个vue的应用信息，一般在组件库插件初始化时调用
   * @param app
   */
  setApp(app: App) {
    this.app = app
  }

  /**
   * 设置当前执行页面的代理对象
   * 一般在执行页面中调用该方法
   * 支持多页面嵌套场景，每个页面是一个pageProxy，以pageComponentId进行标识区分
   * @param pageComponentId 组件名为GlPage的组件id
   * @param pageProxy
   */
  addPageProxy(pageComponentId: string, pageProxy: PageProvideProxy) {
    pageProxyMap[pageComponentId] = pageProxy
    this.pageIds.push(pageComponentId)
    // console.log('addPageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
  }

  getPageProxy(pageComponentId: string) {
    // console.log('getPageProxy() > pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
    return pageProxyMap[pageComponentId]
  }

  /**
   * 删除当前执行页面的代理对象
   * 一般在页面关闭时执行
   * @param pageComponentId 组件名为GlPage的组件id
   */
  removePageProxy(pageComponentId: string) {
    delete pageProxyMap[pageComponentId]
    const ids = this.pageIds
    if (ids && ids.length > 0) {
      this.pageIds.forEach((id, index) => {
        if (id === pageComponentId) {
          ids.splice(index, 1)
        }
      })
    }
    // console.log('removePageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap, ids)
  }

  /**
   * 获取组件名称
   * @param componentId
   */
  getComponentName(componentId: string) {
    return this.getComponentInst(componentId)?.componentName
  }

  /**
   * 获取组件的方法
   * 先从真实的组件中获取方法，获取不到，则从包装的组件GlComponent中获取公共方法
   * @param componentId
   * @param methodName
   */
  getComponentMethod(componentId: string, methodName: string) {
    // console.log('getComponentMethod() > pageProxyMap:', pageProxyMap)
    const ref = this.getRef(componentId)
    // 对于GlPage，ref?.exposed[methodName]
    // 对于一般的组件ref?.exposed取的是GlComponent上的公共方法
    let exposed = ref?.subTree?.component?.exposed
    let fn
    if (exposed) {
      fn = exposed[methodName]
    }
    if (fn) {
      return fn
    }
    // 如果在具体组件中都找不到方法时，从包装的组件GlComponent上的公共方法上获取
    if (ref?.exposed) {
      fn = ref?.exposed[methodName]
    }
    if (fn) {
      return fn
    }
    console.warn(`获到不到组件(${componentId})的方法(${methodName})，该组件vue实例为：`, ref)
    return null
  }

  /**
   * 设置组件属性
   * @param componentId
   * @param props
   */
  setComponentProps(componentId: string, props: { [key: string]: any }) {
    if (componentId && props && typeof props === 'object' && Object.keys(props).length > 0) {
      for (const pageComponentId in pageProxyMap) {
        const pageProxy = pageProxyMap[pageComponentId]
        if (pageProxy) {
          pageProxy.setComponentProps(componentId, props)
        }
      }
    }
  }

  /**
   * 获取组件属性
   * @param componentId
   */
  getComponentProps(componentId: string) {
    // for (const pageComponentId in pageProxyMap) {
    //     const pageProxy = pageProxyMap[pageComponentId]
    //     if (pageProxy) {
    //         const ref = pageProxy.getRef(componentId)
    //         if (ref) {
    //             // @ts-ignore
    //             return ref?.props?.glComponentInst?.props
    //         }
    //         continue
    //     }
    // }
    return this.getComponentInst(componentId)?.props
  }

  /**
   * 获取页面的参数
   * @param pageComponentId
   */
  getParams(pageComponentId: string) {
    const pageProxy = pageProxyMap[pageComponentId]
    if (pageProxy) {
      return pageProxy.getParams()
    }
    return null
  }

  /**
   * 获取当前页面所有的参数
   */
  getPageParams($gl: any) {
    const pageProxy: PageProvideProxy = $gl.ctx.pageProxy
    if (pageProxy) {
      return pageProxy.getParams()
    }
    console.error('在获取页面参数值时，获取不到当前页面信息。')
    return null
  }

  /**
   * 获取当前页面的参数
   * @param paramName
   * @param $gl
   */
  getPageParam(paramName: string, $gl: any) {
    const pageProxy: PageProvideProxy = $gl.ctx.pageProxy
    if (pageProxy) {
      return pageProxy.getParamValue(paramName)
    }
    console.error(
      '在获取页面参数（' +
      paramName +
      '）的值时，获取不到当前页面代理对象（pageProxy）,返回参数值null'
    )
    return null
  }

  /**
   * 是否存在参数
   * @param paramName
   * @param $gl
   */
  hasPageParam(paramName: string, $gl: any) {
    const pageProxy: PageProvideProxy = $gl.ctx.pageProxy
    if (pageProxy) {
      return pageProxy.hasPageParam(paramName)
    }
    console.error(
      '在获取页面参数（' +
      paramName +
      '）的值时，获取不到当前页面代理对象（pageProxy）,返回参数值false'
    )
    return false
  }

  /**
   * 触发组件的动作事件
   * @param componentId
   * @param actionName 动名名（注意，非事件名eventName，一个事件可以触发多个动作）
   * @param ctx
   * @param callback
   */
  triggerComponentAction(componentId: string, actionName: string, ctx?: {}, callback?: Function) {
    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        const ref = pageProxy.getRef(componentId)
        // console.log('triggerComponentAction() > componentId:', componentId, 'ref:', ref, 'pageProxy:', pageProxy)
        if (ref) {
          // @ts-ignore
          const actions = ref?.props?.glComponentInst?.actions
          for (const actionsKey in actions) {
            const action = actions[actionsKey]
            // 按actionName进行触发
            if (action.name === actionName) {
              return jsScriptExecutor.doAction(action, (ctx = {pageProxy}), callback)
            }
          }
        }
      }
    }
  }

  /**
   * 获取组件值
   * @param componentId
   */
  getComponentValue(componentId: string) {
    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        const ref = pageProxy.getRef(componentId)
        if (ref) {
          return pageProxy.getComponentValue(componentId)
        }
      }
    }
    return undefined
  }

  private getVarsConvertFns($gl: any) {
    const that = this
    return {
      convertEntityReader: (entityReader: EntityReader, gl?: any) => {
        return that.convertEntityReader(entityReader, gl || $gl)
      }
    }
  }

  private getFeedbackFns($gl: any) {
    return {
      notification: $gl.$notification,
      message: $gl.$message,
      confirm: $gl.$modal.confirm
    }
  }

  private getOtherFns($gl: any) {
    return {
      log(options: OptionsType) {
        // console.log(that.evalOptions(options, $gl?.ctx, ['content']).content)
        console.log(options)
      },
      createAxios: (
        config: CreateAxiosDefaults<any> | undefined,
        params: { widthDefaultHeader: boolean }
      ) => {
        const headers = {}
        params?.widthDefaultHeader ? Object.assign(headers, entityApi.getHeader()) : null
        Object.assign(headers, config?.headers)
        let cfg = config || {}
        cfg.headers = headers
        return axios.create(cfg)
      }
    }
  }

  private getLogicFns($gl: any) {
    const that = this
    return {
      if: (expression: string, trueValue: any, falseValue: any) => {
        return that.evalExpression(expression, $gl?.ctx, undefined, $gl) ? trueValue : falseValue
      },
      isPageParamEquals: (paramName: string, value: any) => {
        // console.log('isPageParamEquals', paramName, value, that.getPageParam(paramName, $gl))
        return that.getPageParam(paramName, $gl) === value
      }
    }
  }

  private getComponentFns($gl: any) {
    const that = this
    return {
      openModal: (options: OptionsType) => {
        return $gl.$modal.open(options)
      },
      openDrawer: (options: OptionsType) => {
        // options.header = h('div', ['xxxxxxx']);
        // console.log('options',options)
        // return $gl.$drawer.open(that.evalOptions(options, $gl.ctx, ['title', 'width', 'okText', 'cancelText']))
        return $gl.$drawer.open(options)
      },
      openWin: (url: string, urlParams: Array<Param>, gl?: any) => {
        const parsedParams = that.evalParams(urlParams, (gl || $gl).ctx, gl || $gl) || []
        const paramsAry: Array<string> = []
        parsedParams.forEach((param) => {
          paramsAry.push(`${param.name}=${param.value}`)
        })
        window.open(`${url}?${paramsAry.join('&')}`, '_blank')
      },
      loadPage: (
        pageId: string,
        extendId: string,
        params: Array<Param>,
        pageStatus: string,
        pageTemplateName?: string,
        pageTemplateProps?: Record<string, any>,
        gl?: any
      ) => {
        let _gl = gl
        let _pageTemplateProps = pageTemplateProps
        // 兼容旧的api，第6个为gl，无pageTemplateProps的情况
        if (pageTemplateProps && !gl) {
          // 是否pageTemplateProps为gl
          if (
            pageTemplateProps.entityApi &&
            pageTemplateProps.fn &&
            pageTemplateProps.insts &&
            pageTemplateProps.fileApi
          ) {
            // 兼容旧的api，此场景pageTemplateProps实为gl
            _gl = pageTemplateProps
            _pageTemplateProps = undefined
          }
        }

        return that.loadPage(
          pageId,
          extendId,
          that.evalParams(params, (_gl || $gl).ctx, _gl || $gl) || [],
          pageStatus,
          pageTemplateName,
          that.evalProps(_pageTemplateProps || {}, (_gl || $gl).ctx, _gl || $gl) || []
        )
      },
      loadComponent: (componentName: string, props: Record<string, any>) => {
        return that.loadComponent(componentName, props)
      },
      /**
       * 调用组件方法
       * @param componentId
       * @param methodName
       * @param gl 方法在open窗口中执行时，需要传入gl，否则方法体内的$gl会指向新窗口中的$gl对象，和$gl.fn.invokeComponentMethod中的$gl不一致
       * @param params
       */
      invokeComponentMethod: (
        componentId: string,
        methodName: string,
        params: Array<Param>,
        gl?: any
      ) => {
        const method = this.getComponentMethod(componentId, methodName)
        if (method) {
          // console.log('invokeComponentMethod['+methodName+'] > gl',gl)
          return method(
            that.convertParamsToObject(that.evalParams(params, (gl || $gl).ctx, gl || $gl))
          )
        }
        // else {
        //     console.error('调用组件方法失败，找到不方法。componentId:', componentId, 'methodName:', methodName)
        // }
        return false
      },
      /**
       * 键值文本转换
       * @param keys key1,key2,key3... 或为[key1,key2,key3...]或为key1或为表达式
       * @param keyValues
       */
      keyValue(
        keys: string | Array<string>,
        keyValues: {
          [key: string]:
            | {
            en?: [string | number | boolean]
            cn: [string | number | boolean]
          }
            | [string | number | boolean]
        }
      ) {
        if (!keyValues || !keys) return keys
        // keys
        let keyAry = []
        // console.log('typeof keys:', typeof keys, keys)
        if (Array.isArray(keys)) {
          keyAry = keys
        } else {
          // 表达式
          // if (keys.indexOf('$gl.') >= 0) {
          //     // @ts-ignore
          //     that.evalExpression(keys, $gl.ctx)
          // }
          // 连接字段串
          // @ts-ignore
          keyAry = keys.split(',')
        }
        const valueAry: any[] = []
        for (const index in keyAry) {
          const key = keyAry[index]
          const value: any = keyValues[key]
          // console.log('key',key,'value',value,'keyValues',keyValues)
          if (typeof value === 'object' && (value.cn || value.en)) {
            // TODO 待结合环境获取当前语言
            valueAry.push(value.cn || value.en)
          } else {
            valueAry.push(value)
          }
        }
        return valueAry.join(',') || keys
      },
      getPageParams: (gl?: any) => that.getPageParams(gl || $gl),
      getPageParam: (paramName: string, gl?: any) => that.getPageParam(paramName, gl || $gl),
      hasPageParam: (paramName: string, gl?: any) => that.hasPageParam(paramName, gl || $gl),
      isPageStatusRead: () => {
        return $gl.ctx.pageProxy.isPageStatusRead()
      },
      isPageStatusCreate: () => {
        return $gl.ctx.pageProxy.isPageStatusCreate()
      },
      isPageStatusCopyCreate: () => {
        return $gl.ctx.pageProxy.isPageStatusCopyCreate()
      },
      isPageStatusCreateOrCopyCreate: () => {
        return $gl.ctx.pageProxy.isPageStatusCreateOrCopyCreate()
      },
      isPageStatusUpdate: () => {
        return $gl.ctx.pageProxy.isPageStatusUpdate()
      },
      getComponentMethod: that.getComponentMethod,
      getComponentValue: that.getComponentValue,
      setComponentValue: that.setComponentValue,
      getComponentProps: that.getComponentProps,
      setComponentProps: that.setComponentProps,
      triggerComponentAction: that.triggerComponentAction
    }
  }

  /**
   * 获取组件值
   * @param componentId
   * @param value
   */
  setComponentValue(componentId: string, value: any) {
    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        const ref = pageProxy.getRef(componentId)
        if (ref) {
          // console.log('$gl.fn.setComponentValue', componentId, value)
          return pageProxy.setComponentValue(componentId, value)
        }
      }
    }
    return undefined
  }

  /**
   * 点击等事件
   * @param action 组件中的事件配置信息
   * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
   * @param callback
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   */
  doAction(action: Action, ctx: Ctx, callback?: Function, gl?: any): Promise<any> {
    // console.log('JsScriptExecutor > doAction(),action:', action, 'ctx:', ctx)
    return this.evalFn(action.body!, ctx, callback, gl, true)
  }

  // executeFn(bodyScript: string, ctx: object, callback?: Function) {
  //     return this.executeScript(bodyScript, ctx, callback, true)
  // }

  /**
   * 执行表达式
   * @param expression 脚本信息，方法体
   * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
   * @param callback
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   */
  evalExpression(expression: string, ctx: Ctx, callback?: Function, gl?: any) {
    // console.log('evalExpression',expression,'gl',gl)
    const $gl = gl || this.getGl(ctx?.pageProxy)
    Object.assign($gl.ctx, ctx)
    const result = utils.evalExpression(expression, $gl)
    if (callback && typeof callback === 'function') {
      callback()
    }
    return result
  }

  /**
   * 执行函数
   * @param fnBodyScript 脚本信息，方法体
   * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
   * @param callback
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   * @param async 对于fnBody里有wait的场景，可以设置async为true
   */
  evalFn(fnBodyScript: string, ctx: Ctx, callback?: Function, gl?: any, async?: boolean) {
    // console.log('evalFn',fnBodyScript,'gl',gl)
    const $gl = gl || this.getGl(ctx?.pageProxy)
    Object.assign($gl.ctx, ctx)
    const result = utils.evalFn(fnBodyScript, $gl, '$gl', async)
    if (callback && typeof callback === 'function') {
      callback()
    }
    // console.log('result', result)
    return result
  }

  /**
   * 执行参数，valueExpression值优先，将参数中的valueExpression值表达式计算结果保存到value中
   * @param params
   * @param ctx
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   */
  evalParams(params: Array<Param>, ctx: Ctx, gl?: any) {
    const newParams: Array<Param> = []
    if (params && params.length > 0) {
      for (const index in params) {
        const param: Param = params[index]
        // console.log('param.value:', param.value,'param.valueExpression',param.valueExpression)
        // param.value未设置，且valueExpression有值时
        if (param.valueExpression) {
          if (typeof param.valueExpression === 'string') {
            // console.log('param.valueExpression:', param.valueExpression, gl,param)
            param.value = this.evalExpression(param.valueExpression, ctx, undefined, gl)
          } else {
            // valueExpression 为不带引号的值，相当于表达式已完成求值
            param.value = param.valueExpression
          }
        }
        newParams.push({
          name: param.name,
          value: param.value,
          valueExpression: ''
        })
      }
    }
    // console.log('evalParams params:', params, 'ctx:', ctx, 'newParams:', newParams)
    return newParams
  }

  /**
   * 打开页面模板时，可动态设置模板的属性
   * @param props 示例如下：
   *        {
   *             "label": "订单调账申请流程",
   *             "procInstId": "1044706817799999999",
   *             "procDefId": "5044706817716916224",
   *             "_propsExpressions": {
   *                 "bizId": "$gl.ctx.record.id"
   *             }
   *         }
   * @param ctx
   * @param gl
   * @return Record 输出结果示例：
   *         {
   *             "label": "订单调账申请流程",
   *             "procInstId": "1044706817799999999",
   *             "procDefId": "5044706817716916224",
   *             “bizId”:"1231968177169162131",
   *             "_propsExpressions": {
   *                 "bizId": "$gl.ctx.record.id"
   *             }
   *         }
   */

  evalProps(props: Record<string, any>, ctx: Ctx, gl?: any) {
    if (props && typeof props._propsExpressions === 'object') {
      for (const key in props._propsExpressions) {
        const valueExpression = props._propsExpressions[key]
        console.log('key:', key, 'valueExpression', valueExpression)
        // param.value未设置，且valueExpression有值时
        if (typeof valueExpression === 'string') {
          // console.log('param.valueExpression:', param.valueExpression, gl,param)
          props[key] = this.evalExpression(valueExpression, ctx, undefined, gl)
        } else {
          // valueExpression 为不带引号的值，相当于表达式已完成求值
          props[key] = valueExpression
        }
      }
    }
    // console.log('evalProps ctx:', ctx, 'newProps:', props)
    return props
  }

  /**
   * 数组参数格式转成对象参数格式
   * 注意参数名不要重复
   * @param params
   */
  convertParamsToObject(params: Array<Param>) {
    const result: Record<string, any> = {}
    params.forEach((param) => {
      result[param.name] = param.value
    })
    // console.log('convertParamsToObject:',params,result)
    return result
  }

  /**
   *
   * @param items
   * @param ctx {pageProxy,...} 上下文中需要传输pageProxy
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   */
  evalValueExpressions(
    items: Array<{
      value?: any
      valueExpression?: string
      [key: string]: any
    }>,
    ctx: Ctx,
    gl?: any
  ) {
    if (items && items.length > 0) {
      for (const index in items) {
        const item = items[index]
        if (item.valueExpression) {
          item.value = this.evalExpression(item.valueExpression, ctx, undefined, gl)
        }
      }
    }
    return items
  }

  /**
   * 转换选项中的表达式
   * @param options
   * @param ctx
   * @param evalKeys 指定需要转换值的选项keys，如：['title', 'content']
   * @param gl 如果多个表达式需要用同一下$gl时，可以传进来，不在本方法内创建
   */
  evalOptions(options: OptionsType, ctx: Ctx, evalKeys: string[], gl?: any): OptionsType {
    const newOptions = JSON.parse(JSON.stringify(options))
    evalKeys.forEach((key) => {
      newOptions[key] = this.evalExpression(newOptions[key], ctx, undefined, gl)
    })
    return newOptions
  }

  /**
   * entityReader 的参数存在变量的情况，需要先进行转换
   * @param entityReader
   */
  convertEntityReader(entityReader: EntityReader, $gl: any): EntityReader {
    const that = this
    entityReader.params.forEach((param: EntityReaderParam) => {
      if (param.valueExpression) {
        param.value = that.evalExpression(param.valueExpression, {}, undefined, $gl)
      }
    })
    return entityReader
  }

  /**
   * 从多个pageProxy中获取ref
   * @param componentId
   */
  getRef(componentId: string) {
    if (componentId) {
      for (const pageComponentId in pageProxyMap) {
        const pageProxy = pageProxyMap[pageComponentId]
        if (pageProxy) {
          const ref = pageProxy.getRef(componentId)
          if (ref) {
            return ref
          }
        }
      }
      console.warn(
        `通过组件Id(${componentId})获取不到组件vue实例，很可能是因为此时该组件vue实例还未创建完成。`
      )
    } else {
      console.warn(`组件Id为空(${componentId})，获取不到组件vue实例。`)
    }
    return null
  }

  /**
   *  获取组件实例信息
   *  提供两种组织方式，inst和insts，对于inst,key为组件id，对于insts的key为页面id
   */
  getRefs(): { ref: object; refs: object } {
    const ref: { [key: string]: any } = {}
    const refs: { [key: string]: any } = {}
    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        // console.log('pageProxy.getRefs():', pageProxy.getRefs())
        for (const refKey in pageProxy.getRefs()) {
          // 单页面模式，只留第一次出现的组件
          if (ref[refKey]) {
            // 如果已存在相同的组件id，应是页面引用了多个相同的页面，进行了页面嵌套
            // TODO
          } else {
            ref[refKey] = pageProxy.getRefs()[refKey]
          }
          // 多页面并存
          if (!refs[pageComponentId]) refs[pageComponentId] = {}
          refs[pageComponentId][refKey] = pageProxy.getRefs()[refKey]
        }
      }
    }
    return {ref, refs}
  }

  /**
   * 获取组件配置实例信息
   * @param componentId
   */
  getComponentInst(componentId: string) {
    if (componentId) {
      // console.log('pageProxyMap:', pageProxyMap)
      for (const pageComponentId in pageProxyMap) {
        const pageProxy = pageProxyMap[pageComponentId]
        if (pageProxy) {
          const inst = pageProxy.getComponentInst(componentId)
          // console.log('getComponentInst() by componentId:', componentId, 'get', inst)
          if (inst) {
            return inst
          }
        }
      }
    }
    console.warn(
      `通过组件Id(${componentId})获取不到ComponentInstance，很可能是因为此时该组件实例还未创建完成。`
    )
    return null
  }

  /**
   *  获取组件实例信息
   *  提供两种组织方式，inst和insts，对于inst,key为组件id，对于insts的key为页面id
   */
  getComponentInsts(): { inst: Record<string, any>; insts: Record<string, any> } {
    const inst: { [key: string]: any } = {}
    const insts: { [key: string]: any } = {}
    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        // console.log('pageProxy.getInsts():', pageProxy.getInsts())
        for (const instKey in pageProxy.getInsts()) {
          // 单页面模式，只留第一次出现的组件
          if (inst[instKey]) {
            // 如果已存在相同的组件id，应是页面引用了多个相同的页面，进行了页面嵌套
            // TODO
          } else {
            inst[instKey] = pageProxy.getInsts()[instKey]
          }
          // 多页面并存
          if (!insts[pageComponentId]) insts[pageComponentId] = {}
          insts[pageComponentId][instKey] = pageProxy.getInsts()[instKey]
        }
      }
    }
    // console.log('{inst, insts}', {inst, insts})
    return {inst, insts}
  }

  /**
   * 获取当前环境下，可执行的方法、全局变量
   *
   */
  public getGl(pageProxy?: PageProvideProxy) {
    const $gl = {
      id: utils.gid('id'),
      // TODO 去掉这种写法（jsEngine: this），需检查是否有引用
      // jsEngine: this,
      // getComponentValue: this.getComponentValue,
      // setComponentValue: this.setComponentValue,
      // getComponentProps: this.getComponentProps,
      // setComponentProps: this.setComponentProps,
      // triggerComponentAction: this.triggerComponentAction,
      ...this.app?.config.globalProperties,
      // $gl的环境变量全提到一级属性，如$gl.user、$gl.sys
      ...this.app?.config.globalProperties.$gl,
      page: {},
      inst: <{ [key: string]: any }>{},
      ref: <{ [key: string]: any }>{},
      // 多页面嵌套场景
      insts: <{ [key: string]: any }>{},
      refs: <{ [key: string]: any }>{},
      ctx: {record: {}},
      fn: utils,
      entityApi,
      fileApi,
      sysApi,
      // todo,date待转成具体的方法合到fn中
      date: dayjs,
      // 当前执行方法的变量
      vars: {}
    }
    // set datetime fns
    Object.assign($gl.fn, useDateTimeFns())
    // set math fns
    Object.assign($gl.fn, useMathFns())
    // set logic fns
    Object.assign($gl.fn, this.getLogicFns($gl))
    // set components fns
    Object.assign($gl.fn, this.getComponentFns($gl))
    // set vars convert fns
    Object.assign($gl.fn, this.getVarsConvertFns($gl))
    // set feedback fns
    Object.assign($gl.fn, this.getFeedbackFns($gl))
    // set other fns
    Object.assign($gl.fn, this.getOtherFns($gl))
    // set page
    $gl.page = {
      id: pageProxy?.pageInst.id,
      label: pageProxy?.pageInst.title,
      status: pageProxy?.pageStatus,
      template: pageProxy?.pageTemplate,
      templateName: pageProxy?.pageTemplateName,
      params: pageProxy?.pageInst.props.params
    }

    for (const pageComponentId in pageProxyMap) {
      const pageProxy = pageProxyMap[pageComponentId]
      if (pageProxy) {
        // console.log('set refs and insts to $gl,pageProxy:', pageProxy.id, '$gl.id:', $gl.id, pageProxy.getInsts(), pageProxy.getRefs())
        for (const instKey in pageProxy.getInsts()) {
          // 单页面模式，只留第一次出现的组件
          if ($gl.inst[instKey]) {
            // 如果已存在相同的组件id，应是页面引用了多个相同的页面，进行了页面嵌套
            // TODO
          } else {
            $gl.inst[instKey] = pageProxy.getInsts()[instKey]
            // console.log('instKey', instKey, $gl.inst[instKey])
            // !!!注意组件的子组件未加载时，refs可能为空{}
            $gl.ref[instKey] = pageProxy.getRef(instKey)!.refs[instKey]
            // console.log('instKey', instKey, $gl.ref[instKey],Object.keys(pageProxy.getRef(instKey)?.refs!))
          }
          // 多页面并存
          if (!$gl.insts[pageComponentId]) {
            $gl.insts[pageComponentId] = {}
            $gl.refs[pageComponentId] = {}
          }
          $gl.insts[pageComponentId][instKey] = pageProxy.getInsts()[instKey]
          $gl.refs[pageComponentId][instKey] = pageProxy.getRef(instKey)?.refs[instKey]
        }
      }
    }
    // console.log('getGl',$gl.id)
    return $gl
  }

  /**
   * 加载页面
   * @param pageId   页面ID
   * @param extendId 应用页面树节点ID
   * @param params
   * @param pageStatus 页面状态
   * @param pageTemplateName
   * @param pageTemplateProps
   */
  loadPage(
    pageId: string,
    extendId: string,
    params: Array<Param>,
    pageStatus?: string,
    pageTemplateName?: string,
    pageTemplateProps?: object
  ) {
    const pageProps = {params: params, pageTemplateProps: pageTemplateProps}
    // console.log(
    //   'JsScriptExecutor > loadPage > pageId:',
    //   pageId,
    //   ',extendId:',
    //   extendId,
    //   ',pageStatus:',
    //   pageStatus,
    //   ',pageProps:',
    //   pageProps,
    //   'pageTemplateName',
    //   pageTemplateName
    // )
    return h(GlPageViewer, {pageId, extendId, pageStatus, pageTemplateName, pageProps})
  }

  /**
   *  加载全局注册的组件
   */
  loadComponent(componentName: string, props: Record<string, any>) {
    const component = this.app!.component(componentName)
    return h(component!, props)
  }
}

const jsScriptExecutor = new JsScriptExecutor()
export default jsScriptExecutor
