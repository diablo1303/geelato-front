<script lang="ts">
/**
 *  表达式编辑器
 */
export default {
  name: 'GlExpressionSetter'
}
</script>
<script lang="ts" setup>

import {ref} from "vue";
import {useSystemVarsTreeData, functionalFormulaTreeData, useComponentInstTreeData} from "./varsMeta";
import {utils} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  是否显示Input输入框，显示input时，不显示button，否则显示button
   *  如果某属性的值，可以有自己的配置方式，同时可以支持表达式进行配置，此时不需要显示input
   *  如果某属性的值，本身就是表达式，此时需要显示input
   */
  showInput: {
    type: Boolean,
    default() {
      return false
    }
  }
})
const monacoEditor = ref()
const systemVarsTree = ref()
const mv = ref(props.modelValue)
const inputMv = ref(props.modelValue)
// watch(mv, () => {
//   emits('update:modelValue', mv.value)
// })

const valueExpressModalVisible = ref(false)
/**
 * 打开值表达式设置窗口
 */
const openValueExpressModal = () => {
  valueExpressModalVisible.value = true
}
const clearValueExpress = () => {
  // const propertySetterMeta = currentOpenModalPropertySetterMeta
  mv.value = ''
  // @ts-ignore
  // componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name] = ''
  valueExpressModalVisible.value = false
  inputMv.value = mv.value
  emits('update:modelValue', mv.value)
}
const handleOk = () => {
  inputMv.value = mv.value
  valueExpressModalVisible.value = false
  emits('update:modelValue', mv.value)
}

const handleCancel = () => {
  // emits('update:modelValue', mv.value)
  mv.value = props.modelValue
}

const setKeys = (treeItems: Array<any>) => {
  function setId(treeNode: any) {
    treeNode.key = utils.gid()
    if (treeNode.children && treeNode.children.length > 0) {
      treeNode.children.forEach((subTreeNode: any) => {
        setId(subTreeNode)
      })
    }
  }

  treeItems.forEach((treeNode: any) => {
    setId(treeNode)
  })
  return treeItems
}

/**
 * 将根节点到找到节点的所有层节点的key用“.”连接起来
 * @param tree 查找的树
 * @param key  查找的节点key
 */
const getKeyPath = (tree: any, key: string): string => {
  if (!tree || !Array.isArray(tree)) {
    return '';
  }
  const nodeKeyPath: string[] = []
  const findNode = (nodes: any[], key: string, nodeKeyPath: string[]): number => {
    for (const index in nodes) {
      const node = nodes[index]
      if (node.key === key) {
        const pathPart = (node._pathName === undefined ? node._code : node._pathName) + (node._brackets || '')
        // 有指定_pathName时优先用，无则用key，则_pathName为''则表示取该值，为undefined时，表示用key
        nodeKeyPath.push(pathPart)
        return Number.parseInt(index)
      } else if (node.children && node.children.length > 0) {
        const foundIndex = findNode(node.children, key, nodeKeyPath);
        if (foundIndex >= 0) {
          const pathPart = (node._pathName === undefined ? node._code : node._pathName) + (node._brackets || '')
          // 有指定_pathName时优先用，无则用key，则_pathName为''则表示取该值，为undefined时，表示用key
          nodeKeyPath.push(pathPart)
          return Number.parseInt(index)
        }
      }
    }
    return -1;
  };
  findNode(tree, key, nodeKeyPath);
  nodeKeyPath.reverse()
  if (nodeKeyPath.length > 0) {
    // replace掉_pathName为‘’时产生的连续“.”
    return `$gl.${nodeKeyPath.join('.')}`.replace(/\.+/g, '.')
  } else {
    return '';
  }
}

const _systemVarsTreeData = setKeys(useSystemVarsTreeData())
const _functionalFormulaTreeData = setKeys(functionalFormulaTreeData)
const _componentInstTreeData = setKeys(useComponentInstTreeData())

const selectNode = (selectedKeys: any, data: any, treeData: any) => {
  const path = getKeyPath(treeData, data.node.key)
  monacoEditor.value.replaceSelectOrInsert(path)
  console.log('selectNode:', selectedKeys, 'data:', data, 'path:', path)
}

</script>

