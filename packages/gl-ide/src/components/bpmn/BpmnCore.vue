<template>
  <div class="main">
    <div class="header">
      <div>
        <BpmnToolbar :lf="LF" />
      </div>
      <div>
        <button type="button" class="btn btn-primary" @click="onPreviewClick">数据预览</button>
      </div>
    </div>
    <div v-if="previewVisible" class="preview-wrap">
      <pre>
        <code class="language-html" v-html="previewData"></code>
      </pre>
    </div>
    <div className="bpmn-example-container">
      <div id="graph" className="viewport"></div>
      <template v-if="LF">
        <BpmnPattern :lf="LF" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlBpmnCore'
}
</script>

<script setup lang="ts">
import '@logicflow/core/dist/style/index.css'
import LogicFlow from '@logicflow/core'
import {
  MiniMap,
  Snapshot,
  Menu,
  SelectionSelect,
  Group
  // BPMNElements, BPMNAdapter
} from '@logicflow/extension'
import { onMounted, ref, createApp, h, watch } from 'vue'
import BpmnPattern from './components/BpmnPattern.vue'
import BpmnToolbar from './components/BpmnToolbar.vue'
import Panels from './components/panels/index.vue'
import { BPMNElements } from './plugin/bpmn-elements/index'
import { BPMNAdapter } from './plugin/bpmn-elements-adapter'
import { messageIcon } from './plugin/bpmn-elements/presets/icons'

const emits = defineEmits([
  'update:modelValue',
  'click',
  'dbclick',
  'blankClick',
  'add',
  'delete',
  'textUpdate'
])
defineProps({
  modelValue: String
})

const LF = ref()
const previewData = ref()
const previewVisible = ref(false)

const config = {
  height: 1000,
  stopScrollGraph: true,
  stopZoomGraph: true,
  metaKeyMultipleSelected: true,
  grid: {
    size: 10,
    type: 'dot',
    config: {
      color: '#e9e9e9'
    }
  },
  keyboard: {
    enabled: true
  },
  snapline: true
}

LogicFlow.use(MiniMap)
LogicFlow.use(BPMNElements)
LogicFlow.use(BPMNAdapter, {
  excludeFields: {
    out: ['properties.multiInstanceType']
  },
  transformer: {
    'bpmn:serviceTask': {
      out(data: any) {
        const {
          properties: { multiInstanceType }
        } = data
        if (multiInstanceType === 'sequential') {
          return {
            json: `<bpmn:multiInstanceLoopCharacteristics isSequential="true" />`
          }
        } else if (multiInstanceType === 'parallel') {
          return {
            json: `<bpmn:multiInstanceLoopCharacteristics isSequential="false" />`
          }
        }
      }
    },
    'bpmn:userTask': {
      out(data: any) {
        const {
          properties: { multiInstanceType }
        } = data
        if (multiInstanceType === 'sequential') {
          return {
            json: `<bpmn:multiInstanceLoopCharacteristics isSequential="true" />`
          }
        } else if (multiInstanceType === 'parallel') {
          return {
            json: `<bpmn:multiInstanceLoopCharacteristics isSequential="false" />`
          }
        }
      }
    }
  }
})
LogicFlow.use(Snapshot)
// LogicFlow.use(Control);
LogicFlow.use(Menu)
LogicFlow.use(SelectionSelect)
LogicFlow.use(Group)

const onPreviewClick = () => {
  if (previewVisible.value) {
    previewVisible.value = false
    previewData.value = ''
    return
  }
  previewVisible.value = true
  // previewData.value = hljs.highlight(
  //   LF.value!.adapterOut(LF.value!.getGraphRawData(), {
  //     transformer: {
  //       "bpmn:messageEventDefinition": {
  //         out(data: any) {
  //           const {
  //             properties: { definitionId },
  //           } = data;
  //           console.log(
  //             definitionId,
  //             `<bpmn:messageEventDefinition id="${definitionId}" />`
  //           );
  //           return {
  //             json: `<bpmn:messageEventDefinition id="${definitionId}" />`,
  //           };
  //         },
  //       },
  //     },
  //   }),
  //   { language: "xml" }
  // ).value;
}

