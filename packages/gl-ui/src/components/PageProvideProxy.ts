/**
 *  在Page组件的所有子组件中注入的对象
 */
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {ComponentInternalInstance} from "vue";
import type {Param} from "@/m/types/global";

export type PageParamConfigType = { pName: string, pValue: any, pType: string }
export const PageProvideKey = 'PageProvideKey'
export const PageParamsKey = 'PageParamsKey'
export const PageProvideKeyNotBlockPage = 'PageProvideKeyNotBlockPage'


/**
 * 参数据对象序列化，形成代码块
 * @param params
 */
export const paramStringify = (params: Array<PageParamConfigType>) => {
    const strArray = []
    strArray.push("[")
    let index = 1
    params.forEach((param) => {
        strArray.push("{")
        strArray.push(`"${param.pName}":`)
        switch (param.pType) {
            case undefined:
                strArray.push(`"${param.pValue}"`)
                break
            case "string" :
                strArray.push(`"${param.pValue}"`)
                break
            case "number" :
                strArray.push(param.pValue)
                break
            case "boolean" :
                strArray.push(param.pValue)
                break
            case "express" :
                strArray.push(param.pValue)
                break
            case "array" :
                strArray.push(param.pValue)
                break
            case "object" :
                strArray.push(param.pValue)
                break
            default:
                strArray.push(`"${param.pValue}"`)
                break
        }
        strArray.push("}")
        if (index !== params.length) {
            strArray.push(",")
        }
        index++
    })
    strArray.push("]")
    return strArray.join('')
}


export default class PageProvideProxy {
    // 数据库中的字段，页面id
    pageId: string = ''
    pageInst: ComponentInstance
    pageVueInst: ComponentInternalInstance | null
    pageParams: Array<Param> = []
    pageCtx: object = {}
    componentMap: { [key: string]: ComponentInternalInstance | null } = {}
    componentInsts: { [key: string]: ComponentInstance } = {}

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
        if (componentId && vueInst) {
            // console.log('setVueInst(),componentId:', componentId, ',vueInst:', vueInst, vueInst.props.glComponentInst)
            this.componentMap[componentId] = vueInst
            this.componentInsts[componentId] = vueInst.props.glComponentInst as ComponentInstance
        }
    }

    removeVueInst(componentId: string) {
        if (componentId) {
            delete this.componentMap[componentId]
            delete this.componentInsts[componentId]
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
     *  获取当前页面在下所有的组件配置实例
     */
    getInsts(): { [key: string]: ComponentInstance } {
        return this.componentInsts
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
     * 设置页面参数，这里设置的是已完成解析的，键值对，不是参数配置信息
     * @param params
     */
    setParams(params: Array<Param>) {
        this.pageParams = params || []
    }

    /**
     *  在动作面板中配置的页面参数，如pageStatus为'read'
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
                ary.push({[param.name.substring(prefix.length + 1)]: param.value})
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
            // console.log('param', param, toRaw(param))
            // const key = Object.keys(toRaw(param))[0]
            if (param.name.startsWith(prefix + '.')) {
                obj[param.name.substring(prefix.length + 1)] = param.value
            }
        })
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
        // let pName = ''
        // const foundParam = this.pageParams?.find((param: { [key: string]: any }) => {
        //     const foundKey = Object.keys(param).find((key: string) => {
        //         return key === paramName
        //     })
        //     if (foundKey) {
        //         pName = foundKey
        //         return true
        //     }
        //     return false
        // })
        //
        // if (foundParam) {
        //     return foundParam[pName]
        // }
        // return null
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

