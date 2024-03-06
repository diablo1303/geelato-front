<script lang="ts">
/**
 *  表达式编辑器
 */
export default {
  name: 'GlExpressionSetter'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { type Ref, ref } from 'vue'
import {
  useSystemVarsTreeData,
  functionalFormulaTreeData,
  useComponentInstTreeData,
  useSrvTreeData, useActionVarsTreeData
} from './varsMeta'
import { useGlobal, utils } from '@geelato/gl-ui'
import { useConstTreeData, useDictTreeData, useWorkflowTreeData } from './enumMeta'
import GlExpressionVarsTree from './GlExpressionVarsTree.vue'
const global = useGlobal()
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
  },
  placeholder: String
})
const monacoEditor = ref()
const systemVarsTree = ref()
const mv = ref(props.modelValue)
const inputMv = ref(props.modelValue)
// watch(mv, () => {
//   emits('update:modelValue', mv.value)
// })

const _systemVarsTreeData: Ref<any[]> = ref([])
const _actionVarsTreeData: Ref<any[]> = ref([])
const _functionalFormulaTreeData: Ref<any[]> = ref([])
const _componentInstTreeData: Ref<any[]> = ref([])
const _constTreeData: Ref<any[]> = ref([])
const _dictTreeData: Ref<any[]> = ref([])
const _workflowTreeData: Ref<any[]> = ref([])
const _srvTreeData: Ref<any[]> = ref([])
const visibleValueExpressModal = ref(false)

/**
 * 打开值表达式设置窗口
 */
const openValueExpressModal = async () => {
  visibleValueExpressModal.value = true
  _systemVarsTreeData.value = setKeys(useSystemVarsTreeData(global))
  _actionVarsTreeData.value = setKeys(useActionVarsTreeData())
  _functionalFormulaTreeData.value = setKeys(functionalFormulaTreeData)
  _componentInstTreeData.value = setKeys(useComponentInstTreeData())
  _constTreeData.value = setKeys(await useConstTreeData())
  _dictTreeData.value = setKeys(await useDictTreeData())
  _workflowTreeData.value = setKeys(await useWorkflowTreeData())
  _srvTreeData.value = setKeys(useSrvTreeData())
}
const clearValueExpress = () => {
  // const propertySetterMeta = currentOpenModalPropertySetterMeta
  mv.value = ''
  // @ts-ignore
  // componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name] = ''
  visibleValueExpressModal.value = false
  inputMv.value = mv.value
  emits('update:modelValue', mv.value)
}
const handleOk = () => {
  // 由于代码做了格式化，会自动增加“;”换行等，需处理掉
  mv.value = mv.value ? mv.value.replace(new RegExp('[;,\\s]*$'), '') : ''
  inputMv.value = mv.value
  visibleValueExpressModal.value = false
  emits('update:modelValue', mv.value)
}

const handleCancel = () => {
  // emits('update:modelValue', mv.value)
  mv.value = props.modelValue
}

const setKeys = (treeItems: Array<any>) => {
  function setId(treeNode: any) {
    treeNode.key = utils.gid('id')
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
    return ''
  }
  const nodeKeyPath: string[] = []
  const findNode = (nodes: any[], key: string, nodeKeyPath: string[]): number => {
    for (const index in nodes) {
      const node = nodes[index]
      if (node.key === key) {
        const pathPart =
          (node._pathName === undefined ? node._code : node._pathName) + (node._brackets || '')
        // 有指定_pathName时优先用，无则用key，则_pathName为''则表示取该值，为undefined时，表示用key
        nodeKeyPath.push(pathPart)
        return Number.parseInt(index)
      } else if (node.children && node.children.length > 0) {
        const foundIndex = findNode(node.children, key, nodeKeyPath)
        if (foundIndex >= 0) {
          const pathPart =
            (node._pathName === undefined ? node._code : node._pathName) + (node._brackets || '')
          // 有指定_pathName时优先用，无则用key，则_pathName为''则表示取该值，为undefined时，表示用key
          nodeKeyPath.push(pathPart)
          return Number.parseInt(index)
        }
      }
    }
    return -1
  }
  findNode(tree, key, nodeKeyPath)
  nodeKeyPath.reverse()
  if (nodeKeyPath.length > 0) {
    // replace掉_pathName为‘’时产生的连续“.”
    return `$gl.${nodeKeyPath.join('.')}`.replace(/\.+/g, '.')
  } else {
    return ''
  }
}

const selectNode = (selectedKeys: any, data: any, treeData: any) => {
  const path = getKeyPath(treeData, data.node.key)
  monacoEditor.value.replaceSelectOrInsert(path)
  // console.log('selectNode:', selectedKeys, 'data:', data, 'path:', path)
}

