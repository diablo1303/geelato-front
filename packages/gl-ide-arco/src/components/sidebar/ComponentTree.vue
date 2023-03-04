<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <a-tree :ref="treeRefId" :tree-result="treeData" :defaultExpandAll="true" :selectedKeys.sync="selectedKeys" showLine
          :draggable="false"
          :fieldNames="replaceFields"
          blockNode @select="onSelect" v-show="glRefreshFlag">
    <!--<template v-slot:switcherIcon>-->
    <!--<span @click="onSwitchFolderIcon">-->
    <!--<FolderOutlined :style="{fontSize: '16px'}"/>-->
    <!--<FolderOpenOutlined :style="{fontSize: '16px'}"/>-->
    <!--</span>-->
    <!--</template>-->
    <!--<template v-slot:title="nodeData">-->
    <!--<div class="gl-tree-node-title">-->
    <!--<span :title="nodeData.title">{{nodeData.title}}</span>-->
    <!--<div class="gl-tree-node-title-actions">-->
    <!--<a-dropdown>-->
    <!--&lt;!&ndash;@click.prevent&ndash;&gt;-->
    <!--<a class="ant-dropdown-link" @click="onDropdown(nodeData,$event)" :id="nodeData.key">-->
    <!--<CaretDownOutlined/>-->
    <!--</a>-->
    <!--<template #overlay>-->
    <!--<a-menu>-->
    <!--<a-menu-item @click="addFolder(nodeData,$event)" v-if="nodeData.dataRef.isLeaf!==true">-->
    <!--<a href="javascript:;">-->
    <!--<PlusCircleOutlined/>&nbsp;添加目录</a>-->
    <!--</a-menu-item>-->
    <!--<a-menu-item @click="addPage(nodeData,$event)" v-if="nodeData.dataRef.isLeaf!==true">-->
    <!--<a href="javascript:;">-->
    <!--<PlusCircleOutlined/>&nbsp;添加页面</a>-->
    <!--</a-menu-item>-->
    <!--<a-menu-item @click="renameNode(nodeData,$event)">-->
    <!--<a href="javascript:;">-->
    <!--<EditOutlined/>&nbsp;修改名称</a>-->
    <!--</a-menu-item>-->
    <!--<a-menu-item @click="deleteNode(nodeData,$event)">-->
    <!--<a href="javascript:;">-->
    <!--<DeleteOutlined/>&nbsp;删除</a>-->
    <!--</a-menu-item>-->
    <!--</a-menu>-->
    <!--</template>-->
    <!--</a-dropdown>-->
    <!--</div>-->
    <!--</div>-->
    <!--</template>-->
  </a-tree>
</template>

