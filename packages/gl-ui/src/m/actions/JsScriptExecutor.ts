import type {App, AppContext} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import utils from "../utils/Utils";
import {h} from "vue";
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'
import type PageProvideProxy from "../../components/PageProvideProxy";

const pageProxyMap: { [key: string]: PageProvideProxy | undefined } = {}

export class JsScriptExecutor {

    app: App | undefined


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
        console.log('addPageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
    }

    /**
     * 删除当前执行页面的代理对象
     * 一般在页面关闭时执行
     * @param pageComponentId 组件名为GlPage的组件id
     */
    removePageProxy(pageComponentId: string) {
        delete pageProxyMap[pageComponentId]
        // console.log('removePageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
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
     * 触发组件的动作事件
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
                                jsScriptExecutor.doAction(action, ctx = {}, callback)
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
    evalExpression(expression: string, ctx: object, callback?: Function) {
        const $gl = this.getGl()
        $gl.ctx = {...ctx}
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
    evalFn(fnBodyScript: string, ctx: object, callback?: Function) {
        const $gl = this.getGl()
        $gl.ctx = {...ctx}
        let result = utils.evalFn(fnBodyScript, $gl)
        if (callback && typeof callback === 'function') {
            callback()
        }
        return result
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
     * @private
     */
    private getGl() {
        let $gl = {
            loadPage: this.loadPage,
            jsEngine: this,
            getComponentMethod: this.getComponentMethod,
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

        // if (Object.keys(this.$gl).length === 0) {
        //     this.$gl = {
        //         loadPage: this.loadPage,
        //         getComponentMethod: this.getComponentMethod,
        //         getComponentValue: this.getComponentValue,
        //         setComponentValue: this.setComponentValue,
        //         getComponentProps: this.getComponentProps,
        //         setComponentProps: this.setComponentProps,
        //         triggerComponentAction: this.triggerComponentAction,
        //         ...utils,
        //         ...this.app?.config.globalProperties
        //     }
        // }
        return $gl
    }


    /**
     * 加载页面
     * @param pageId    页面ID
     * @param extendId 应用页面树节点ID
     * @param pageProps
     */
    loadPage(pageId: string, extendId: string, pageProps: object) {
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