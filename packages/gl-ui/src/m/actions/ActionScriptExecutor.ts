import type {App, AppContext} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import utils from "../utils/Utils";
import {h} from "vue";
import GlPageViewer from '../../components/gl-page-viewer/GlPageViewer.vue'
import type PageProvideProxy from "../../components/PageProvideProxy";

const pageProxyMap: { [key: string]: PageProvideProxy | undefined } = {}

export class ActionScriptExecutor {

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
     * @param pageComponentId 组件名为GlPage的组件id
     * @param pageProxy
     */
    addPageProxy(pageComponentId: string, pageProxy: PageProvideProxy) {
        pageProxyMap[pageComponentId] = pageProxy
        // console.log('addPageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
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
                                actionScriptExecutor.doAction(action, ctx = {}, callback)
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
     * 点击等事件
     * @param action 组件中的事件配置信息
     * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
     * @param callback
     */
    doAction(action: Action, ctx: object, callback?: Function) {
        return this.executeScript(action.body, ctx, callback)
    }

    /**
     * 执行脚本的基础方法，在些构建上下文信息，工具方法等信息
     * @param bodyScript 脚本信息，方法体
     * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
     * @param callback
     */
    executeScript(bodyScript: string, ctx: object, callback?: Function) {
        const $ctx = {
            ...ctx
        }
        if (Object.keys(this.$gl).length === 0) {
            this.$gl = {
                loadPage: this.loadPage,
                getComponentMethod: this.getComponentMethod,
                getComponentValue: this.getComponentValue,
                getComponentProps: this.getComponentProps,
                setComponentProps: this.setComponentProps,
                triggerComponentAction: this.triggerComponentAction,
                ...utils,
                ...this.app?.config.globalProperties
            }
        }
        // console.log('executeScript(),$ctx:', $ctx, 'script:', script)
        const result = utils.evalFn(bodyScript, $ctx, '$ctx', this.$gl, '$gl')
        if (callback && typeof callback === 'function') {
            callback()
        }
        return result
    }

    /**
     * 加载页面
     * @param pageId    页面ID
     * @param extendId 应用页面树节点ID
     * @param pageProps
     */
    loadPage(pageId: string, extendId: string, pageProps: object) {
        console.log('ActionScriptExecutor > loadPage > pageId:', pageId, 'extendId:', extendId, 'pageProps:', pageProps)
        return h(GlPageViewer, {pageId, extendId, pageProps})
    }

    /**
     * 获取当前组件所在的页面组件
     */
    // getParentPageComponent() {
    // getCurrentInstance().parent.
    // }
}

const actionScriptExecutor = new ActionScriptExecutor()
export default actionScriptExecutor