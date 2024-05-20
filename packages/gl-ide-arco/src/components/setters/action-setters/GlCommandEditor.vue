<template>
  <div class="gl-command-editor" style="width: 100%; min-height: 500px">
    <a-row>
      <a-col
        :span="5"
        style="border-right: 1px solid #f2f2f2; padding: 0.5em; overflow-y: auto"
        :style="sidebarStyle"
      >
        <KeepAlive>
          <GlCommandEditorSidebar :componentStoreId="componentStoreId"></GlCommandEditorSidebar>
        </KeepAlive>
      </a-col>
      <a-col
        :span="12"
        style="border-right: 1px solid #f2f2f2; padding: 0.5em; overflow-y: auto"
        :style="mainStyle"
      >
        <a-tabs @change="generateScript">
          <a-tab-pane key="1">
            <template #title>
              <GlIconfont type="gl-setting" />
              设计
            </template>
            <div style="width: 100%; line-height: 2em; min-height: 38em">
              <BlockPage
                v-if="refreshFlag"
                :componentStoreId="componentStoreId"
                :key="mv.id"
                :glComponentInst="mv.__commandBlock"
                @update="updateInstance"
              ></BlockPage>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title>
              <GlIconfont type="gl-eye" />
              生成的配置JSON
            </template>
            <div style="padding: 2px 4px">
              <GlMonacoEditor
                v-if="mvStr"
                ref="jsonMonacoEditor"
                v-model="mvStr"
                :height="editorHeight"
                readOnly="true"
                language="json"
              ></GlMonacoEditor>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #title>
              <GlIconfont type="gl-eye" />
              生成的脚本JS
            </template>
            <div style="padding: 2px 4px">
              <GlMonacoEditor
                v-if="mvBodyStr"
                ref="jsMonacoEditor"
                v-model="mvBodyStr"
                language="typescript"
                :height="editorHeight"
                readOnly="true"
              ></GlMonacoEditor>
            </div>
          </a-tab-pane>
          <template #extra>
            <a-button-group type="primary" size="mini">
              <a-button @click="copyAll" title="复制整个动作动作">复制动作</a-button>
              <a-button @click="pasteAll">插入</a-button>
            </a-button-group>
          </template>
        </a-tabs>
      </a-col>
      <a-col
        :span="7"
        style="border-right: 1px solid #f2f2f2; padding: 0.5em; overflow-y: auto"
        :style="settingStyle"
      >
        <template
          v-if="
            componentStore.currentSelectedComponentId &&
            !['GlDndPlaceholder', 'GlPage'].includes(componentStore.currentSelectedComponentName)
          "
        >
          <div style="border-bottom: 1px solid #f2f2f2; padding: 0.5em">
            <span style="font-weight: 600">
              {{ componentStore.currentSelectedComponentMeta?.title }}
            </span>
            <a-button-group style="float: right" type="primary" size="mini" shape="round">
              <a-button
                @click="componentStore.switchCurrentSelectedComponentStatus"
                title="点击启用或停用该指令块"
              >
                {{
                  componentStore.currentSelectedComponentInstance?._disabled === true
                    ? '点击启用'
                    : '点击停用'
                }}
              </a-button>
              <!--              <a-button @click="componentStore.copyCurrentSelectedComponent"> 复制插入</a-button>-->
              <a-button @click="componentStore.copyCurrentSelectedComponentToClipboard">
                复制
              </a-button>
              <a-button
                @click="insertAfterCurrentSelectedComponent"
                title="将粘贴板的组件插入到当前选中的组件之后"
              >
                插入
              </a-button>
              <a-button
                status="danger"
                @click="componentStore.deleteCurrentSelectedComponentInst('')"
                >删除
              </a-button>
            </a-button-group>
          </div>
          <GlComponentPropertiesSetter
            :key="componentStore.currentSelectedComponentId"
            :componentMeta="componentStore.currentSelectedComponentMeta"
            :componentInstance="componentStore.currentSelectedComponentInstance"
          />
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlCommandEditor'
}
export type GenerateScriptConfig = {
  // 脚本头，如用于后端时，自动添加“function(ctx){”及Java.Type等引用全局对象
  header: string
  // 脚本尾，如用于后端时，自动添加"}"结束方法
  footer: string
}
</script>
<script lang="ts" setup>
import { onMounted, type PropType, ref, watch } from 'vue'
import { Action, ComponentInstance } from '@geelato/gl-ui-schema'
import { useGlobal } from '@geelato/gl-ui'
import { componentStoreFactory, useThemeStore, useActionStore } from '@geelato/gl-ide'
import GlCommandEditorSidebar from './GlCommandEditorSidebar.vue'
import { blocksHandler } from './BlockHandler'
import BlockPage from '../../../components/stage/BlockPage.vue'
import './style.css'


