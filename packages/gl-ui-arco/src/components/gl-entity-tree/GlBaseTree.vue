<!--
  提供基础的树操作,服务端的操作由外部传入,如addNode属性、deleteNode属性，通该这些属性传入对应的方法，在本组件中执行成功之后，进行组件状态刷新操作，同时触发相应的事件
-->
<template>
  <div class="gl-base-tree">
    <ATree v-if="treeData&&treeData.length>0" blockNode
           :data="treeData"
           :draggable="draggable"
           :selectedKeys="selectedKeys"
           showLine
           @select="onSelect"
           @dragLeave="onDragLeave"
           @dragEnd="onDragEnd"
           @drop="onDrop"
    >
      <template #switcher-icon="node, { isLeaf }">
        <GlIconfont :type="node.iconType" style="font-size: 1.2em;color:#3370ff"></GlIconfont>
      </template>
      <template #title="nodeData">
        <GlIconfont v-if="nodeData.flag" :title="nodeData.flag" type="gl-eye" style="color: #3370ff;"></GlIconfont>
        {{ nodeData.title }}
      </template>
      <template #extra="nodeData">
        <a-trigger ref="contextMenu" position="tl" auto-fit-position :click-to-close="true" :show-arrow="true"
                   @popupVisibleChange="()=>onShowContextMenu(nodeData)">
            <span class="gl-more" style="position: absolute; right: 16px; color: #3370ff;">
              <GlIconfont type="gl-more"></GlIconfont>
            </span>
          <template #content>
            <div style="border:1px solid rgb(231,231,231)">
              <a-menu :style="{ width: '180px', height: '100%' }" :default-open-keys="['0']"
                      :default-selected-keys="['0_2']"
                      breakpoint="xl">
                <a-menu-item class="gl-context-menu-item"
                             v-for="(contextMenuItem,contextMenuItemIndex) in filterContextMenuData"
                             :key="contextMenuItemIndex+''"
                             @click="() => onMenuItemClick(nodeData,contextMenuItem)">
                  <template #icon>
                    <GlIconfont :type="contextMenuItem.iconType"
                                :style="{color:contextMenuItem.iconColor}"></GlIconfont>
                  </template>
                  {{ contextMenuItem.title }}
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-trigger>
      </template>
    </ATree>
    <a-modal :visible="currentAction&&['addNode','updateNodeName'].includes(currentAction.action)" @ok="saveNode"
             @cancel="closeModal">
      <template #title>
        {{ currentAction.title }}
      </template>
      <div>
        <a-input ref="titleInput" v-model="currentEditNodeData.title" @keyup.enter="saveNode"></a-input>
      </div>
    </a-modal>
    <GlIconfontSelect v-show="false" @update:modelValue="onSelectIcon" ref="iconfontSelect"/>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlBaseTree",
};
</script>
<script setup lang="ts">
// @ts-nocheck
import {useGlobal, utils, Utils,} from "@geelato/gl-ui";
import {type PropType, ref} from "vue";
import type {TreeNodeData} from "@arco-design/web-vue";
import type {ContextMenuDataType} from "./types";

// onlyToFolder:叶子节点只能放在目录下
enum DragModeType {
  onlyToFolder = 'onlyToFolder'
}

const global = useGlobal()
const props = defineProps({
  treeId: {
    type: [String, Number],
    required: true
  },
  /**
   *  树根节点名称
   */
  treeName: {
    type: String,
    default() {
      return '根'
    }
  },
  draggable: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   *  拖动模式，默认为onlyToFolder，即只能拖放到目录下
   */
  dragMode: {
    type: String,
    default() {
      return 'onlyToFolder'
    }
  },
  contextMenuData: {
    type: Array as PropType<Array<ContextMenuDataType>>,
    default() {
      return []
    }
  },
  loadTreeData: Function,
  //  服务端添加node的方法
  addNode: Function,
  // 服务端删除node的方法
  deleteNode: Function,
  //  服务端更新node的方法
  updateNode: Function,
  updateNodeSeqNo: Function,
  //  服务端重命名node的方法
  updateNodeName: Function,
  updateNodeIcon: Function
})
// 注意，所有的contextMenuitem click都会触发clickContextMenuItem事件，若是内置的addNode等，还会先触发addNode等事件
// selectNode:选择一个节点，和a-tree的select是有区别的
const emits = defineEmits(['selectNode', 'addNode', 'updateNode', 'updateNodeSeqNo', 'updateNodeName', 'updateNodeIcon', 'deleteNode', 'clickContextMenuItem'])
const selectedKeys = ref([])
const treeData = ref(new Array<any>())
const contextMenu = ref()
const currentClickedNodeData = ref({title: ''})
const currentEditNodeData = ref({title: '', iconType: '', _nodeType: ''})
const currentAction = ref({action: '', title: ''})
const titleInput = ref()
const iconfontSelect = ref()

