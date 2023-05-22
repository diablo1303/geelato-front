/**
 *  在组件设置器下的所有属性、样式、动作等设置器中注入的对象
 */
import {ref} from "vue";

export const ComponentSetterProvideKey = 'ComponentSetterProvideKey'
export default class ComponentSetterProvideProxy {

    private _propsValue: any = ref({})
    private _entityDsRef: any
    private propValueChangeCallbacks: Array<{ callback: Function, propName: string }> = []

    // TODO 需考虑弹出多层GlComponentSetter的时，属性覆盖的场景
    setPropValue(propName: string, value: any) {
        this._propsValue.value[propName] = value
        console.log('ComponentSetterProvideProxy > _propsValue:', this._propsValue.value)
        this.propValueChangeCallbacks.forEach((item:{callback: Function, propName: string}) => {
            item.callback(propName, value)
        })
    }

    getPropValue(propName: string) {
        return this._propsValue.value[propName]
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

