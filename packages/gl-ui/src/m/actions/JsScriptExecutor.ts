import type {App} from "vue";
import {h} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import utils from "../utils/Utils";
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'
import type PageProvideProxy from "../../components/PageProvideProxy";
import type {Param} from "../types/global";

const pageProxyMap: { [key: string]: PageProvideProxy | undefined } = {}

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
        console.log('addPageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
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
        console.log('removePageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap, ids)
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
     */
    getPageParam(paramName: string, $gl: any) {
        const pageProxy: PageProvideProxy = $gl.ctx.pageProxy
        if (pageProxy) {
            console.log('pageProxy', pageProxy)
            return pageProxy.getParamValue(paramName)
        }
        console.error('在获取页面参数值时，获取不到当前页面信息。')
        return null
    }

    /**
     * 触发组件的动作事件f
     * @param actionName
     */
    triggerComponentAction(componentId: string, actionName: string, ctx?: {}, callback?: Function) {
        for (const pageComponentId in pageProxyMap) {
            const pageProxy = pageProxyMap[pageComponentId]
            if (pageProxy) {
                const vueInst = pageProxy.getVueInst(componentId)
                if (vueInst) {
                    // @ts-ignore
                    const actions = vueInst?.props?.glComponentInst?.actions
                    if (actions) {
                        for (const actionsKey in actions) {
                            const action = actions[actionsKey]
                            if (action.name === actionName) {
                                jsScriptExecutor.doAction(action, ctx = {pageProxy}, callback)
                            }
                        }
                    }
                }
                continue
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
                continue
            }
        }
        return undefined
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
            loadPage: (pageId: string, extendId: string, params: Array<Param>) => {
                return that.loadPage(pageId, extendId, that.evalParams(params, $gl.ctx) || [])
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
                    method(that.evalParams(params, $gl.ctx))
                }
            },
            // evalExpression: (expression: string) => {
            //     return that.evalExpression(expression, $gl.ctx)
            // },
            // evalFn: (expression: string, ctx: { pageProxy?: PageProvideProxy, [key: string]: any }, callback?: Function) => {
            //     return that.evalFn(expression, ctx, callback)
            // },
            getPageParams: () => that.getPageParams($gl),
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
     */
    setComponentValue(componentId: string, value: any) {
        for (const pageComponentId in pageProxyMap) {
            const pageProxy = pageProxyMap[pageComponentId]
            if (pageProxy) {
                const vueInst = pageProxy.getVueInst(componentId)
                if (vueInst) {
                    return pageProxy.setComponentValue(componentId, value)
                }
                continue
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
        console.log('$gl.ctx', $gl.ctx)
        let result = utils.evalFn(fnBodyScript, $gl)
        if (callback && typeof callback === 'function') {
            callback()
        }
        return result
    }


    /**
     * 执行参数，将参数中的valueExpression值表达式计算结果保存到value中
     * @param params
     */
    evalParams(params: Array<Param>, ctx: object) {

        const newParams: Array<Param> = []
        if (params && params.length > 0) {
            for (const index in params) {
                const param: Param = params[index]
                console.log('param.value:', param.value)
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
        console.log('evalParams params:', params, 'ctx:', ctx, 'newParams:', newParams)
        return newParams
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
            // 多页面嵌套场景
            insts: <{ [key: string]: any }>{},
            ctx: {},
            fn: utils
        }
        // set logic fns
        Object.assign($gl.fn, this.getLogicFns($gl))
        // set components fns
        Object.assign($gl.fn, this.getComponentFns($gl))

        // set page
        $gl.page = {
            id: pageProxy?.pageInst.id,
            label: pageProxy?.pageInst.title,
            params: pageProxy?.pageInst.props.params
        }
        // if (this.pageIds.length > 0) {
        //     const pageProxy = pageProxyMap[this.pageIds[0]]!
        //     $gl.page = {
        //         id: pageProxy.pageInst.id,
        //         label: pageProxy.pageInst.title,
        //         params: pageProxy.pageInst.props.params
        //     }
        // }

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
                    }
                    // 多页面并存
                    if (!$gl.insts[pageComponentId]) $gl.insts[pageComponentId] = {}
                    $gl.insts[pageComponentId][instKey] = pageProxy.getInsts()[instKey]
                }
            }
        }

        return $gl
    }

    /**
     * 加载页面
     * @param pageId    页面ID
     * @param extendId 应用页面树节点ID
     * @param pageProps
     */
    loadPage(pageId: string, extendId: string, params: Array<Param>) {
        const pageProps = {params: params}
        console.log('JsScriptExecutor > loadPage > pageId:', pageId, 'extendId:', extendId, 'pageProps:', pageProps)
        return h(GlPageViewer, {pageId, extendId, pageProps})
    }

    /**
     * 获取当前组件所在的页面组件
     */
    // getParentPageComponent() {
    // getCurrentInstance().parent.
    // }
}


const jsScriptExecutor = new JsScriptExecutor()
export default jsScriptExecutor