enum NodeType {
  folder = 'folder',
  root = 'root'
}

const refreshTree = () => {
  treeData.value = [...treeData.value]
  console.log('refreshTree', treeData.value)
}

const filterContextMenuData = ref(new Array<ContextMenuDataType>())
/**
 * 过滤显示适用于（useFor）该节点的菜单项
 * @param clickedNodeData
 */
const onShowContextMenu = (clickedNodeData: any) => {
  filterContextMenuData.value = props.contextMenuData.filter((item: ContextMenuDataType) => {
    // 基于node节点的show属性作是否展示的检查
    if (item.show) {
      const isShow = utils.evalExpression(item.show, {ctx: clickedNodeData})
      // @ts-ignore
      return item.useFor.includes(clickedNodeData._nodeType) && isShow
    } else {
      return item.useFor.includes(clickedNodeData._nodeType)
    }
  })
}

/**
 * 点击右键菜单项，进行添加节点、修改节点、删除节点等操作
 * @param clickedNodeData 树节点
 * @param contextMenuItemData 菜单项
 */
const onMenuItemClick = (clickedNodeData: any, contextMenuItemData: ContextMenuDataType) => {
  console.log('onMenuItemClick:', clickedNodeData)
  currentClickedNodeData.value = clickedNodeData
  if (contextMenuItemData.action === 'addNode') {
    currentEditNodeData.value = {
      title: contextMenuItemData.title,
      iconType: contextMenuItemData.iconType,
      _nodeType: contextMenuItemData._nodeType
    }
    currentAction.value = {action: 'addNode', title: '添加节点'}
  } else if (contextMenuItemData.action === 'updateNodeName') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    currentAction.value = {action: 'updateNodeName', title: '修改名称'}
    // modal的visible会依据currentAction的name为'updateNodeName'，弹出修改窗口
  } else if (contextMenuItemData.action === 'updateNodeIcon') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    currentAction.value = {action: 'updateNodeIcon', title: '修改图标'}
    iconfontSelect.value.showIconSelect()
  } else if (contextMenuItemData.action === 'updateNode') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    if (contextMenuItemData.actionParams) {
      Object.keys(contextMenuItemData.actionParams).forEach((key: string) => {
        //@ts-ignore
        currentEditNodeData.value[key] = contextMenuItemData.actionParams[key]
        //@ts-ignore
        clickedNodeData[key] = contextMenuItemData.actionParams[key]
      })
    }
    currentAction.value = {action: 'updateNode', title: '修改节点'}
    updateNode(currentClickedNodeData.value, currentEditNodeData.value)
    // console.log('currentAction updateNode', currentEditNodeData, contextMenuItemData)
  } else if (contextMenuItemData.action === 'deleteNode') {
    currentAction.value = {action: 'deleteNode', title: '删除节点'}
    console.log('currentAction deleteNode', clickedNodeData)
    deleteNode(currentClickedNodeData.value)
  } else {
    // custom click event
  }
  // 打开弹窗之后,focus input
  utils.sleep(200).then(() => {
    titleInput.value.focus()
  })
  console.log('currentEditNodeData:', currentEditNodeData.value)
  // 所有的操作都会触发此事件
  emits('clickContextMenuItem', {clickedNodeData, contextMenuItemData})
}

/**
 *  在菜单项上点新建或修改之后，弹出页面，调用该页面的保存操作时调用saveNode方法
 */
const saveNode = () => {
  console.log('saveNode', currentEditNodeData)
  // @ts-ignore
  if (currentEditNodeData.value.key) {
    // 修改
    updateNodeName(currentClickedNodeData.value, currentEditNodeData.value)
  } else {
    // 新增
    addNode(currentClickedNodeData.value, currentEditNodeData.value)
  }
  currentAction.value = {action: '', title: ''}
}

