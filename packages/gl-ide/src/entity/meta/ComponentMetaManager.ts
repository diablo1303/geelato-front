import type ComponentRuntimeMeta from "./ComponentRuntimeMeta";
import type ComponentDesignMeta from "./ComponentDesignMeta";

export default class ComponentMetaManager {
    private _runtimeMeta: Array<ComponentRuntimeMeta> = []
    private _designMeta: Array<ComponentDesignMeta> = []

    constructor() {
    }


    get runtimeMeta(): Array<ComponentRuntimeMeta> {
        return this._runtimeMeta;
    }

    get designMeta(): Array<ComponentDesignMeta> {
        return this._designMeta;
    }

    registerOneComponentMeta(runtimeMeta: ComponentRuntimeMeta, designMeta: ComponentDesignMeta) {
        this._runtimeMeta.push(runtimeMeta)
        this._designMeta.push(designMeta)
    }

    registerOneComponentRuntimeMeta(runtimeMeta: ComponentRuntimeMeta, forceUpdate: boolean = false) {
        if (!runtimeMeta.componentName || !runtimeMeta.templateId) {
            return
        }
        let foundIndex = -1
        let meta = this._runtimeMeta.find((item, index) => {
            if (item.templateId === runtimeMeta.templateId) {
                foundIndex = index
                return true
            }
            return false
        })
        if (meta) {
            if (forceUpdate) {
                this._runtimeMeta[foundIndex] = runtimeMeta
            }
            console.log('已存在元数据：', meta, 'registerOneComponentRuntimeMeta失败:', runtimeMeta)
        } else {
            this._runtimeMeta.push(runtimeMeta)
        }
    }

    unRegisterOneComponentRuntimeMeta(runtimeMeta: ComponentRuntimeMeta) {
        let index = this._runtimeMeta.findIndex((item) => {
            return item.templateId === runtimeMeta.templateId
        })
        console.log(runtimeMeta, index)
        if (index !== -1) {
            this._runtimeMeta.splice(index, 1)
        }
    }

    // componentName唯一
    registerOneComponentDesignMeta(designMeta: ComponentDesignMeta, forceUpdate: boolean = false) {
        if (!designMeta || !designMeta.componentName) {
            return {code: 1, message: '注册的组件信息为空或不完整', extend: {designMeta: designMeta}}
        }
        let foundIndex = -1
        let meta = this._designMeta.find((item, index) => {
            if (item.componentName === designMeta.componentName) {
                foundIndex = index
                return true
            }
            return false
        })
        if (meta) {
            if (forceUpdate) {
                this._designMeta[foundIndex] = designMeta
            }
            console.log('已存在元数据：', meta, 'registerOneComponentDesignMeta失败:', designMeta)
            return {code: 2, message: '组件已存在，不可重复注册'}
        } else {
            this._designMeta.push(designMeta)
            return {code: 0, message: ''}
        }
    }

    unRegisterOneComponentDesignMeta(designMeta: ComponentRuntimeMeta) {
        if (!designMeta || !designMeta.componentName) {
            return
        }
        let index = this._designMeta.findIndex((item) => {
            return item.componentName === designMeta.componentName
        })
        if (index !== -1) {
            this._designMeta.splice(index, 1)
        }
    }

    registerManyComponentRuntimeMeta(runtimeMeta: Array<ComponentRuntimeMeta>) {
        this._runtimeMeta.push(...runtimeMeta)
    }

    registerManyComponentDesignMeta(designMeta: Array<ComponentDesignMeta>) {
        this._designMeta.push(...designMeta)
    }

    findComponentRuntimeMeta(componentName: string) {
        return this._runtimeMeta.find((item) => {
            return item.componentName === componentName
        })
    }

    findComponentDesignMeta(componentName: string) {
        console.log('findComponentDesignMeta by componentName:', componentName, 'in _designMeta', this._designMeta)
        return this._designMeta.find((item) => {
            return item.componentName === componentName
        })
    }
}
