import type {App} from "vue";
import {h} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import utils from "../utils/Utils";
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'
import type PageProvideProxy from "../../components/PageProvideProxy";
import type {Param} from "../types/global";

const pageProxyMap: { [key: string]: PageProvideProxy | undefined } = {}
type OptionsType = { [key: string]: any }

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

    /**
     * 删除当前执行页面的代理对象
     * 一般在页面关闭时执行
     * @param pageComponentId 组件名为GlPage的组件id
     */
    removePageProxy(pageComponentId: string) {
        delete pageProxyMap[pageComponentId]
        let ids = this.pageIds
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
        return null
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
     * @param componentId
     * @param methodName
     */
    getComponentMethod(componentId: string, methodName: string) {
        if (componentId) {
            for (const pageComponentId in pageProxyMap) {
                const pageProxy = pageProxyMap[pageComponentId]
                if (pageProxy) {
                    const method = pageProxy.getMethod(componentId, methodName)
                    if (method) {
                        return method
                    }
                }
            }
        }
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
        for (const pageComponentId in pageProxyMap) {
            const pageProxy = pageProxyMap[pageComponentId]
            if (pageProxy) {
                const vueInst = pageProxy.getVueInst(componentId)
                if (vueInst) {
                    // @ts-ignore
                    return vueInst?.props?.glComponentInst?.props
                }
                continue
            }
        }
        return undefined
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
        console.error('在获取页面参数值时，获取不到当前页面信息。')
        return null
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
                const vueInst = pageProxy.getVueInst(componentId)
                // console.log('triggerComponentAction() > componentId:', componentId, 'vueInst:', vueInst, 'pageProxy:', pageProxy)
                if (vueInst) {
                    // @ts-ignore
                    const actions = vueInst?.props?.glComponentInst?.actions
                    if (actions) {
                        for (const actionsKey in actions) {
                            const action = actions[actionsKey]
                            // 按actionName进行触发
                            if (action.name === actionName) {
                                jsScriptExecutor.doAction(action, ctx = {pageProxy}, callback)
                            }
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
                const vueInst = pageProxy.getVueInst(componentId)
                if (vueInst) {
                    return pageProxy.getComponentValue(componentId)
                }
            }
        }
        return undefined
    }

    private getFeedbackFns($gl: any) {
        let that = this
        return {
            notification: $gl.$notification,
            confirm: $gl.$modal.open
        }
    }

    private getOtherFns($gl: any) {
        let that = this
        return {
            log(options: OptionsType) {
                // console.log(that.evalOptions(options, $gl?.ctx, ['content']).content)
                console.log(options)
            }
        }
    }

    private getLogicFns($gl: any) {
        let that = this
        return {
            if: (expression: string, trueValue: any, falseValue: any) => {
                return that.evalExpression(expression, $gl?.ctx) ? trueValue : falseValue
            },
            isPageParamEquals: (paramName: string, value: any) => {
                console.log('isPageParamEquals', paramName, value, that.getPageParam(paramName, $gl))
                return that.getPageParam(paramName, $gl) === value
            }
        }
    }

    private getComponentFns($gl: any) {
        let that = this
        return {
            openModal: (options: OptionsType) => {
                return $gl.$modal.open(options)
            },
            openDrawer: (options: OptionsType) => {
                // return $gl.$drawer.open(that.evalOptions(options, $gl.ctx, ['title', 'width', 'okText', 'cancelText']))
                return $gl.$drawer.open(options)
            },
            openWin: (url: string, urlParams: Array<Param>) => {
                const paramsAry: Array<string> = []
                urlParams.forEach((param) => {
                    if (param.valueExpression) {
                        paramsAry.push(`${param.name}=${that.evalExpression(param.valueExpression, $gl?.ctx)}`)
                    } else {
                        paramsAry.push(`${param.name}=${param.value}`)
                    }
                })
                window.open(`${url}?${paramsAry.join('&')}`, '_blank')
            },
            loadPage: (pageId: string, extendId: string, params: Array<Param>, pageStatus: string) => {
                return that.loadPage(pageId, extendId, that.evalParams(params, $gl.ctx) || [], pageStatus)
            },
            /**
             * 调用组件方法
             * @param componentId
             * @param methodName
             * @param params
             */
            invokeComponentMethod: (componentId: string, methodName: string, params: Array<Param>) => {
                const method = this.getComponentMethod(componentId, methodName)
                if (method) {
                    return method(that.evalParams(params, $gl.ctx))
                }
                return false
            },
            /**
             * 键值文本转换
             * @param keys key1,key2,key3... 或为[key1,key2,key3...]或为key1或为表达式
             * @param keyValues
             */
            keyValue(keys: string | Array<any>, keyValues: {
                [key: string]: {
                    en?: [string | number | boolean],
                    cn: [string | number | boolean]
                } | [string | number | boolean]
            }) {
                if (!keyValues || !keys) return keys
                // keys
                let keyAry = []
                // console.log('typeof keys:', typeof keys, keys)
                if (typeof keys === 'object' && keys.length >= 0) {
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
                    if (typeof value === 'object' && (value.cn || value.en)) {
                        // TODO 待结合环境获取当前语言
                        valueAry.push(value.cn || value.en)
                    } else {
                        valueAry.push(value)
                    }
                }
                return valueAry.join(',') || keys
            },
            // evalExpression: (expression: string) => {
            //     return that.evalExpression(expression, $gl.ctx)
            // },
            // evalFn: (expression: string, ctx: { pageProxy?: PageProvideProxy, [key: string]: any }, callback?: Function) => {
            //     return that.evalFn(expression, ctx, callback)
            // },
            getPageParams: () => that.getPageParams($gl),
            getPageParam: (paramName: string) => that.getPageParam(paramName, $gl),
            getComponentMethod: that.getComponentMethod,
            getComponentValue: that.getComponentValue,
            setComponentValue: (componentId: string, valueExpression: any) => {
                return that.setComponentValue(componentId, that.evalExpression(valueExpression, $gl.ctx))
            },
            getComponentProps: that.getComponentProps,
            setComponentProps: that.setComponentProps,
            triggerComponentAction: that.triggerComponentAction,
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
                const vueInst = pageProxy.getVueInst(componentId)
                if (vueInst) {
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
     */
    doAction(action: Action, ctx: object, callback?: Function) {
        // console.log('JsScriptExecutor > doAction(),action:', action, 'ctx:', ctx)
        return this.evalFn(action.body!, ctx, callback)
    }

    // executeFn(bodyScript: string, ctx: object, callback?: Function) {
    //     return this.executeScript(bodyScript, ctx, callback, true)
    // }

    /**
     * 执行表达式
     * @param expression 脚本信息，方法体
     * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
     * @param callback
     */
    evalExpression(expression: string, ctx: { pageProxy?: PageProvideProxy, [key: string]: any }, callback?: Function) {
        const $gl = this.getGl(ctx?.pageProxy)
        Object.assign($gl.ctx, ctx)
        let result = utils.evalExpression(expression, $gl)
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
     */
    evalFn(fnBodyScript: string, ctx: { pageProxy?: PageProvideProxy, [key: string]: any }, callback?: Function) {
        const $gl = this.getGl(ctx?.pageProxy)
        Object.assign($gl.ctx, ctx)
        // console.log('$gl.ctx', $gl.ctx)
        let result = utils.evalFn(fnBodyScript, $gl)
        if (callback && typeof callback === 'function') {
            callback()
        }
        return result
    }


    /**
     * 执行参数，将参数中的valueExpression值表达式计算结果保存到value中
     * @param params
     * @param ctx
     */
    evalParams(params: Array<Param>, ctx: object) {

        const newParams: Array<Param> = []
        if (params && params.length > 0) {
            for (const index in params) {
                const param: Param = params[index]
                // console.log('param.value:', param.value)
                // param.value未设置，且valueExpression有值时
                if (param.valueExpression && !param.value) {
                    param.value = this.evalExpression(param.valueExpression, ctx)
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
     * 转换选项中的表达式
     * @param options
     * @param ctx
     * @param evalKeys 指定需要转换值的选项keys，如：['title', 'content']
     */
    evalOptions(options: OptionsType, ctx: object, evalKeys: string[]): OptionsType {
        const newOptions = JSON.parse(JSON.stringify(options))
        evalKeys.forEach((key) => {
            newOptions[key] = this.evalExpression(newOptions[key], ctx)
        })
        return newOptions
    }

    /**
     *  获取组件实例信息
     *  提供两种组织方式，inst和insts，对于inst,key为组件id，对于insts的key为页面id
     */
    getComponentInsts(): { inst: object, insts: object } {
        const inst: { [key: string]: any } = {}
        const insts: { [key: string]: any } = {}
        for (const pageComponentId in pageProxyMap) {
            const pageProxy = pageProxyMap[pageComponentId]
            if (pageProxy) {
                // console.log('pageProxy.getInsts():', pageProxy.getInsts())
                for (let instKey in pageProxy.getInsts()) {
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
     * @private
     */
    private getGl(pageProxy: PageProvideProxy | undefined) {
        let $gl = {
            jsEngine: this,
            getComponentValue: this.getComponentValue,
            setComponentValue: this.setComponentValue,
            getComponentProps: this.getComponentProps,
            setComponentProps: this.setComponentProps,
            triggerComponentAction: this.triggerComponentAction,
            ...this.app?.config.globalProperties,
            page: {},
            inst: <{ [key: string]: any }>{},
            vueInst: <{ [key: string]: any }>{},
            // 多页面嵌套场景
            insts: <{ [key: string]: any }>{},
            vueInsts: <{ [key: string]: any }>{},
            ctx: {},
            fn: utils
        }
        // set logic fns
        Object.assign($gl.fn, this.getLogicFns($gl))
        // set components fns
        Object.assign($gl.fn, this.getComponentFns($gl))
        // set feedback fns
        Object.assign($gl.fn, this.getFeedbackFns($gl))
        // set other fns
        Object.assign($gl.fn, this.getOtherFns($gl))
        // set page
        $gl.page = {
            id: pageProxy?.pageInst.id,
            label: pageProxy?.pageInst.title,
            status: pageProxy?.pageStatus,
            params: pageProxy?.pageInst.props.params
        }

        for (const pageComponentId in pageProxyMap) {
            const pageProxy = pageProxyMap[pageComponentId]
            if (pageProxy) {
                // console.log('pageProxy.getInsts():', pageProxy.getInsts())
                for (let instKey in pageProxy.getInsts()) {
                    // 单页面模式，只留第一次出现的组件
                    if ($gl.inst[instKey]) {
                        // 如果已存在相同的组件id，应是页面引用了多个相同的页面，进行了页面嵌套
                        // TODO
                    } else {
                        $gl.inst[instKey] = pageProxy.getInsts()[instKey]
                        $gl.vueInst[instKey] = pageProxy.getVueInst(instKey)?.refs[instKey]
                    }
                    // 多页面并存
                    if (!$gl.insts[pageComponentId]) {
                        $gl.insts[pageComponentId] = {}
                        $gl.vueInsts[pageComponentId] = {}
                    }
                    $gl.insts[pageComponentId][instKey] = pageProxy.getInsts()[instKey]
                    $gl.vueInsts[pageComponentId][instKey] = pageProxy.getVueInst(instKey)?.refs[instKey]
                }
            }
        }
        return $gl
    }

    /**
     * 加载页面
     * @param pageId   页面ID
     * @param extendId 应用页面树节点ID
     * @param params
     * @param pageStatus 页面状态
     */
    loadPage(pageId: string, extendId: string, params: Array<Param>, pageStatus?: string) {
        const pageProps = {params: params}
        // console.log('JsScriptExecutor > loadPage > pageId:', pageId, 'extendId:', extendId, 'pageStatus:', pageStatus, 'pageProps:', pageProps)
        return h(GlPageViewer, {pageId, extendId, pageStatus, pageProps})
    }

}


const jsScriptExecutor = new JsScriptExecutor()
export default jsScriptExecutor