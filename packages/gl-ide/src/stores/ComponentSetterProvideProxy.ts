/**
 *  在组件设置器下的所有属性、样式、动作等设置器中注入的对象
 */
import {ref} from "vue";
import {utils} from "@geelato/gl-ui";

export const ComponentSetterProvideKey = 'ComponentSetterProvideKey'
export default class ComponentSetterProvideProxy {

    // 在组件配置时，组件的属性值
    private _propsValue: { [key: string]: any } = ref({})
    // 在配置组件的属性时，为了实现各属性之间的信息共享，将配置属性时一些有用的变量共享出来组件
    private _varsValue: { [key: string]: any } = ref({})
    private _entityDsRef: any
    private propValueChangeCallbacks: Array<{ token: string, callback: Function, propName: string }> = []
    private varValueChangeCallbacks: Array<{ token: string, callback: Function, varName: string }> = []

    // TODO 需考虑弹出多层GlComponentSetter的时，属性覆盖的场景
    setPropValue(propName: string, value: any) {
        const oldVal = this._propsValue.value[propName]
        if (oldVal === value) {
            return
        }
        this._propsValue.value[propName] = value
        // console.log('ComponentSetterProvideProxy > _propsValue:', this._propsValue.value)
        this.propValueChangeCallbacks.forEach((item: { callback: Function, propName: string }) => {
            console.log('ComponentSetterProvideProxy > setPropValue() > propName:', propName, item.propName, value, oldVal)
            if (propName === item.propName) {
                item.callback(value, oldVal)
            }
        })
    }

    getPropValue(propName: string) {
        return this._propsValue.value[propName]
    }

    getPropsRef() {
        return this._propsValue
    }


    getVarValue(varName: string) {
        return this._varsValue.value[varName]
    }

    getVarsRef() {
        return this._varsValue
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
        const token: string = utils.gid('token')
        this.propValueChangeCallbacks.push({token, callback, propName})
        return token
    }

    /**
     * 删除属性更新回调
     * @param token
     */
    removePropValueChangeCallback(token: string) {
        for (const key in this.propValueChangeCallbacks) {
            if (this.propValueChangeCallbacks[key].token === token) {
                delete this.propValueChangeCallbacks[key]
            }
        }
    }

    setVarValue(varName: string, value: any) {
        const oldVal = this._varsValue.value[varName]
        if (oldVal === value) {
            return
        }
        this._varsValue.value[varName] = value
        this.varValueChangeCallbacks.forEach((item: { callback: Function, varName: string }) => {
            // console.log('ComponentSetterProvideProxy > setVarValue() > varName:', varName, 'val:', value, 'oldVal', oldVal, 'try to match callbackVarName:', item.varName)
            if (varName === item.varName) {
                item.callback(value, oldVal)
            }
        })
    }

    /**
     * 添加变量值更变回调
     * @param varName
     * @param callback
     */
    addVarValueChangeCallback(varName: string, callback: Function) {
        const token: string = utils.gid('token')
        this.varValueChangeCallbacks.push({token, callback, varName})
        return token
    }

    /**
     * 删除变量更新回调
     * @param token
     */
    removeVarValueChangeCallback(token: string) {
        for (const key in this.varValueChangeCallbacks) {
            if (this.varValueChangeCallbacks[key].token === token) {
                delete this.varValueChangeCallbacks[key]
            }
        }
    }
}

