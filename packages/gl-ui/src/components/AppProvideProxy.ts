/**
 *  在应用中的所有PageProvideProxy注入其中
 */
import type PageProvideProxy from "./PageProvideProxy";
export const AppProvideKey = 'AppProvideKey'
export default class AppProvideProxy {
    // 数据库中的字段，应用id
    appId: string = ''
    pageProvideProxyMap: { [key: string]: PageProvideProxy | null } = {}

    constructor() {
    }

    /**
     * 页面内子组件引用
     * @param pageComponentId
     * @param vueInst vue实组件实例
     */
    addPageProvideProxy(pageComponentId: string, pageProvideProxy: PageProvideProxy | null) {
        if (pageComponentId) {
            this.pageProvideProxyMap[pageComponentId] = pageProvideProxy
        }
    }

    removePageProvideProxy(pageComponentId: string) {
        if (pageComponentId) {
            this.pageProvideProxyMap[pageComponentId] = null
        }
    }

    /**
     * 基于组件获取页面内的vue组件实例
     * @param pageComponentId
     */
    getPageProvideProxy(pageComponentId: string) {
        if (pageComponentId) {
            return this.pageProvideProxyMap[pageComponentId]
        }
        return null
    }
}

