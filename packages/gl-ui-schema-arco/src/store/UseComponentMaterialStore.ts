import {ref} from "vue";
import {defineStore} from "pinia";
import {
    ComponentMaterial,
    ComponentInstance,
    ComponentMeta,
    schema,
    ComponentMaterialGroup
} from "@geelato/gl-ui-schema";
import {schemaArco} from "../components/schemaArco";
import {schemaBlock} from "../components/schemaBlock";

/**
 *  实现对组件的设置器元数据信息管理
 *  实现对组件的实例模板数据管理，同一个组件的元数据对应一到多个组件实例模板数，如，下拉组件，有的默认绑定了一些数据服务，形成专用的下拉组件，可以加快配置
 */
export const useComponentMaterialStore = defineStore('GlComponentMaterialStore', () => {
    const componentMetas = ref<Array<ComponentMeta>>([])
    const componentMaterials = ref<Array<ComponentMaterial>>([])
    // key为componentName
    const componentMetaMap: { [key: string]: ComponentMeta } = {}
    // key为componentName
    const componentMaterialMap: { [key: string]: ComponentMaterial } = {}
    const componentMaterialGroups = ref(new Array<ComponentMaterialGroup>())
    let inited = false

    /**
     * 注册单个组件元数据
     * @param componentMeta:{ componentName: string }
     */
    function registerComponentMeta(componentMeta: ComponentMeta) {
        if (componentMetaMap[componentMeta.componentName]) {
            console.error('注册组件元数据失败，已存在组件元数据：', componentMeta.componentName, componentMeta)
            return
        } else {
            console.info('注册组件元数据成功：', componentMeta.componentName)
        }
        componentMetaMap[componentMeta.componentName] = componentMeta
        componentMetas.value.push(componentMeta)
    }

    /**
     * 注册多个组件元数据
     * @param componentMetas
     */
    function registerComponentMetas(componentMetas: Array<ComponentMeta>) {
        if (componentMetas && componentMetas.length > 0) {
            for (const componentMetasKey in componentMetas) {
                registerComponentMeta(componentMetas[componentMetasKey])
            }
        }
    }

    /**
     * 注册单个组件实例，在注册实例的同时会同步注册对应的组件物料
     * 在注册前，需先注册元数据componentMeta
     * @param componentInstance: ComponentInstance
     */
    function registerComponentMaterial(componentInstance: ComponentInstance, options?: { title: string, group: string, iconType: string, useBy: Array<string> }) {
        const name = componentInstance.componentName
        if (componentMaterialMap[name]) {
            console.error('注册组件物料失败，已存在组件物料：', name, componentInstance)
            return
        }
        if (!componentMetaMap[name]) {
            console.error('注册组件物料时，找不到对应的组件元数据。')
            return
        }
        const componentMaterial = new ComponentMaterial()
        componentMaterial.instance = componentInstance
        componentMaterial.meta = componentMetaMap[name]
        componentMaterial.title = (options && options.title) || componentMetaMap[name].title
        componentMaterial.group = (options && options.group) || componentMetaMap[name].group
        componentMaterial.iconType = (options && options.iconType) || componentMetaMap[name].iconType
        componentMaterial.useBy = (options && options.useBy) || componentMetaMap[name].useBy
        componentMaterialMap[name] = componentMaterial
        componentMaterials.value.push(componentMaterial)
        console.info('注册组件物料成功：', name)
    }

    /**
     * 注册多个组件实例
     * @param componentInstances: Array<ComponentInstance>
     */
    function registerComponentMaterials(componentInstances: Array<ComponentInstance>, optionsArray?: Array<{ title: string, group: string, iconType: string, useBy: Array<string> }>) {
        if (componentInstances && componentInstances.length > 0) {
            for (const index in componentInstances) {
                registerComponentMaterial(componentInstances[index], optionsArray ? optionsArray[index] : {
                    title: '',
                    group: '',
                    iconType: '',
                    useBy: []
                })
            }
        }
    }

    /**
     * 获取组件元数据
     * @param componentName
     */
    function findMetaByName(componentName: string) {
        return componentMetaMap[componentName]
    }

    function initRegisterComponentMetas() {
        if (inited) return
        registerComponentMetas(schema.componentMetas)
        registerComponentMaterials(schema.componentInstances)
        registerComponentMetas(schemaArco.componentMetas)
        registerComponentMaterials(schemaArco.componentInstances)
        registerComponentMetas(schemaBlock.componentMetas)
        registerComponentMaterials(schemaBlock.componentInstances)
        inited = true
    }

    return {
        initRegisterComponentMetas,
        componentMetas,
        componentMaterials,
        findMetaByName,
        registerComponentMeta,
        registerComponentMetas,
        registerComponentMaterial,
        registerComponentMaterials
    }
})
