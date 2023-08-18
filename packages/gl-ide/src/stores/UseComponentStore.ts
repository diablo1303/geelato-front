import {defineStore} from 'pinia'
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import {emitter, utils} from "@geelato/gl-ui";
import {ComponentInstance} from "@geelato/gl-ui-schema";

class ComponentMetaMap {
    [key: string]: any
}

// const changeId = (inst: ComponentInstance) => {
//     let index = inst.id.indexOf('_')
//     let prefix = index > 0 ? inst.id.substring(0, index) : ''
//     inst.id = utils.gid(prefix)
//     if (inst.children && inst.children.length > 0) {
//         inst.children.forEach((subInst) => {
//             changeId(subInst)
//         })
//     }
// }


const convertId = (id: string) => {
    let index = id.indexOf('_')
    let prefix = index > 0 ? id.substring(0, index) : ''
    return utils.gid(prefix)
}

const genIdMap = (inst: ComponentInstance, idMap: { [key: string]: string }) => {
    if (inst.id) {
        idMap[inst.id] = convertId(inst.id)
    }
    const otherIds = [inst.props.query?.id,]
    otherIds.forEach((otherId) => {
        if (otherId) {
            idMap[otherId] = convertId(otherId)
        }
    })

    // 对于actions
    if (inst.actions && inst.actions.length > 0) {
        inst.actions.forEach((actionInst) => {
            if (actionInst.id) {
                idMap[actionInst.id] = convertId(actionInst.id)
            }
            // 对于命令块组件实例
            if (actionInst.__commandBlock) {
                if (actionInst.__commandBlock.id) {
                    idMap[actionInst.__commandBlock.id] = convertId(actionInst.__commandBlock.id)
                }
                if (actionInst.__commandBlock.children && actionInst.__commandBlock.children.length > 0) {
                    actionInst.__commandBlock.children.forEach((subInst) => {
                        genIdMap(subInst, idMap)
                    })
                }
            }
        })
    }

    // 对于命令块组件实例
    if (inst.__commandBlock && inst.__commandBlock.children && inst.__commandBlock.children.length > 0) {
        inst.__commandBlock.children.forEach((subInst) => {
            genIdMap(subInst, idMap)
        })
    }

    // 对于页面UI组件实例
    if (inst.children && inst.children.length > 0) {
        inst.children.forEach((subInst) => {
            genIdMap(subInst, idMap)
        })
    }
}

/**
 * 基于字符串替换，深度复制组件
 * 重新生成组件和各子组件的id
 * 当前组件内的id引用也会被替换
 * @param inst
 */
export const copyComponentInst = (inst: ComponentInstance) => {
    // const copyInst = JSON.parse(JSON.stringify(inst))
    // changeId(copyInst)
    // return copyInst
    return copyComponentInsts([inst])[0]
}

export const copyComponentInsts = (insts: Array<ComponentInstance>) => {
    // 先找出所有的id，并算出应转换的id
    const idMap: { [key: string]: string } = {}
    insts.forEach((inst) => {
        genIdMap(inst, idMap)
    })

    // 基于字符串替换所有的id，实现组件id及脚本引用组件id的转换
    // const newInsts: Array<ComponentInstance> = []
    // insts.forEach((inst) => {
    //     let instStr = JSON.stringify(inst)
    //     Object.keys(idMap).forEach((id) => {
    //         instStr = instStr.replace(new RegExp(id, 'g'), idMap[id])
    //         newInsts.push(JSON.parse(instStr))
    //     })
    // })

    let instsStr = JSON.stringify(insts)
    Object.keys(idMap).forEach((id) => {
        instsStr = instsStr.replace(new RegExp(id, 'g'), idMap[id])
    })
    return JSON.parse(instsStr)
}

class ComponentStoreFactory {

    componentStoreMap: { [key: string]: any } = {}
    // 组件元数据，在多个store中共享
    componentMetaMap = new ComponentMetaMap()

