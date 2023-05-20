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
     * @param pageProxy
     */
    addPageProxy(pageComponentId: string, pageProxy: PageProvideProxy) {
        pageProxyMap[pageComponentId] = pageProxy
        console.log('addPageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
    }

    /**
     * 删除当前执行页面的代理对象
     * 一般在页面关闭时执行
     * @param pageProxy
     */
    removePageProxy(pageComponentId: string) {
        delete pageProxyMap[pageComponentId]
        console.log('removePageProxy(),pageComponentId:', pageComponentId, 'pageProxyMap:', pageProxyMap)
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
     *
     * @param action 组件中的事件配置信息
     * @param ctx 调用该方法的组件所在的上下文信息，如列表的行信息
     * @param callback
     */
    doAction(action: Action, ctx: object, callback?: Function) {
        const $ctx = {
            ...ctx
        }
        if (Object.keys(this.$gl).length === 0) {
            this.$gl = {
                loadPage: this.loadPage,
                getComponentMethod: this.getComponentMethod,
                ...utils,
                ...this.app?.config.globalProperties
            }
        }
        console.log('doAction(),$ctx:', $ctx, 'action.body:', action.body)
        const result = utils.evalFn(action.body, $ctx, '$ctx', this.$gl, '$gl')
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