const historyChange = (data: any) => {
  const graphJson = LF.value!.getGraphRawData()
  emits('update:modelValue', graphJson)

  console.log('historyChange getGraphRawData:', graphJson)
}
const elementClick = (data: any) => {
  emits('click', data)
}
const elementDbClick = (data: any) => {
  emits('dbclick', data)
}
const elementDelete = (data: any) => {
  emits('delete', data)
}

const elementAdd = (data: any) => {
  emits('add', data)
}

const textUpdate = (data: any) => {
  emits('textUpdate', data)
}

const blankClick = (data: any) => {
  console.log('blankClick', data)
  emits('blankClick', data)
}
const nodeClick = (data: any) => {}

const edgeClick = (data: any) => {}

onMounted(() => {
  const lf = new LogicFlow({
    ...config,
    container: document.querySelector('#graph') as HTMLElement
  })
  lf.render()
  LF.value = lf
  // 小地图
  // lf.extension.miniMap?.show(0,0)
  lf.on('blank:click', blankClick)
  lf.on('element:click', elementClick)
  lf.on('edge:click', edgeClick)
  lf.on('node:click', nodeClick)
  lf.on('edge:dbclick', elementDbClick)
  lf.on('node:dbclick', elementDbClick)
  lf.on('history:change', historyChange)
  lf.on('text:update', textUpdate)
  lf.on('edge:delete', elementDelete)
  lf.on('node:delete', elementDelete)
  lf.on('edge:dnd-add', elementAdd)
  lf.on('node:dnd-add', elementAdd)
  lf.extension.menu.setMenuConfig({
    nodeMenu: [
      {
        text: '删除',
        callback(node: any) {
          console.log(node)
          lf.deleteNode(node.id)
        }
      }
    ], // 覆盖默认的节点右键菜单
    edgeMenu: false, // 删除默认的边右键菜单
    graphMenu: [] // 覆盖默认的边右键菜单，与false表现一样
  })

  let panel = createApp(
    h(Panels, {
      lf
    })
  )
  const div = document.createElement('div')
  div.id = 'my-panel'
  document.querySelector('#graph')?.appendChild(div)
  panel.mount('#my-panel')

  const [_definition, setDefinition] = lf.useDefinition()

  setDefinition([
    {
      nodes: ['startEvent'],
      definition: [
        {
          type: 'bpmn:messageEventDefinition',
          icon: messageIcon,
          properties: {
            panels: [],
            definitionType: 'bpmn:messageEventDefinition'
          }
        }
      ]
    }
  ])
})

defineExpose({
  /**
   *  获取实例
   */
  getLogicFlow: () => {
    return LF.value
  }
})
</script>

<style lang="less">
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.preview-wrap {
  left: calc(100% - 500px);
  position: relative;
  width: 500px;
  display: flex;
}

pre {
  // position: absolute;
  z-index: 100;
  height: 1000px;
  position: absolute;
  width: 100%;
  overflow: scroll;
  background-color: #dde2e7;
}

pre::-webkit-scrollbar {
  display: none;
}

.lf-menu {
  position: absolute;
  display: none;
  background: #fff;
  padding: 10px 0;
  margin: 0 0 0 10px;
  border-radius: 3px;
  border: 1px solid #efefee;
  width: 200px;
  z-index: 999;
}

.lf-menu > li {
  list-style: none;
  padding: 3px 12px;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  transition: all 0.12s ease-in-out;
  position: relative;
  z-index: 1000;
}

.lf-node-selected {
  // 选中节点时的格式
  color: #165dff;
}

circle.lf-node-anchor {
  stroke: #165dff;
}

.lf-node-content {
  rect,
  circle {
    stroke: #165dff;
  }

  path {
    fill: #165dff
  }
}

.lf-edge {
  polyline {
    stroke: #165dff;
  }

  marker{
    path{
      stroke: #165dff;
      fill:#165dff
    }
  }
}
</style>
