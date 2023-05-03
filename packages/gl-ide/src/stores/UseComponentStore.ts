import {defineStore} from 'pinia'
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {emitter, utils} from "@geelato/gl-ui";
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {ref} from "vue";
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
                        if (componentInst) {
                            this.currentComponentTree.push(componentInst)
                        }
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
                                // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
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
                        const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                        // console.log('selectParentComponent(),found:', parentComponent)
                        this.setCurrentSelectedComponentById(parentComponent.id)
                    },

                    /**
                     * 查询指定组件id的父组件
                     * @param componentId 查找的组件id
                     * @return 找不到时返回null，找到时返回对应的组件实例
                     */
                    findParentComponentFromTreeById(componentId: string) {
                        function findParentNodeFromTree(nodeId: string, node: any): any {
                            if (node.id === nodeId) {
                                return null
                            }
                            if (node.children && node.children.length > 0) {
                                for (let index in node.children) {
                                    const subNode = node.children[index]
                                    if (subNode.id === nodeId) {
                                        return node
                                    } else {
                                        const foundNode = findParentNodeFromTree(nodeId, subNode)
                                        if (foundNode) return foundNode
                                    }
                                }
                            }
                            return null
                        }

                        if (this.currentComponentTree.length === 0) return null

                        return findParentNodeFromTree(componentId, this.currentComponentTree[0]) || {}
                    },
                    findComponentFromTreeById(componentId: string) {
                        function findNodeFromTree(nodeId: string, nodes: Array<any>): any {
                            for (let index in nodes) {
                                let node = nodes[index]
                                // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
                                if (node.id === nodeId) {
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
                    // setCurrentSelectedComponentInstance(instance: any) {
                    //     this.currentSelectedComponentInstance = instance
                    // },
                    /**
                     * 通过id，从组件实例树中找到该实例
                     * 并设置当前选中组件的信息，包括id、name、componentMeta
                     * 需在currentComponentTree已push了相应的组件之后才有效，否则找不到对应的组件实例
                     * @param value
                     */
                    setCurrentSelectedComponentById(value: string) {
                        console.log('setCurrentSelectedComponentById > value:', value)
                        this.setCurrentSelectedComponentId(value)

                        if (this.currentSelectedComponentId) {
                            const foundComponent = this.findComponentFromTreeById(this.currentSelectedComponentId)
                            console.log('findComponentFromTreeById', this.currentSelectedComponentId, 'and get', foundComponent, ',currentComponentTree:', this.currentComponentTree)
                            this.currentSelectedComponentInstance = foundComponent
                            if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                                // @ts-ignore  TODO 该操作会导致GL-X内的组件拖拽时，一次可拖一次禁用交替出现??
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
                    setCurrentSelectedComponentByIdFromItems(id: string, insts: Array<ComponentInstance>) {
                        console.log('setCurrentSelectedComponentByIdFromItems > id:', id)
                        this.setCurrentSelectedComponentId(id)

                        if (this.currentSelectedComponentId && insts && insts.length > 0) {
                            const foundComponent = insts.find((inst) => {
                                return inst.id === id
                            })
                            console.log('setCurrentSelectedComponentByIdFromItems', this.currentSelectedComponentId, 'and get', foundComponent, ',insts:', insts)
                            this.currentSelectedComponentInstance = foundComponent!
                            if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                                this.currentSelectedComponentName = this.currentSelectedComponentInstance.componentName
                                this.currentSelectedComponentMeta = componentStoreFactory.componentMetaMap[this.currentSelectedComponentName]
                            }
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