<script lang="ts">
    import {defineComponent, reactive, nextTick} from 'vue';
    import {utils} from "@geelato/gl-ui"
    import {Events} from "@geelato/gl-ide"
    // import {useIdeStore} from "@geelato/gl-ide";
    // import AppForm from '../app/AppForm.vue'
    // import DynamicModal from '../DynamicModal.vue'

    // const treeData = [
    //     {
    //         title: '我的小游戏',
    //         id: '0-0',
    //         slots: {title: 'title'},
    //         children: [
    //             {
    //                 title: '地心侠士',
    //                 id: '0-0-0',
    //                 slots: {title: 'title'},
    //                 children: [
    //                     {
    //                         title: '益智类消除类v',
    //                         id: '0-0-0-0',
    //                         slots: {title: 'title'},
    //                         children: [],
    //                         isLeaf: true
    //                     },
    //                     {title: '道具丰富,完整的故事情节', id: '0-0-0-1', slots: {title: 'title'}, children: [], isLeaf: true},
    //                 ],
    //                 isLeaf: false
    //             },
    //             {
    //                 title: '坦克侠',
    //                 id: '0-0-1',
    //                 slots: {title: 'title'},
    //                 children: [
    //                     {id: '0-0-1-0', title: '碰撞消除类', slots: {title: 'title'}, children: [], isLeaf: true},
    //                     {id: '0-0-1-1', title: '测试不初始children属性', slots: {title: 'title'}, children: [], isLeaf: true},
    //                 ],
    //                 isLeaf: false
    //             },
    //         ],
    //         isLeaf: false
    //     },
    // ];


    export default defineComponent({
        name: 'GlIdePluginCoreComponentTree',
        components: {},
        data() {
            return {
                treeData: this.$ide.currentComponentTree,
                replaceFields: {children: 'children', title: 'componentName', key: 'id'},
                treeRefId: utils.gid('tree'),
                selectedKeys: [],
                glRefreshFlag: true,
                visibleModal: false,
                currentTargetNode: undefined,
                currentTargetNodeNewName: '',
                currentTargetNodeNewNameId: utils.gid('input')
            }
        },
        created() {
            this.$gl.bus.$on(Events.GlIdeStageComponentAdd, this.refresh)
        },
        mounted() {
            // console.log('GlIdePluginCoreComponentTree > mounted() > treeData:', this.$ide.currentComponentTree)
        },
        beforeUnmount() {
            this.$gl.bus.$off(Events.GlIdeStageComponentAdd, this.refresh)
            // this.$gl.bus.$off('gl-ide.designer.showCurrentProjectForm', this.showCurrentProjectForm)
            // this.$gl.bus.$off('gl-ide.designer.showProjectList', this.showProjectList)
        },
        watch: {
            // '$ide.currentComponentTree': {
            //     handler: function (val, oval) {
            //         console.log('$ide.currentComponentTree:', val, oval)
            //     },
            //     deep: true
            // }
        },
        methods: {
            refresh() {
                // console.log('refresh() > $ide.currentComponentTree:', this.$ide.currentComponentTree)
                this.treeData = this.$ide.currentComponentTree
            },
            onSwitchFolderIcon(nodeData, e) {
                console.log('onSwitchFolderIcon nodeData, e:', nodeData, e)

            },
            onDropdown(nodeData, e) {
                console.log('onDropdown nodeData, e:', nodeData, e)

            },
            addFolder(nodeData, e) {
                this.currentTargetNode = nodeData
                console.log('addFolder nodeData, e:', nodeData, e)
                nodeData.expanded = true

                const key: string = utils.uuid(8)
                const newNode = {
                    title: '目录' + key,
                    key: key,
                    slots: {title: 'title'},
                    children: [],
                    isLeaf: false
                }
                nodeData.children.push(newNode)
                return newNode
            },
            addPage(nodeData, e) {
                this.currentTargetNode = nodeData
                console.log('addPage nodeData, e:', nodeData, e)
                nodeData.expanded = true

                const key: string = utils.uuid(8)
                const node = {
                    title: '页面' + utils.uuid(8),
                    key: key,
                    slots: {title: 'title'},
                    children: [],
                    isLeaf: true
                }
                // nodeData.expanded = true
                nodeData.children.push(node)
                console.log('refs:', this.$refs[this.treeRefId])
                this.selectedKeys.length = 0
                this.selectedKeys.push(key)
                // this.glRefreshFlag = false
                // nextTick(() => {
                //     console.log('treeData:', this.treeData)
                //     this.glRefreshFlag = true
                //     this.$forceUpdate()
                // })
            },
            renameNode(nodeData, e) {
                this.currentTargetNode = nodeData
                this.currentTargetNodeNewName = this.currentTargetNode.dataRef.title
                this.visibleModal = true
            },
            renameNodeOk() {
                this.currentTargetNode.dataRef.title = this.currentTargetNodeNewName
                this.visibleModal = false
            },
            deleteNode(nodeData, e) {
                this.currentTargetNode = nodeData
                // console.log('deleteNode nodeData, e:', nodeData, e.domEvent.srcElement.parentNode.parentNode.parentNode.parentNode)
                let removedNode = this.removeNode(this.treeData, nodeData.key)
                console.log('removedNode', removedNode)
            },
            onSelect(selectedKeys, e) {
                this.$ide.currentSelectedComponentId = selectedKeys[0]
                this.$ide.currentSelectedComponentName = e.node.title

                    console.log('onSelect selectedKeys, e:', selectedKeys, e)
            },
            /**
             * 基于key，从数组中删除元素或返回该元素
             * @param items treeNodes
             * @param removeKey
             */
            removeNode(items: Array, removeKey: string) {
                console.log('findParent:', items, removeKey)
                for (let i: number in items) {
                    let item = items[i]
                    if (item.key === removeKey) {
                        items.splice(i, 1)
                        return item
                    }
                    let removedNode = this.removeNode(item.children, removeKey)
                    if (removedNode) {
                        return removedNode
                    }
                }
            },
            findParent(items: Array, findKey: string, parentNode: object) {
                console.log('findParent:', items, findKey, parentNode)
                for (let i in items) {
                    let item = items[i]
                    if (item.key === findKey) {
                        return parentNode
                    }
                    let foundNode = this.findParent(item.children, findKey, item)
                    if (foundNode) {
                        return foundNode
                    }
                }
            }
        }
    })
</script>
