/**
 *  在Page组件的所有子组件中注入的对象
 */
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {ComponentInternalInstance} from "vue";

export type PageParamType = { pName: string, pValue: any, pType: string }
export const PageProvideKey = 'PageProvideKey'
export const PageProvideKeyNotBlockPage = 'PageProvideKeyNotBlockPage'
export default class PageProvideProxy {
    // 数据库中的字段，页面id
    pageId: string = ''
    pageInst: ComponentInstance
    pageVueInst: ComponentInternalInstance | null
    pageParams: Array<{ [key: string]: any }> = []
    pageCtx: object = {}
    componentMap: { [key: string]: ComponentInternalInstance | null } = {}

    constructor(pageInst: ComponentInstance, pageVueInst: ComponentInternalInstance | null) {
        this.pageInst = pageInst
        this.pageVueInst = pageVueInst
    }

    /**
     * 页面内子组件引用
     * @param componentId
     * @param vueInst vue实组件实例
     */
    setVueInst(componentId: string, vueInst: ComponentInternalInstance | null) {
        // console.log('setVueInst(),componentId:', componentId, ',vueInst:', vueInst)
        if (componentId) {
            this.componentMap[componentId] = vueInst
        }
    }

    removeVueInst(componentId: string) {
        if (componentId) {
            this.componentMap[componentId] = null
        }
    }

    /**
     * 基于组件获取页面内的vue组件实例
     * @param componentId
     */
    getVueInst(componentId: string) {
        if (componentId) {
            // console.log('getVueInst() > componentMap:', this.componentMap)
            return this.componentMap[componentId]
        }
        return null
    }

    /**
     * 设置页面参数
     * @param params
     */
    setParams(params: Array<{ [key: string]: any }>) {
        this.pageParams = params || []
    }

    /**
     *  在动作面板中配置的页面参数，如formState为'read'
     */
    getParams() {
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
            const key = Object.keys(param)[0]
            if (key.startsWith(prefix + '.')) {
                ary.push({[key.substring(prefix.length + 1)]: param[key]})
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
        const obj: { [key: string]: any } = []
        this.pageParams.forEach((param) => {
            const key = Object.keys(param)[0]
            if (key.startsWith(prefix + '.')) {
                obj[key.substring(prefix.length + 1)] = param[key]
            }
        })
        return obj
    }


    /**
     *  获取在动作面板中配置的页面参数值
     */
    getParamValue(paramName: string) {
        let pName = ''
        const foundParam = this.pageParams?.find((param: { [key: string]: any }) => {
            const foundKey = Object.keys(param).find((key: string) => {
                return key === paramName
            })
            if (foundKey) {
                pName = foundKey
                return true
            }
            return false
        })

        if (foundParam) {
            return foundParam[pName]
        }
        return null
    }


    // setCtx(ctx: object) {
    //     this.pageCtx = ctx
    // }
    //
    // getCtx() {
    //     return this.pageCtx
    // }

    /**
     * 设置组件值glComponentInst.value
     * @param componentId
     * @param value
     */
    setComponentValue(componentId: string, value: any) {
        // console.log('setComponentValue', componentId, value, this.pageInst, this.componentMap)
        const vueInst = this.getVueInst(componentId)
        const proxy = vueInst?.proxy
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
        const vueInst = this.getVueInst(componentId)
        const proxy = vueInst?.proxy
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
        const vueInst = this.getVueInst(componentId)
        // console.log('setComponentProps() > vueInst:', vueInst, 'props:', props)
        // @ts-ignore
        const vueProps = vueInst?.props?.glComponentInst?.props
        if (vueProps) {
            Object.assign(vueProps, props)
            return vueProps
        }
        return null
    }

    /**
     * 获取组件属性
     * @param componentId
     */
    getComponentProps(componentId: string) {
        const vueInst = this.getVueInst(componentId)
        // @ts-ignore
        return vueInst?.props?.glComponentInst?.props
    }

    /**
     * 获取vue组件实例对外开放的方法
     * @param componentId
     * @param methodName
     */
    getMethod(componentId: string, methodName: string) {
        const vueInst = this.getVueInst(componentId)
        console.log('PageProvideProxy > getMethod() > vueInst:', vueInst, 'methodName:', methodName)
        if (vueInst) {
            for (let exposedKey in vueInst.subTree.component?.exposed) {
                const exposedObject = vueInst.subTree.component?.exposed[exposedKey]
                // console.log('getMethod(),test exposedObject.name:', exposedObject.name, typeof exposedObject)
                if (exposedObject.name === methodName && typeof exposedObject === 'function') {
                    // console.log('getMethod(),return exposedObject:', exposedObject)
                    return exposedObject
                }
            }
        }
        return null
    }

}

