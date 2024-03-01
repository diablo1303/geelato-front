<template>
  <div class="gl-ide-plugin-form-designer" style="width: 100%; min-height: 500px">
    <a-row>
      <a-col
        :span="5"
        style="border-right: 1px solid #f2f2f2; padding: 0.5em; overflow-y: auto"
        :style="sidebarStyle"
      >
        <KeepAlive>
          <GlCommandEditorSidebar></GlCommandEditorSidebar>
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
                :key="mv.id"
                :glComponentInst="mv.__commandBlock"
                @update="updateInstance"
              ></BlockPage>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title>
              <GlIconfont type="gl-eye" />
              查看生成的配置JSON
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
              查看生成的脚本JS
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
                >删除</a-button
              >
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
  name: 'CommandEditor'
}
</script>
<script lang="ts" setup>
import { onMounted, type PropType, ref, watch } from 'vue'
import { Action, ComponentInstance } from '@geelato/gl-ui-schema'
import { componentStoreFactory, useThemeStore } from '@geelato/gl-ide'
import GlCommandEditorSidebar from './GlCommandEditorSidebar.vue'
import { blocksHandler } from './blocks/BlockHandler'
import BlockPage from '../../../components/stage/BlockPage.vue'
import './blocks/style.css'
import { useGlobal } from '@geelato/gl-ui'

const props = defineProps({
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentBlockStore'
    }
  },
  action: {
    type: Object as PropType<Action>,
    default() {
      return new Action()
    }
  }
})

const themeStore = useThemeStore()

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
const componentStore = componentStoreFactory.useComponentStore('useComponentBlockStore')
const emits = defineEmits(['update:action', 'updateAction'])

const mv = ref(props.action)

const mvStr = ref(JSON.stringify(mv.value))
const mvBodyStr = ref('')
watch(mv, () => {
  mvStr.value = mv.value ? JSON.stringify(mv.value) : ''
})
onMounted(() => {
  reset()
})

const reset = () => {
  mv.value = props.action
}

// const findBlockMeta = (componentName: string) => {
//   return componentMaterialStore.findMetaByName(componentName)
// }
const refreshFlag = ref(true)

const updateInstance = (instance: ComponentInstance) => {
  // console.log('updateInstance() > block:', instance)
  mv.value.__commandBlock = JSON.parse(JSON.stringify(instance))
  generateScript()
  // refreshFlag.value = false
  // nextTick(() => {
  //   refreshFlag.value = true
  // })
  emits('update:action', mv.value)
  emits('updateAction', mv.value)
}

const generateScript = () => {
  mv.value.body = blocksHandler.parseToScript(componentStore.currentComponentTree[0])
  mvStr.value = JSON.stringify(mv.value)
  mvBodyStr.value = mv.value.body
}

/**
 *  将粘贴板中的数据转成组件实例
 */
const insertAfterCurrentSelectedComponent = async () => {
  const result = await componentStore.insertAfterCurrentSelectedComponentFromClipboard()
  if (!result.success) {
    useGlobal().$notification.error(result.message)
  }
}

/**
 *  将粘贴板中的数据转成组件实例
 */
// const insertAfterCurrentSelectedComponent = async () => {
//   const clipboardItems = await window.navigator.clipboard.read()
//   let textHtml, textPlain
//   for (const clipboardItem of clipboardItems) {
//     for (const type of clipboardItem.types) {
//       const item = await clipboardItem.getType(type)
//       if (item && item.type == 'text/html') {
//         textHtml = await item.text()
//       }
//       if (item && item.type == 'text/plain') {
//         textPlain = await item.text()
//       }
//     }
//   }
//   if (textPlain) {
//     try {
//       const inst = JSON.parse(textPlain.toString())
//       if (componentStore.checkComponent(inst)) {
//         componentStore.insertAfterCurrentSelectedComponent(inst)
//       } else {
//         useGlobal().$notification.error(
//           '将粘贴版中的数据转换成组件实例失败，不是正确的组件实例格式'
//         )
//       }
//     } catch (e: any) {
//       useGlobal().$notification.error('将粘贴版中的数据转换成JSON失败，不是有效的组件实例')
//       console.error(e)
//     }
//   }
//   console.log('clipboardItems', clipboardItems, textHtml, textPlain)
// }

onMounted(() => {
  // setEditorValue()
})

reset()
</script>

<style></style>