const updateNodeName = (clickedNodeData: any, editNodeData: any) => {
  const params = {editNodeData}
  // console.log('updateNodeName() > clickedNodeData', clickedNodeData, 'editNodeData', editNodeData)
  if (props.updateNodeName) {
    props.updateNodeName(params).then((res: any) => {
      clickedNodeData.title = editNodeData.title
      refreshTree()
      emits('updateNodeName', params)
    })
  } else {
    emits('updateNodeName', params)
  }
}

const onSelectIcon = (iconType: string) => {
  currentEditNodeData.value.iconType = iconType
  updateNodeIcon(currentClickedNodeData.value, currentEditNodeData.value)
}

const updateNodeIcon = (clickedNodeData: any, editNodeData: any) => {
  const params = {editNodeData}
  // console.log('updateNodeName() > clickedNodeData', clickedNodeData, 'editNodeData', editNodeData)
  if (props.updateNodeIcon) {
    props.updateNodeIcon(params).then((res: any) => {
      clickedNodeData.iconType = editNodeData.iconType
      refreshTree()
      emits('updateNodeIcon', params)
    })
  } else {
    emits('updateNodeIcon', params)
  }
}

const updateNode = (clickedNodeData: any, editNodeData: any) => {
  // 只有title和flag字段可修改
  // clickedNodeData.title = editNodeData.title
  // clickedNodeData.flag = editNodeData.flag
  const params = {editNodeData}
  if (props.updateNode) {
    props.updateNode(params).then((res: any) => {
      //  TODO 待结合实际应用情况，参考updateNodeName，在保存成功之后，更新前端的信息
      refreshTree()
      emits('updateNode', params)
    })
  } else {
    emits('updateNode', params)
  }
}

/**
 * 更新某节点id下的所有节点排序，适用于小数据量的场景
 * @param pid
 */
const updateNodeSeqNo = (pid: string) => {
  // console.log('updateNodeSeqNo,pid:', pid, treeData.value)

  const findNode = (nodeData: any): any => {

    if (nodeData.key === pid) {
      return nodeData
    }

    if (nodeData.children && nodeData.children.length > 0) {
      for (const nodeDataKey in nodeData.children) {
        const foundSubNode = findNode(nodeData.children[nodeDataKey])
        if (foundSubNode) {
          return foundSubNode
        }
      }
    }
    return undefined
  }

  if (treeData.value && treeData.value.length > 0) {
    const foundNode = findNode(treeData.value[0])
    if (foundNode) {
      // TODO 需要提供一个批量修改多个的方法，暂时逐个执行
      foundNode.children.forEach((subNode: any, index: number) => {
        if (props.updateNodeSeqNo) {
          subNode.seqNo = index + 1
          const params = {editNodeData: subNode}
          props.updateNodeSeqNo(params).then((res: any) => {
            emits('updateNodeSeqNo', params)
          })
        }
      })
    }
  }
}
const addNode = (clickedNodeData: any, addNodeData: any) => {
  const children = clickedNodeData.children || []
  const node = JSON.parse(JSON.stringify(addNodeData))
  node.treeId = props.treeId
  console.log('addNode:', node)
  const params = {clickedNodeData, addNodeData: node}
  if (props.addNode) {
    props.addNode(params).then((res: any) => {
      // console.log('res:',res.data)
      // 获取后台返回的id作为key
      node.key = res.data
      children.push(node)
      clickedNodeData.children = children
      refreshTree()
      selectNode(node)
      emits('addNode', params)
    })
  } else {
    emits('addNode', params)
  }
}

const deleteNode = (clickedNodeData: any) => {
  const params = {clickedNodeData}
  if (props.deleteNode) {
    props.deleteNode(params).then((res: any) => {
      console.log('delete node from remote and return res:', res)
      reloadTreeData()
    })
  }
  emits('deleteNode', params)
}


/**
 *  选择一个节点，可能是点击选择，也可以是新增之后选择
 *  并触发selectNode事件，将当前的节点为作参数
 */
