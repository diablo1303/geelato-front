<template>
  <div v-if="componentInstance">
    <a-collapse :default-active-key="defaultActiveKey" expand-icon-position="right">
      <a-collapse-item
        v-for="(actionMeta, actionMetaIndex) in componentMeta.actions"
        :header="actionMeta.name + ' ' + actionMeta.title"
        :key="actionMetaIndex"
        :title="actionMeta.description"
      >
        <div style="padding: 0 1em">
          <GlArrayBaseSetter
            :key="actionMetaIndex"
            v-slot:default="slotProps"
            v-model="actionGroup[actionMeta.name]"
            :defaultItemForAdd="getDefaultItemForAdd(actionMeta)"
            @addItem="onAddAction"
            @removeItem="onDeleteAction"
          >
            <div style="width: 100%; display: flex; margin-bottom: 1px">
              <div style="flex: 1">
                <a-tooltip
                  content="在同一事件下，如同在click事件下的动作不能全命名为click，名称需唯一。另外，若该动作已被其它动作引用，修改此名称时，会导致对该动用的引用不正常"
                >
                  <a-input
                    v-model="actionGroup[actionMeta.name][slotProps.index].name"
                    placeholder="名称需唯一"
                  ></a-input>
                </a-tooltip>
              </div>
              <div style="flex: 1">
                <a-tooltip content="可任意修改名称，不影响引用">
                  <a-input
                    v-model="actionGroup[actionMeta.name][slotProps.index].title"
                    title="可任意修改名称，不影响引用"
                  ></a-input>
                </a-tooltip>
              </div>
              <div style="flex: 0 0 2em; text-align: center; line-height: 2em">
                <GlIconfont
                  type="gl-thunderbolt"
                  @click="
                    openActionSetter(
                      actionGroup[actionMeta.name][slotProps.index],
                      actionMeta
                    )
                  "
                  style="cursor: pointer"
                ></GlIconfont>
              </div>
            </div>
          </GlArrayBaseSetter>
        </div>
      </a-collapse-item>
    </a-collapse>
    <a-modal
      v-if="actionCodeEditorVisible"
      draggable
      :visible="actionCodeEditorVisible"
      :title="`【${currentAction.name} ${currentAction.title}】动作（事件）编排`"
      @cancel="closeActionCodeEditor"
      :hide-cancel="true"
      ok-text="关闭"
      body-style="padding:0"
      fullscreen
    >
      <GlCommandEditor
        v-if="refreshFlag && currentAction"
        :key="currentAction.id"
        v-model:action="currentAction"
        :actionMeta="currentActionMeta"
      ></GlCommandEditor>
      <template #footer>
        <a-button-group>
          <a-space>
            <!--            <a-button @click="closeActionCodeEditor" title="取消即不保存更改"> 取消</a-button>-->
            <a-button type="primary" @click="saveCurrentPage" title="保存页面到服务端">
              保存
            </a-button>
            <a-button
              type="primary"
              @click="saveAndCloseCurrentPage"
              title="保存页面到服务端，并关闭本窗口"
            >
              保存并关闭
            </a-button>
          </a-space>
        </a-button-group>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlComponentActionsSetter'
}
</script>
<script lang="ts" setup>
/**
 *  动作设置面板
 *  将actions按事件名分组，并按事件名分面板进行配置
 *  配置完成之后转换成actions，并保存到组件实例中
 *  侦听事件EventNames.GlIdeOpenActionEditor，便于在IDE的其它地方打开动作配置面板
 *  @author <geelato>
 *
 */
// @ts-nocheck
import { nextTick, onUnmounted, type PropType, ref } from 'vue'
import { Action, ActionMeta,ComponentInstance, ComponentMeta } from '@geelato/gl-ui-schema'
import { emitter, utils } from '@geelato/gl-ui'
import { EventNames, useActionStore, useIdeStore } from '@geelato/gl-ide'
import { blocksHandler } from './action-setters/BlockHandler'
import GlArrayBaseSetter from './property-setters/GlArrayBaseSetter.vue'
import GlCommandEditor from './action-setters/GlCommandEditor.vue'

const ideStore = useIdeStore()
const actionStore = useActionStore()
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>,
    required: true
  }
})