<template>
  <div class="gl-expression-setter">
    <a-input v-if="showInput" v-model="inputMv" @click="openValueExpressModal" readonly></a-input>
    <a-button v-if="!showInput" size="mini" @click="openValueExpressModal"
              :type="mv?'primary':''"
              style="padding: 0 0.1em;height: 2.6em;font-weight: 700">{ / }
    </a-button>
    <a-modal title="编辑表达式" v-model:visible="valueExpressModalVisible"
             :width="1100"
             :modal-style="{height:'700px',maxHeight:'700px'}"
             :body-style="{padding:0}"
             :mask-style="{background:'rgba(0, 0, 0, 0.25)'}"
             @ok="handleOk"
             @cancel="handleCancel">
      <div class="gl-expression-setter-editor" style="display: flex;" v-if="valueExpressModalVisible">
        <div style="flex: auto;border-right: solid 1px #d7d6d6">
          <!--      <a-textarea v-model="mv" placeholder="在此输入..."></a-textarea>-->
          <div style="max-height: 310px">
            <GlMonacoEditor ref="monacoEditor" v-model="mv" :height="310"
                            language="javascript"></GlMonacoEditor>
          </div>
          <!--          <a-button style="float: right" type="outline" size="mini" status="danger"-->
          <!--                    @click="clearValueExpress">清除绑定-->
          <!--          </a-button>-->
          <div style="padding:15px;border-top: #a7b1bd 1px solid">
            <h4 style="font-weight: 600">该属性的值</h4>
            如果设置了该变量绑定，则以该变量绑定计算的结果为优先。
            <h4 style="font-weight: 600">用法</h4>
            输入框内默认支持变量，写法和 JS 写法完全一致。
            <div>变量: $gl.xxx</div>
            <div>字符串: "我是字符串，我有引号"</div>
            <div>数字: 123</div>
            <div>布尔值: true / false</div>
            <div>对象: { name: "王一" }</div>
            <div>数组: ["1", "2"]或[1, 2]</div>
            <div>空值: null</div>
          </div>
        </div>
        <div style="flex: 1;min-width: 420px;max-height: 600px;overflow-y: auto">
          <a-collapse size="small" :default-active-key="['1']" :bordered="false">
            <a-collapse-item header="系统变量" key="1">
              <a-tree ref="systemVarsTree" :default-expanded-keys="[]" size="small" blockNode
                      :data="_systemVarsTreeData"
                      @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_systemVarsTreeData)">
                <template #title="{_code,title}">
                  <span>{{ _code }}<span class="gl-title">{{ title }}</span></span>
                </template>
                <template #extra="{_type}">
                  <span class="gl-extra">{{ _type }}</span>
                </template>
              </a-tree>
            </a-collapse-item>
            <a-collapse-item header="自定义变量" key="2">
              Coming Soon...
            </a-collapse-item>
            <a-collapse-item header="组件实例变量" key="3">
              <a-tree ref="systemVarsTree" :default-expanded-keys="[]" size="small" blockNode
                      :data="_componentInstTreeData"
                      @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_componentInstTreeData)">
                <template #title="{_code,title,_value,_description}">
                  <a-tooltip background-color="#165DFF">
                    <template #content>
                      {{_description}}
                    </template>
                    <span>{{ _code }}
                      <!--  title和_code相同，则只显示_code -->
                    <span class="gl-title" style="margin-left: 0!important;">{{ title === _code ? '' : title }}</span>
                  </span>
                  </a-tooltip>
                </template>
                <template #extra="{_type}">
                  <span class="gl-extra">{{ _type }}</span>
                </template>
              </a-tree>
            </a-collapse-item>
            <a-collapse-item header="函数公式" key="4">
              <a-tree ref="systemVarsTree" :default-expanded-keys="[]" size="small" blockNode
                      :data="_functionalFormulaTreeData"
                      @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_functionalFormulaTreeData)">
                <template #title="{_code,title}">
                  <span>{{ _code }}<span class="gl-title">{{ title }}</span></span>
                </template>
                <template #extra="{_type}">
                  <span class="gl-extra">{{ _type }}</span>
                </template>
              </a-tree>
            </a-collapse-item>
          </a-collapse>
        </div>
      </div>
      <template #footer>
        <a-space>
          <a-button type="outline" status="danger" @click="clearValueExpress">清除绑定</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<style>

.gl-expression-setter-editor .arco-collapse-item-content {
  background-color: #FFF;
  padding-left: 14px;
}

.gl-expression-setter-editor .arco-tree-node {
  /*cursor: none;*/
}

.gl-expression-setter-editor .arco-tree-node:hover {
  /*background-color: #f6f6f6;*/
}

.gl-expression-setter-editor .arco-tree-node .gl-title {
  color: #8f8f8f;
  margin-left: 1em;
}

.gl-expression-setter-editor .arco-tree-node .gl-extra {
  background: rgb(229, 230, 235);
  color: rgb(134, 144, 156);
  min-width: 4em;
  text-align: center;
  border-radius: 10%;
  margin-left: 0.5em;
  vertical-align: center;
  cursor: default;
}

.gl-expression-setter-editor .arco-tree-node-title {
  cursor: pointer;
}
</style>