const selectNode = (node: any) => {
  // 定位到新增的节点
  selectedKeys.value = []
  // @ts-ignore
  selectedKeys.value.push(node.key)
  emits('selectNode', {selectedNode: node})
}

const onSelect = (selectedKeys: any, data: any) => {
  // console.log('onSelect', selectedKeys, data.node)
  selectNode(data.node)
}

const dragMode = DragModeType.onlyToFolder

const onDragEnd = (ev: DragEvent, node: TreeNodeData) => {
  // console.log('onDragEnd', ev, node)
}
const onDragLeave = (ev: DragEvent, node: TreeNodeData) => {
  // console.log('onDragLeave', ev, node)
}
/**
 * 树节点拖动
 * @param dragNode  拖动的节点
 * @param dropNode  放置的目标节点
 * @param dropPosition 通过dropPosition区分是放置在内部还是放置在之后
 */
const onDrop = ({dragNode, dropNode, dropPosition}: any) => {
  const data = treeData.value;
  console.log('onDrop dragNode:', dragNode, ' dropNode:', dropNode, ' dropPosition:', dropPosition)
  if (dragMode === DragModeType.onlyToFolder && dropNode._nodeType !== NodeType.folder && dropNode._nodeType !== NodeType.root && dropPosition === 0) {
    global.$message.info('不能放在叶子节点下')
    return
  }

  const loop = (data: Array<any>, key: string, callback: Function) => {
    data.some((item, index, arr) => {
      if (item.key === key) {
        callback(item, index, arr);
        return true;
      }
      if (item.children) {
        return loop(item.children, key, callback);
      }
      return false;
    });
  };

  // 1、从原数组删除拖动的节点
  loop(data, dragNode.key, (nodeItem: any, index: number, arr: any, dragParams: {
    dragNode: any,
    dropNode: any,
    dropPosition: any
  }) => {
    arr.splice(index, 1);
  });

  // 2、添加拖动的节点到相应的位置
  // dropPosition为0，则表示放在目标节点下
  // dropPosition为负，则表示放在目标节点前
  // dropPosition为正，则表示放在目标节点后
  if (dropPosition === 0) {
    loop(data, dropNode.key, (item: any) => {
      dragNode.pid = dropNode.key
      item.children = item.children || [];
      item.children.push(dragNode);
      // 更新服务端节点
      updateNode(null, dragNode)
      updateNodeSeqNo(dropNode.pid)
    });
  } else {
    loop(data, dropNode.key, (_: any, index: number, arr: any) => {
      dragNode.pid = dropNode.pid
      arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode);
      // 更新服务端节点
      updateNode(null, dragNode)
      updateNodeSeqNo(dropNode.pid)
    });
  }
}

const closeModal = () => {
  currentAction.value = {action: '', title: ''}
}

const reloadTreeData = () => {
  if (props.loadTreeData) {
    const treeDataPromise = props.loadTreeData()
    if (treeDataPromise) {
      props.loadTreeData().then((res: any) => {
        // console.log('loadTreeData:', res)
        treeData.value = [
          {
            treeId: props.treeId,
            pid: '',
            key: props.treeId,
            title: props.treeName,
            iconType: "gl-folder",
            _nodeType: "root",
            seqNo: "0",
            children: []
          }
        ]
        treeData.value[0].children.push(...Utils.ConvertUtil.listToTree({
          data: res.data,
          pid: props.treeId,
          renameId: 'key',
          compareFn: (a: any, b: any) => {
            const aSeq = a.seqNo || 0
            const bSeq = b.seqNo || 0
            return aSeq - bSeq
          }
        }))
      })
    }
  }
}
// 初始化加载
reloadTreeData()
// 对外提供方法
// defineExpose(['reloadTreeData'])
</script>
<style>
.gl-base-tree .arco-tree-node-drag-icon {
  display: none !important;
}

.gl-base-tree .gl-more {
  /*display: none;*/
}

.gl-base-tree:hover .gl-more {
  display: inline-block;
}

.gl-context-menu-item {
  line-height: 2em !important;
  /*padding: 0 !important;*/
  /*margin: 0 !important;*/
}

/*.arco-tree-node .gl-more{*/
/*  display: none;*/
/*}*/
/*.arco-tree-node:hover .gl-more{*/
/*  display: inline-block;*/
/*}*/
</style>