    /**
     * 从store工厂中获取componentStore,便于在同一运行环境（页面）下，构建多个编辑器
     * @param storeId
     */
    getComponentStore(storeId: string) {
        if (!this.componentStoreMap[storeId]) {
            this.componentStoreMap[storeId] = defineStore(storeId, {
                state: () => {
                    return {
                        storeId: storeId,
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
                        currentComponentTree: new Array<ComponentInstance>,
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
                     * @param componentMetas
                     */
                    addComponentMetas(componentMetas: Array<ComponentMeta>) {
                        componentMetas.forEach((meta) => {
                            componentStoreFactory.componentMetaMap[meta.componentName] = meta
                        })
                    },
                    /**
                     * 获取组件元数据
                     * @param componentName
                     */
                    getComponentMeta(componentName: string) {
                        return componentStoreFactory.componentMetaMap[componentName]
                    },
                    /**
                     * 基于组件元数据，获取组件别名，若无别名，返回空：''
                     * @param componentName
                     * @param defaultName
                     */
                    getAlias(componentName: string, defaultName?: string) {
                        const defaultAlias = defaultName || ''
                        const meta = componentStoreFactory.componentMetaMap[componentName]
                        if (meta) {
                            return meta.alias || defaultAlias
                        } else {
                            return defaultAlias
                        }
                    },
                    /**
                     * 是否数据输入组件（表单项）
                     * @param componentName
                     */
                    isDataEntryComponent(componentName: string,) {
                        const meta = componentStoreFactory.componentMetaMap[componentName]
                        if (meta) {
                            return meta.group === 'dataEntry'
                        }
                        return false
                    },
                    /**
                     * 获取组件分组名称，基于元数据
                     * @param componentName
                     */
                    getComponentGroupName(componentName: string,) {
                        const meta = componentStoreFactory.componentMetaMap[componentName]
                        if (meta) {
                            return meta.group
                        }
                        return undefined
                    },
                    /**
                     * 从组件实体树中删除组件
                     * @param componentId
                     * @param fromPageId
                     */
                    deleteComponentInstById(componentId: String, fromPageId: string) {
                        if (!componentId) {
                            return false
                        }
                        // console.log("try to deleteComponentById", componentId)
                        const thisProxy = this

                        function deleteNodeFromTree(nodeId: String, nodes: Array<any>): any {
                            for (let index in nodes) {
                                let node = nodes[index]
                                // console.log('compare node.id,componentId', node.id, componentId, node.id === componentId)
                                if (node.id === componentId) {
                                    nodes.splice(Number.parseInt(index), 1)
                                    thisProxy.clearCurrentSelectedComponent(fromPageId)
                                    // 如果nodes下已无组件，则加入占位符
                                    if (nodes.length === 0) {
                                        nodes.push(
                                            {
                                                componentName: "GlDndPlaceholder",
                                                id: utils.gid('pHolder', 20),
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
                        return true
                    },
                    /**
                     *  删除当前已选中的组件
                     *  @return 返回当前删除的组件
                     */
                    deleteCurrentSelectedComponentInst(fromPageId: string): ComponentInstance | undefined {
                        const inst = this.currentSelectedComponentInstance
                        const isSuccess = this.deleteComponentInstById(this.currentSelectedComponentId, fromPageId)
                        if (isSuccess) {
                            return inst
                        } else {
                            return
                        }
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
                     *  复制当前选中的组件
                     *  并重新生成组件及子组件的id
                     *  组件id的引用不做调整，注意copy之后需自行按需进行重新引用配置
                     */
                    copyCurrentSelectedComponent() {
                        if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                            // 找到当前组件树所在的父节点
                            const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                            // 找到当前组件所在的位置
                            if (parentComponent && parentComponent.children) {
                                for (const index in parentComponent.children) {
                                    const componentInst = parentComponent.children[index]
                                    if (componentInst.id === this.currentSelectedComponentInstance.id) {
                                        // 复制组件，组件内的id需重新创建
                                        const newInst = copyComponentInst(componentInst)
                                        parentComponent.children.splice(Number.parseInt(index) + 1, 0, newInst)
                                        this.setCurrentSelectedComponentById(newInst.id, '')
                                        return newInst
                                    }
                                }
                            }
                        }
                    },
                    /**
                     *  选中上一级组件
                     */
                    selectParentComponent(fromPageId: string) {
                        if (!this.currentSelectedComponentId) {
                            return
                        }
                        const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                        // console.log('storeId:', storeId, 'selectParentComponent(),found:', parentComponent)
                        this.setCurrentSelectedComponent(parentComponent!)
                        if (parentComponent?.componentName == 'GlVirtual') {
                            this.selectParentComponent(fromPageId)
                        }
                    },
                    /**
                     *  向前移动组件
                     */
                    moveFrontCurrentComponent() {
                        const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                        if (parentComponent && parentComponent.children.length >= 2) {
                            const index = parentComponent.children.findIndex((inst) => {
                                return inst.id === this.currentSelectedComponentId
                            })
                            if (index > 0) {
                                const inst = parentComponent.children[index]
                                // 上移
                                parentComponent.children.splice(index, 1)
                                parentComponent.children.splice(index - 1, 0, inst)
                            }
                        }
                    },
                    /**
                     *  向后移动组件
                     */
                    moveBackCurrentComponent() {
                        const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                        if (parentComponent && parentComponent.children.length >= 2) {
                            const index = parentComponent.children.findIndex((inst) => {
                                return inst.id === this.currentSelectedComponentId
                            })
                            if (index < parentComponent.children.length - 1) {
                                const inst = parentComponent.children[index]
                                // 上移
                                parentComponent.children.splice(index, 1)
                                parentComponent.children.splice(index + 1, 0, inst)

                            }
                        }
                    },
                    /**
                     *  移动当前选中的组件到上一层，即作为parent的下一个组件
                     */
                    moveToParent() {
                        // 1、选择当前的父组件
                        const parentComponent = this.findParentComponentFromTreeById(this.currentSelectedComponentId)
                        if (parentComponent && parentComponent.componentName === 'GlPage') {
                            return
                        }
                        // 2、将当前组件放到父组件之后
                        // 2.1 找到当前父组件的父组件
                        let grandParentComponent = this.findParentComponentFromTreeById(parentComponent!.id)
                        if (grandParentComponent) {
                            // console.log('grandParentComponent componentName:', grandParentComponent.componentName)
                            // !!!注意，如果
                            if (['GlRowColLayout', 'GlTabs'].indexOf(grandParentComponent.componentName) !== -1) {
                                grandParentComponent = this.findParentComponentFromTreeById(grandParentComponent!.id)
                            }
                            if (grandParentComponent) {
                                // 从父组件中移除当前组件
                                const moveInst = this.deleteCurrentSelectedComponentInst('')
                                if (moveInst) {
                                    grandParentComponent.children.push(moveInst)
                                    this.setCurrentSelectedComponent(moveInst)
                                }
                            }
                        }

                    },
                    /**
                     *  复制当前组件
                     */
                    copyCurrentComponent() {

                    },
                    /**
                     * 查询指定组件id的父组件
                     * @param componentId 查找的组件id
                     * @return 找不到时返回null，找到时返回对应的组件实例
                     */
                    findParentComponentFromTreeById(componentId: string): ComponentInstance | null {
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
                    /**
                     * TODO 引用的页面组件id找到的是空的对象{}
                     * @param componentId
                     */
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
                    setCurrentSelectedComponentId(componentId: string, fromPageId: string) {
                        const payload = {old: this.currentSelectedComponentId, new: componentId, fromPageId}
                        this.currentSelectedComponentId = componentId;
                        emitter.emit('setCurrentSelectedComponentId', payload)
                    },
                    setCurrentHoverComponentId(componentId: string) {
                        const payload = {old: this.currentHoverComponentId, new: componentId}
                        this.currentHoverComponentId = componentId;
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
                     * @param fromPageId
                     */
                    setCurrentSelectedComponentById(value: string, fromPageId: string) {
                        // console.log('storeId:', storeId, 'setCurrentSelectedComponentById > value:', value)
                        this.setCurrentSelectedComponentId(value, fromPageId)
                        if (this.currentSelectedComponentId) {
                            const foundComponent = this.findComponentFromTreeById(this.currentSelectedComponentId)
                            // console.log('setCurrentSelectedComponentById () > storeId:', storeId, 'findComponentFromTreeById', this.currentSelectedComponentId, 'and get', foundComponent, ',currentComponentTree:', this.currentComponentTree)
                            this.setCurrentSelectedComponent(foundComponent)
                        } else {
                            this.currentSelectedComponentName = ''
                            this.currentSelectedComponentMeta = undefined
                            this.currentSelectedComponentInstance = new ComponentInstance()
                        }
                    },
                    /**
                     * 并设置当前选中组件的信息，包括id、name、componentMeta
                     * @param inst
                     */
                    setCurrentSelectedComponent(inst: ComponentInstance) {
                        if (!inst) return
                        this.currentSelectedComponentId = inst.id
                        this.currentSelectedComponentInstance = inst
                        if (this.currentSelectedComponentInstance && this.currentSelectedComponentInstance.id) {
                            // @ts-ignore  TODO 该操作会导致GL-X内的组件拖拽时，一次可拖一次禁用交替出现??
                            this.currentSelectedComponentName = this.currentSelectedComponentInstance.componentName
                            this.currentSelectedComponentMeta = componentStoreFactory.componentMetaMap[this.currentSelectedComponentName]
                            // this.currentSelectedComponentMeta.props = foundComponent.props
                        }
                        // console.log('setCurrentSelectedComponentById > currentComponentTree', this.currentComponentTree)
                        // console.log('setCurrentSelectedComponentById > currentSelectedComponentInstance', this.currentSelectedComponentInstance, foundComponent)
                        // console.log('setCurrentSelectedComponentById > currentSelectedComponentMeta', this.currentSelectedComponentMeta)
                        // this.setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', this.currentSelectedComponentId)
                    },
                    setCurrentSelectedComponentByIdFromItems(id: string, insts: Array<ComponentInstance>, formPageId: string) {
                        console.log('setCurrentSelectedComponentByIdFromItems() > storeId:', storeId, 'setCurrentSelectedComponentByIdFromItems > id:', id)
                        this.setCurrentSelectedComponentId(id, formPageId)

                        if (this.currentSelectedComponentId && insts && insts.length > 0) {
                            const foundComponent = insts.find((inst) => {
                                return inst.id === id
                            })
                            console.log('storeId:', storeId, 'setCurrentSelectedComponentByIdFromItems', this.currentSelectedComponentId, 'and get', foundComponent, ',insts:', insts)
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
                    clearCurrentSelectedComponent(fromPageId: string) {
                        this.setCurrentSelectedComponentById('', fromPageId)
                    },
                    /**
                     *  获取当前页面的组件动作列表
                     */
                    getActionList() {
                        const actionList: ComponentInstance[] = []
                        const findAction = (inst: ComponentInstance) => {
                            if (inst.actions && inst.actions.length > 0) {
                                actionList.push(inst)
                            }
                            if (inst.children && inst.children.length > 0) {
                                inst.children.forEach((subInst) => {
                                    findAction(subInst)
                                })
                            }

                            if (['GlEntityTablePlus', 'GlEntityTable', 'GlEntityTableSub'].indexOf(inst.componentName) !== -1) {
                                inst.props.query?.forEach((queryItem: any) => {
                                    findAction(queryItem.component)
                                })
                                inst.props.toolbar?.leftItems?.forEach((actionInst: ComponentInstance) => {
                                    findAction(actionInst)
                                })
                                inst.props.toolbar?.rightItems?.forEach((actionInst: ComponentInstance) => {
                                    findAction(actionInst)
                                })
                                inst.props.toolbar?.centerItems?.forEach((actionInst: ComponentInstance) => {
                                    findAction(actionInst)
                                })
                                inst.props.columnActions?.forEach((actionInst: ComponentInstance) => {
                                    findAction(actionInst)
                                })
                                inst.props.columns?.forEach((item: any) => {
                                    if (item._component) {
                                        findAction(item._component)
                                    }
                                })
                            }
                        }
                        if (this.currentComponentTree && this.currentComponentTree.length > 0) {
                            findAction(this.currentComponentTree[0])
                        }
                        return actionList
                    },

                    /**
                     *  获取当前组件的导航
                     */
                    getBreadcrumb() {
                        const crumb: ComponentInstance[] = []
                        const findParent = (id: string) => {
                            if (!id) return
                            const parent = this.findParentComponentFromTreeById(id)
                            if (parent) {
                                if (parent.componentName) {
                                    if (parent.componentName !== 'GlVirtual') {
                                        crumb.push(parent)
                                    }
                                    findParent(parent.id)
                                }
                            }
                        }
                        if (this.currentSelectedComponentId) {
                            crumb.push(this.currentSelectedComponentInstance)
                            findParent(this.currentSelectedComponentId)
                        }
                        return crumb.reverse()
                    }
                }
            })
        }
        return this.componentStoreMap[storeId]
    }

    useComponentStore(storeId: string) {
        return this.getComponentStore(storeId)()
    }
}

export const componentStoreFactory = new ComponentStoreFactory()
export const useComponentStore = componentStoreFactory.getComponentStore('useComponentStore')
export const useComponentBlockStore = componentStoreFactory.getComponentStore('useComponentBlockStore')
