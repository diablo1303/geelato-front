import {defineStore} from 'pinia'
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {emitter, utils} from "@geelato/gl-ui";
import {ComponentInstance} from "@geelato/gl-ui-schema";
// 组件元数据
// const componentMetaMap: { [key: string]: any } = {}

class ComponentMetaMap {
    [key: string]: any
}

class ComponentStoreFactory {

    componentStoreMap: { [key: string]: any } = {}
    // 组件元数据，在多个store中共享
    componentMetaMap = new ComponentMetaMap()

    /**
     * 从store工厂中获取componentStore,便于在同一运行环境（页面）下，构建多个编辑器
     * @param id
     */
    getComponentStore(id: string) {
        if (!this.componentStoreMap[id]) {
            this.componentStoreMap[id] = defineStore(id, {
                state: () => {
                    return {
                        currentSelectedComponentId: '',
                        currentSelectedComponentName: '',
                        // 当前组件元数据
                        currentSelectedComponentMeta: undefined,
                        // 当前组件实例
                        currentSelectedComponentInstance: new ComponentInstance(),
                        currentHoverComponentId: '',
                        currentHoverComponentName: '',
                        currentDragComponentId: '',
                        currentDragComponentName: '',
                        currentComponentTree: new Array<ComponentInstance>
                    }
                },
                actions: {

                    setComponentTree(componentInst: ComponentInstance) {
                        this.currentComponentTree.length = 0
                        this.currentComponentTree.push(componentInst)
                    },
                    /**
                     * 添加组件元数据
                     * @param componentMetaMap
                     */
                    addComponentMetas(componentMetas: Array<ComponentMeta>) {
                        componentMetas.forEach((meta) => {
                            componentStoreFactory.componentMetaMap[meta.componentName] = meta
                        })
                    },
                    /**
                     * 从组件实体树中删除组件
                     * @param componentId
                     */
                    deleteComponentInstById(componentId: String) {
                        if (!componentId) {
                            return
                        }
                        // console.log("try to deleteComponentById", componentId)
                        const thisProxy = this

                        function deleteNodeFromTree(nodeId: String, nodes: Array<any>): any {
                            for (let index in nodes) {
                                let node = nodes[index]
                                console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
                                if (node.id === componentId) {
                                    nodes.splice(Number.parseInt(index), 1)
                                    thisProxy.clearCurrentSelectedComponent()
                                    // 如果nodes下已无组件，则加入占位符
                                    if (nodes.length === 0) {
                                        nodes.push(
                                            {
                                                componentName: "GlDndPlaceholder",
                                                id: utils.gid('pHolder', 16),
                                                props: {},
                                                slots: {},
                                                children: []
                                            }
                                        );
                                    }
                                    return
                                } else if (node.children && node.children.length > 0) {
                                    deleteNodeFromTree(nodeId, node.children)
                                }
                            }
                        }

                        deleteNodeFromTree(componentId, this.currentComponentTree)
                    },
                    /**
                     *  删除当前已选中的组件
                     */
                    deleteCurrentSelectedComponentInst() {
                        this.deleteComponentInstById(this.currentSelectedComponentId)
                    },

                    /**
                     *  切换组件在启用状态，可用于组件的设计时调试使用
                     *  相当于注释掉代码
                     */
                    switchCurrentSelectedComponentStatus() {
                        if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                            this.currentSelectedComponentInstance._disabled = !this.currentSelectedComponentInstance._disabled
                        }
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
                            this.setCurrentSelectedComponentId(parentDom.id)
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

                    setCurrentSelectedComponentId(componentId: string) {
                        const payload = {old: this.currentSelectedComponentId, new: componentId}
                        this.currentSelectedComponentId = componentId;
                        emitter.emit('setCurrentSelectedComponentId', payload)
                    },
                    setCurrentHoverComponentId(value: string) {
                        const payload = {old: this.currentHoverComponentId, new: value}
                        this.currentHoverComponentId = value;
                        emitter.emit('setCurrentHoverComponentId', payload)
                    },
                    setCurrentSelectedComponentInstance(instance: any) {
                        this.currentSelectedComponentInstance = instance
                    },
                    /**
                     * 通过id，从组件实例树中找到该实例
                     * 并设置当前选中组件的信息，包括id、name、componentMeta
                     * @param value
                     */
                    setCurrentSelectedComponentById(value: string) {
                        console.log('setCurrentSelectedComponentById > value:', value)
                        this.setCurrentSelectedComponentId(value)

                        if (this.currentSelectedComponentId) {
                            const foundComponent = this.findComponentFromTreeById(this.currentSelectedComponentId)
                            console.log('findComponentFromTreeById', this.currentSelectedComponentId, 'and get', foundComponent)
                            this.currentSelectedComponentInstance = foundComponent
                            if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                                // @ts-ignore
                                this.currentSelectedComponentName = this.currentSelectedComponentInstance.componentName
                                // TODO 对于Gl-Col内置的组件，查询为null
                                this.currentSelectedComponentMeta = componentStoreFactory.componentMetaMap[this.currentSelectedComponentName]
                                // this.currentSelectedComponentMeta.props = foundComponent.props
                            }
                            // console.log('setCurrentSelectedComponentById > currentComponentTree', this.currentComponentTree)
                            // console.log('setCurrentSelectedComponentById > currentSelectedComponentInstance', this.currentSelectedComponentInstance, foundComponent)
                            // console.log('setCurrentSelectedComponentById > currentSelectedComponentMeta', this.currentSelectedComponentMeta)
                            // this.setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', this.currentSelectedComponentId)
                        } else {
                            this.currentSelectedComponentName = ''
                            this.currentSelectedComponentMeta = undefined
                            this.currentSelectedComponentInstance = new ComponentInstance()
                        }
                    },
                    clearCurrentSelectedComponent() {
                        this.setCurrentSelectedComponentById('')
                    }
                }
            })
        }
        return this.componentStoreMap[id]
    }

    useComponentStore(id: string) {
        return this.getComponentStore(id)()
    }
}

export const componentStoreFactory = new ComponentStoreFactory()
export const useComponentStore = componentStoreFactory.getComponentStore('useComponentStore')
export const useComponentBlockStore = componentStoreFactory.getComponentStore('useComponentBlockStore')