const selectInstNode = (selectedKeys: any, data: any, treeData: any) => {
  console.log('selectNode:', selectedKeys, 'data:', data)
  if (data.node._flag === 'moreInsts') {
    global.$notification.info({ content: '待支持' })
  } else {
    const path = getKeyPath(treeData, data.node.key)
    if (data.node._flag === 'ref') {
      console.log('xxx', path.replace('methods.', ''))
      monacoEditor.value.replaceSelectOrInsert(path.replace('methods.', ''))
    } else {
      monacoEditor.value.replaceSelectOrInsert(path)
    }

    // console.log('selectNode:', selectedKeys, 'data:', data, 'path:', path)
  }
}

const selectConstNode = async (selectedKeys: any, data: any, treeData: any) => {
  let code = data.node._code
  if (code) {
    if (typeof code === 'function') {
      code = await code()
    }
    monacoEditor.value.replaceSelectOrInsert(code)
  }
}

const replaceSelectOrInsert = (content: any) => {
  monacoEditor.value.replaceSelectOrInsert(typeof content === 'string' ? `"${content}"` : content)
}

const expendDictItems = <{ [key: string]: any }>ref({})
const visibleDictItemModal = ref(false)
const expendDict = async (code: any) => {
  if (code && typeof code === 'function') {
    expendDictItems.value = JSON.parse(await code())
  }
  visibleDictItemModal.value = true
}
const closeDict = () => {
  visibleDictItemModal.value = false
}

const selectDictItem = (key: any) => {
  monacoEditor.value.replaceSelectOrInsert(`"${key}"`)
  visibleDictItemModal.value = false
}
</script>

<template>
  <div class="gl-expression-setter">
    <a-input
      v-if="showInput"
      v-model="inputMv"
      @click="openValueExpressModal"
      readonly
      :placeholder="placeholder"
      style="color: blue"
    >
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
    </a-input>
    <a-button
      v-if="!showInput"
      size="mini"
      @click="openValueExpressModal"
      :type="mv ? 'primary' : ''"
      style="padding: 0 0.1em; height: 2.6em; font-weight: 700; border: none"
      >{ / }
    </a-button>
    <a-modal
      title="编辑脚本(JavaScript)"
      v-model:visible="visibleValueExpressModal"
      :width="1300"
      :modal-style="{ height: '800px', maxHeight: '800px' }"
      :body-style="{ padding: 0, overflow: 'hidden' }"
      :mask-style="{ background: 'rgba(0, 0, 0, 0.25)' }"
      @ok="handleOk"
      @cancel="handleCancel"
      draggable
    >
      <div
        class="gl-expression-setter-editor"
        style="display: flex"
        v-if="visibleValueExpressModal"
      >
        <div style="flex: auto; border-right: solid 1px #d7d6d6">
          <!--      <a-textarea v-model="mv" placeholder="在此输入..."></a-textarea>-->
          <div>
            <GlMonacoEditor
              ref="monacoEditor"
              v-model="mv"
              :height="345"
              language="typescript"
              style="max-height: 345px"
            ></GlMonacoEditor>
          </div>
          <!--          <a-button style="float: right" type="outline" size="mini" status="danger"-->
          <!--                    @click="clearValueExpress">清除绑定-->
          <!--          </a-button>-->
          <div style="padding: 15px; border-top: #a7b1bd 1px solid">
            <h4 style="font-weight: 600">该属性的值</h4>
            如果设置了该变量绑定，则以该变量绑定计算的结果为优先。
            <h4 style="font-weight: 600">用法</h4>
            输入框内默认支持变量，写法和 JavaScript 写法完全一致，注意不是TypeScript，如const a:any
            = 1，这种写法会报告。
            <div>
              变量:
              $gl.vars.xxx，xxx为变量名，属性面板中，变量名定义时，或一些返回值变量中，可以简写为xxx，同$gl.vars.xxx，但在使用时需要用完整的写法：$gl.vars.xxx。
            </div>
            <div>字符串: "我是字符串，我有引号"</div>
            <div>数字: 123</div>
            <div>布尔值: true / false</div>
            <div>对象: { name: "王一" }</div>
            <div>数组: ["1", "2"]或[1, 2]，空值: null</div>
          </div>
        </div>
        <div style="flex: 1; min-width: 500px; max-height: 700px; overflow-y: auto">
          <a-collapse size="small" :default-active-key="['5']" :bordered="false">
            <a-collapse-item header="系统变量" key="1">
              <GlExpressionVarsTree :data="_systemVarsTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_systemVarsTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="动作变量" key="2">
              <GlExpressionVarsTree :data="_actionVarsTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_actionVarsTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="组件实例" key="3">
              <GlExpressionVarsTree :data="_componentInstTreeData" @select="(selectedKeys:any,data:any)=>selectInstNode(selectedKeys,data,_componentInstTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="服务接口" key="4">
              <GlExpressionVarsTree :data="_srvTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_srvTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="流程定义" key="5">
              <GlExpressionVarsTree :data="_workflowTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_workflowTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="数据字典" key="6">
