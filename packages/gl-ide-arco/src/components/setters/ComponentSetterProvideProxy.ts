/**
 *  在组件设置器下的所有属性、样式、动作等设置器中注入的对象
 */
import {ref} from "vue";

export const ComponentSetterProvideKey = 'ComponentSetterProvideKey'
export default class ComponentSetterProvideProxy {

    // 在组件配置时，组件的属性值
    private _propsValue: { [key: string]: any } = ref({})
    // 在配置组件的属性时，为了实现各属性之间的信息共享，将配置属性时一些有用的变量共享出来组件
    private _vars: { [key: string]: any } = ref({})
    private _entityDsRef: any
    private propValueChangeCallbacks: Array<{ callback: Function, propName: string }> = []
    private _varChangeCallbacks = {}

    // TODO 需考虑弹出多层GlComponentSetter的时，属性覆盖的场景
    setPropValue(propName: string, value: any) {
        this._propsValue.value[propName] = value
        // console.log('ComponentSetterProvideProxy > _propsValue:', this._propsValue.value)
        this.propValueChangeCallbacks.forEach((item: { callback: Function, propName: string }) => {
            item.callback(propName, value)
        })
    }

    getPropValue(propName: string) {
        return this._propsValue.value[propName]
    }

    getPropsRef() {
        return this._propsValue
    }

    setVar(varName: string, value: any) {
        this._vars.value[varName] = value
    }

    getVar(varName: string) {
        return this._vars.value[varName]
    }

    getVarsRef() {
        return this._vars
    }

    getEntityDsRef(): any {
        return this._entityDsRef;
    }

    setEntityDsRef(value: any) {
        this._entityDsRef = value;
    }

    /**
     * 添加属性值更变回调
     * @param propName
     * @param callback
     */
    addPropValueChangeCallback(propName: string, callback: Function) {
        this.propValueChangeCallbacks.push({callback, propName})
    }
}

