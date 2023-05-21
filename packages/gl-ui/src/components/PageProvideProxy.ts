/**
 *  在Page组件的所有子组件中注入的对象
 */
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {ComponentInternalInstance} from "vue";

export type PageParamType = { pName: string, pValue: any, pType: string }

export default class PageProvideProxy {
    // 数据库中的字段，页面id
    pageId: string = ''
    pageInst: ComponentInstance
    pageVueInst: ComponentInternalInstance | null
    pageParams: Array<{[key:string]:any}> = []
    pageCtx: object = {}
    componentMap: { [key: string]: ComponentInternalInstance | null } = {}

    constructor(pageInst: ComponentInstance, pageVueInst: ComponentInternalInstance | null) {
        this.pageInst = pageInst
        this.pageVueInst = pageVueInst
    }

    /**
     * 页面内子组件引用
     * @param componentId
     * @param vueInst
     */
    setVueInst(componentId: string, vueInst: ComponentInternalInstance | null) {
        // console.log('setVueInst(),componentId:', componentId, ',vueInst:', vueInst)
        if (componentId) {
            this.componentMap[componentId] = vueInst
        }
    }

    getVueInst(componentId: string) {
        if (componentId) {
            return this.componentMap[componentId]
        }
        return null
    }

    setParams(params: Array<{[key:string]:any}>) {
        this.pageParams = params || []
    }

    /**
     *  在动作面板中配置的页面参数，如formState为'read'
     */
    getParams() {
        return this.pageParams
    }

    /**
     *  获取在动作面板中配置的页面参数值
     */
    getParamValue(paramName: string) {
        let pName=''
        const foundParam = this.pageParams?.find((param: {[key:string]:any}) => {
            const foundKey = Object.keys(param).find((key:string)=>{
                return key===paramName
            })
            if(foundKey){
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

    setComponentValue(componentId: string, value: any) {
        console.log('setComponentValue', componentId, value, this.pageInst, this.componentMap)
        const vueInst = this.componentMap[componentId]
        console.log('setComponentValue(), vueInst:', vueInst)
        const proxy = vueInst?.proxy
        if (proxy) {
            // @ts-ignore
            proxy.glComponentInst.value = value
            // proxy.$forceUpdate()
        }
    }

    /**
     * 获取vue组件实例对外开放的方法
     * @param componentId
     * @param methodName
     */
    getMethod(componentId: string, methodName: string) {
        const vueInst = this.getVueInst(componentId)
        console.log('getMethod(),vueInst:', vueInst, 'methodName:', methodName)
        if (vueInst) {
            for (let exposedKey in vueInst.subTree.component?.exposed) {
                const exposedObject = vueInst.subTree.component?.exposed[exposedKey]
                console.log('getMethod(),test exposedObject.name:', exposedObject.name, typeof exposedObject)
                if (exposedObject.name === methodName && typeof exposedObject === 'function') {
                    console.log('getMethod(),return exposedObject:', exposedObject)
                    return exposedObject
                }
            }
        }
        return null
    }

}