<!--              <GlExpressionVarsTree :data="_dictTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_dictTreeData)">-->
<!--                <template #extra>-->
<!--                  <a-button-->
<!--                      v-if="['系统常量'].indexOf(title) === -1"-->
<!--                      size="mini"-->
<!--                      type="text"-->
<!--                      shape="round"-->
<!--                      @click="expendDict(_code)"-->
<!--                  >选择字典值-->
<!--                  </a-button>-->
<!--                </template>-->
<!--              </GlExpressionVarsTree>-->
              <a-tree
                ref="enumVarsTree"
                :default-expanded-keys="[]"
                size="small"
                blockNode
                :data="_dictTreeData"
                @select="(selectedKeys:any,data:any)=>selectConstNode(selectedKeys,data,_dictTreeData)"
              >
                <template #title="{ _code, title, _value, _description }">
                  <a-tooltip v-if="_description" background-color="#165DFF">
                    <template #content>
                      {{ _description }}
                    </template>
                    <span>
                      <span class="gl-title" style="color: #1d2129; margin-left: 0 !important">{{
                        title
                      }}</span>
                    </span>
                  </a-tooltip>
                  <span v-else class="gl-title" style="color: #1d2129; margin-left: 0 !important">
                    <span>{{ title }}</span>
                  </span>
                </template>
                <template #extra="{ _code, title, _type }">
                  <a-button
                    v-if="['系统常量'].indexOf(title) === -1"
                    size="mini"
                    type="text"
                    shape="round"
                    @click="expendDict(_code)"
                    >选择字典值
                  </a-button>
                  <span class="gl-extra">{{ _type }}</span>
                </template>
              </a-tree>
            </a-collapse-item>
            <a-collapse-item header="函数公式" key="7">
              <GlExpressionVarsTree :data="_functionalFormulaTreeData" @select="(selectedKeys:any,data:any)=>selectNode(selectedKeys,data,_functionalFormulaTreeData)"></GlExpressionVarsTree>
            </a-collapse-item>
            <a-collapse-item header="系统常量" key="8">
              <div style="display: flex; line-height: 2.4em">
                <div style="width: 5em; text-align: right; margin-right: 1em">颜色值</div>
                <div style="flex: auto">
                  <GlColor @update:modelValue="replaceSelectOrInsert"></GlColor>
                </div>
              </div>
              <div style="display: flex; line-height: 2.4em">
                <div style="width: 5em; text-align: right; margin-right: 1em">图标类型</div>
                <div style="flex: auto">
                  <GlIconfontSelect @update:modelValue="replaceSelectOrInsert"></GlIconfontSelect>
                </div>
              </div>
              <a-tree
                  ref="enumVarsTree"
                  :default-expanded-keys="[]"
                  size="small"
                  blockNode
                  :data="_constTreeData"
                  @select="(selectedKeys:any,data:any)=>selectConstNode(selectedKeys,data,_constTreeData)"
              >
                <template #title="{ _code, title, _value, _description }">
                  <a-tooltip v-if="_description" background-color="#165DFF">
                    <template #content>
                      {{ _description }}
                    </template>
                    <span>
                      <span
                          class="gl-title"
                          style="color: #1d2129; margin-left: 0 !important"
                          @select="(selectedKeys:any,data:any)=>selectConstNode(selectedKeys,data,_constTreeData)"
                      >{{ title }}</span
                      >
                    </span>
                  </a-tooltip>
                  <span v-else class="gl-title" style="color: #1d2129; margin-left: 0 !important"
                  >{{ title }}
                  </span>
                </template>
                <template #extra="{ _type }">
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
    <a-modal
      title="选择字典值"
      v-model:visible="visibleDictItemModal"
      :footer="false"
      @ok="handleOk"
      @cancel="closeDict"
    >
      <a-space wrap>
        <a-tag
          v-for="key of Object.keys(expendDictItems)"
          style="cursor: pointer"
          clore="blue"
          @click="selectDictItem(key)"
        >
          {{ expendDictItems[key] }}
        </a-tag>
      </a-space>
    </a-modal>
  </div>
</template>

<style>
.gl-expression-setter-editor .arco-collapse-item-content {
  background-color: #fff;
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