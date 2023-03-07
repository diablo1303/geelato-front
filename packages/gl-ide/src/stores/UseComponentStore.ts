import {defineStore} from 'pinia'
import ComponentMetaManager from "../entity/meta/ComponentMetaManager";
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {emitter} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
// 组件元数据
const componentMetaManager: ComponentMetaManager = new ComponentMetaManager()
const componentMetaMap: { [key: string]: any } = {}
// componentMetas.forEach((meta) => {
//     componentMetaMap[meta.componentName] = meta
// })

export const useComponentStore = defineStore({
    id: 'GlComponentStore',
    state: () => {
        return {
            currentSelectedComponentId: '',
            currentSelectedComponentName: '',
            // 当前组件元数据
            currentSelectedComponentMeta: undefined,
            // 当前组件实例
            currentSelectedComponentInstance: undefined,
            currentHoverComponentId: '',
            currentHoverComponentName: '',
            currentDragComponentId: '',
            currentDragComponentName: '',
            currentComponentTree: new Array<ComponentInstance>
        }
    },
    actions: {
        /**
         * 添加组件元数据
         * @param componentMetaMap
         */
        addComponentMetas(componentMetas: Array<ComponentMeta>) {
            componentMetas.forEach((meta) => {
                componentMetaMap[meta.componentName] = meta
            })
        },
        /**
         *  选中上一级组件
         */
        selectParentComponent() {
            if (!this.currentSelectedComponentId) {
                return
            }
            let dom = document.getElementById(this.currentSelectedComponentId)
            let parentDom = this.findParentNode(dom)
            if (parentDom.id.indexOf('GlRoot') === -1) {
                this.currentSelectedComponentId = parentDom.id
                // this.currentSelectedComponentName = parentDom.id
            }
            console.log('selectParentComponent:', parentDom.id)
        },

        /**
         * 基于dom向上找gl-*组件dom
         * 特点是上级dom有id，且id长度为16
         * @param dom
         */
        findParentNode(dom: Element | null): any {
            if (dom && dom.parentNode) {
                // console.log('dom:', dom, dom.id, dom.parentNode.id)
                // @ts-ignore
                if (dom.parentNode.id && dom.parentNode.id.length === 16) {
                    return dom.parentNode
                } else {
                    // @ts-ignore
                    return this.findParentNode(dom.parentNode)
                }
            }
            return dom
        },
        findComponentFromTreeById(componentId: string) {
            function findNodeFromTree(nodeId: string, nodes: Array<any>): any {
                for (let index in nodes) {
                    let node = nodes[index]
                    // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
                    if (node.id === componentId) {
                        return node
                    } else if (node.children && node.children.length > 0) {
                        const foundNode = findNodeFromTree(nodeId, node.children)
                        if (foundNode) return foundNode
                    }
                }
            }

            return findNodeFromTree(componentId, this.currentComponentTree) || {}
        },

        setCurrentSelectedComponentId(value: string) {
            const payload = {old: this.currentSelectedComponentId, new: value}
            this.currentSelectedComponentId = value;
            emitter.emit('setCurrentSelectedComponentId', payload)
        },
        setCurrentHoverComponentId(value: string) {
            const payload = {old: this.currentHoverComponentId, new: value}
            this.currentHoverComponentId = value;
            emitter.emit('setCurrentHoverComponentId', payload)
        },
        setCurrentSelectedComponentInstance(instance:any){
            this.currentSelectedComponentInstance = instance
        },
        /**
         * 通过id，从组件实例树中找到该实例
         * 并设置当前选中组件的信息，包括id、name、componentMeta
         * @param value
         */
        setCurrentSelectedComponentById(value: string) {
            // console.log('setCurrentSelectedComponentById > value:', value)
            this.setCurrentSelectedComponentId(value)

            if (this.currentSelectedComponentId) {
                const foundComponent = this.findComponentFromTreeById(this.currentSelectedComponentId)
                console.log('findComponentFromTreeById', this.currentSelectedComponentId, 'and get', foundComponent)
                this.currentSelectedComponentInstance = foundComponent
                if (this.currentSelectedComponentInstance) {
                    // @ts-ignore
                    this.currentSelectedComponentName = this.currentSelectedComponentInstance.componentName
                    // TODO 对于Gl-Col内置的组件，查询为null
                    // @ts-ignore
                    this.currentSelectedComponentMeta = componentMetaMap[this.currentSelectedComponentName]
                    // this.currentSelectedComponentMeta.props = foundComponent.props
                }
                // console.log('setCurrentSelectedComponentById > currentComponentTree', this.currentComponentTree)
                // console.log('setCurrentSelectedComponentById > currentSelectedComponentInstance', this.currentSelectedComponentInstance, foundComponent)
                // console.log('setCurrentSelectedComponentById > currentSelectedComponentMeta', this.currentSelectedComponentMeta)
                // this.setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', this.currentSelectedComponentId)
            } else {
                this.currentSelectedComponentName = ''
                this.currentSelectedComponentMeta = undefined
                this.currentSelectedComponentInstance = undefined
            }
        }
    }
})