const getDefaultItemForAdd = (actionMeta: ActionMeta) => {
  return new Action({
    id: utils.gid('act', 20),
    name: actionMeta.name,
    eventName: actionMeta.name,
    title: actionMeta.title
  })
}
const defaultActiveKey = ref<Array<number>>([])
if (props.componentMeta.actions && props.componentMeta.actions.length > 0) {
  props.componentMeta.actions.forEach((action: ActionMeta, index: number) => {
    defaultActiveKey.value.push(index)
  })
}

// 将actions按事件名分组，便于按事件名分面板进行配置
const actionGroup: Record<string, Action[]> = {}
const convertActionsToGroup = () => {
  props.componentInstance.actions?.forEach((action: Action) => {
    actionGroup[action.eventName] = actionGroup[action.eventName] || []
    actionGroup[action.eventName].push(action)
  })
}
convertActionsToGroup()

const convertGroupToActions = () => {
  props.componentInstance.actions.length = 0
  for (const eventName in actionGroup) {
    actionGroup[eventName].forEach((action) => {
      props.componentInstance.actions.push(action)
    })
  }
}

const refreshFlag = ref(true)

const currentAction = ref(new Action())
const currentActionMeta = ref(new ActionMeta())
// const currentActionIndex = ref(-1)
const actionCodeEditorVisible = ref(false)
/**
 *
 * @param action
 * @param actionIndex
 * @param actionMeta
 */
const openActionSetter = (action: Action,actionIndex?:number, actionMeta?: ActionMeta) => {
  console.log('openActionSetter,action, actionIndex, actionMeta:', action, actionMeta)
  if (!action.title) {
    action.title = actionMeta?.title || ''
  }
  if (!action.name) {
    action.name = actionMeta?.name || ''
  }
  if (!action.eventName) {
    action.eventName = actionMeta?.name || ''
  }
  if (!action.id) {
    action.id = utils.gid('act', 20)
  }
  currentAction.value = action ? JSON.parse(JSON.stringify(action)) : new Action()
  currentActionMeta.value = actionMeta || new ActionMeta()

  actionCodeEditorVisible.value = true

  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}

const onAddAction = (action: Action) => {
  convertGroupToActions()
  emitter.emit(EventNames.GlIdeSetterCreateAction, action)
}

const onDeleteAction = (params: { index: number; item: Action }) => {
  convertGroupToActions()
  emitter.emit(EventNames.GlIdeSetterDeleteAction, params)
}

const onUpdateAction = (action: Action) => {
  for (const key in actionGroup) {
    for (const index in actionGroup[key]) {
      if (!actionGroup[key][index].id) {
        console.error('onUpdateAction时，发现id为空的action:', action, '需解决，确保action都有id。')
      }
      if (actionGroup[key][index].id === action.id) {
        actionGroup[key][index] = action
        break
      }
    }
  }
  convertGroupToActions()
  emitter.emit(EventNames.GlIdeSetterUpdateAction, action)
}

const saveCurrentPage = () => {
  onUpdateAction(JSON.parse(JSON.stringify(currentAction.value)))
  generateScript()
  return ideStore.savePage()
}
const saveAndCloseCurrentPage = () => {
  saveCurrentPage().then((res) => {
    closeActionCodeEditor()
  })
}

const closeActionCodeEditor = () => {
  actionCodeEditorVisible.value = false
}

/**
 * 基于block生成脚本
 */
const generateScript = () => {
  const action = props.componentInstance?.actions?.find(
    (action) => action.id === currentAction.value.id
  )
  // const action = props.componentInstance?.actions[currentActionIndex.value]
  // console.log('generateScript action:', action)
  if (action) {
    action.body = blocksHandler.parseToScript(action.__commandBlock)
  }
}

const openActionEditor = (args: { action: any,actionIndex:number,actionMeta:ActionMeta }) => {
  openActionSetter(args.action,args.actionIndex,args.actionMeta)
}
emitter.on(EventNames.GlIdeOpenActionEditor, openActionEditor)

onUnmounted(() => {
  // 将action group转成actions
  convertGroupToActions()
  emitter.off(EventNames.GlIdeOpenActionEditor, openActionEditor)
})
</script>