const props = defineProps({
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentBrowserBlockStore'
    }
  },
  action: {
    type: Object as PropType<Action>,
    default() {
      return new Action()
    }
  },
  /**
   * 生成脚本配置
   * 添加脚本头和脚本尾
   */
  generateScriptConfig: {
    type:Object as PropType<GenerateScriptConfig>,
    default() {
      return {
        header:'',
        footer:''
      }
    }
  }
})
const global = useGlobal()
const themeStore = useThemeStore()
const actionStore = useActionStore()
const mainHeight = themeStore.modalBodyHeight + 'px'
const editorHeight = themeStore.modalBodyHeight - 76
const sidebarStyle = ref({
  height: mainHeight,
  'min-height': mainHeight,
  'max-height': mainHeight
})
const mainStyle = ref({
  height: mainHeight,
  'min-height': mainHeight,
  'max-height': mainHeight
})
const settingStyle = ref({
  height: mainHeight,
  'min-height': mainHeight,
  'max-height': mainHeight
})

// const componentMaterialStore = useComponentMaterialStore()
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
const emits = defineEmits(['update:action', 'updateAction'])

const mv = ref(props.action)
actionStore.setAction(props.action)

const mvStr = ref(JSON.stringify(mv.value))
const mvBodyStr = ref('')
watch(mv, () => {
  mvStr.value = mv.value ? JSON.stringify(mv.value) : ''
})
const refreshFlag = ref(true)

const reset = () => {
  mv.value = props.action
  actionStore.setAction(props.action)
}

/**
 * 脚本块有调整时，会触发更新实例
 * 进一步的会生成json、生成js
 * @param instance
 */
const updateInstance = (instance: ComponentInstance) => {
  // console.log('updateInstance() > block:', instance)
  mv.value.__commandBlock = JSON.parse(JSON.stringify(instance))
  generateScript()
  // 基于当前动作创建变量，以便于在面板中可以选择变量插入
  actionStore.generateVars()
  // 检查是否存在同名的变量
  // TODO
  // console.log('actionStore.vars', actionStore.vars)
  emits('update:action', mv.value)
  emits('updateAction', mv.value)
}

const generateScript = () => {
  mv.value.body = `${props.generateScriptConfig.header}${blocksHandler.parseToScript(componentStore.currentComponentTree[0])}${props.generateScriptConfig.footer}`
  mvStr.value = JSON.stringify(mv.value)
  mvBodyStr.value = mv.value.body
}

/**
 *  将粘贴板中的数据转成组件实例
 */
const insertAfterCurrentSelectedComponent = async () => {
  const result = await componentStore.insertAfterCurrentSelectedComponentFromClipboard()
  if (!result.success) {
    global.$notification.error(result.message)
  }
}

const copyAll = () => {
  const result = componentStore.copyCurrentComponentTreeToClipboard(false)
  console.log('copyAll', result)
}

const pasteAll = () => {
  const selectedInst = componentStore.currentSelectedComponentInstance
  if (selectedInst && selectedInst.id) {
    // 如果当前选中的组件是GlPage，则选中GlPage的最后一个子组件，以便直接粘贴到该子组件之后。
    if (selectedInst.componentName === 'GlPage') {
      componentStore.setCurrentSelectedComponent(
        selectedInst.children[selectedInst.children.length - 1]
      )
    }
    componentStore.insertAfterCurrentSelectedComponentFromClipboard().then((result: any) => {
      if (result.success === false) {
        global.$notification.error(result?.message)
      }
    })
  } else {
    global.$notification.error('请先选择一个组件，作为插入的目标组件。')
  }
}

reset()

onMounted(() => {
  reset()
})
</script>

<style></style>
