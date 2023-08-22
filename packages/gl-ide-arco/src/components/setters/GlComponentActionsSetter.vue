<template>
  <div v-if="componentInstance">
    <a-collapse :default-active-key="defaultActiveKey" expand-icon-position="right">
      <a-collapse-item v-for="(actionMeta,actionMetaIndex) in componentMeta.actions"
                       :header="actionMeta.name+' '+actionMeta.title" :key="actionMetaIndex"
                       :title="actionMeta.description"
      >
        <div style="padding: 0 1em">
          <GlArrayBaseSetter v-slot:default="slotProps" v-model="componentInstance.actions"
                             :filter="(action:Action)=>{return action?.eventName===actionMeta.name}"
                             :defaultItemForAdd="getDefaultItemForAdd(actionMeta)"
                             @addItem="update"
                             @removeItem="update">
            <div style="width:100%;display: flex;margin-bottom: 1px">
              <div style="flex:auto">
                <a-input v-model="componentInstance.actions[slotProps.index].name"></a-input>
              </div>
              <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
                <GlIconfont type="gl-thunderbolt"
                            @click="openActionSetter(componentInstance.actions[slotProps.index],slotProps.index,actionMeta)"
                            style="cursor: pointer"></GlIconfont>
              </div>
            </div>
          </GlArrayBaseSetter>
        </div>
      </a-collapse-item>
    </a-collapse>
    <a-modal v-if="actionCodeEditorVisible" draggable :visible="actionCodeEditorVisible" title="动作（事件）编排"
             @ok="closeActionCodeEditor"
             @cancel="closeActionCodeEditor"
             :hide-cancel="true"
             ok-text="关闭"
             body-style="padding:0"
             fullscreen
    >
      <CommandEditor v-if="refreshFlag&&currentAction" :key="currentAction.id"
                     v-model:action="currentAction"></CommandEditor>
    </a-modal>
  </div>

</template>
<script lang="ts">
export default {
  name: "GlComponentActionsSetter"
}
</script>
<script lang="ts" setup>
// @ts-nocheck
// error TS2532: Object is possibly 'undefined'.
// componentInstance.actions
import {nextTick, onUnmounted, type PropType, ref} from 'vue'
import {Action, ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import GlArrayBaseSetter from "./property-setters/GlArrayBaseSetter.vue";
import CommandEditor from "./action-setters/CommandEditor.vue";
import {emitter, useGlobal, utils} from "@geelato/gl-ui";
import {blocksHandler} from "./action-setters/blocks/BlockHandler";
import type {ActionMeta} from "@geelato/gl-ui-schema";
import {EventNames} from "@geelato/gl-ide";
import {ac} from "vitest/dist/types-0373403c";

const global = useGlobal()
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

const handleSelect = (val: Action) => {
  // console.log('handleSelect action:', val)
}
const update = () => {

}
// console.log('GlComponentActionsSetter > props:', props)
const refreshFlag = ref(true)

const currentAction = ref(new Action())
const currentActionIndex = ref(-1)
const actionCodeEditorVisible = ref(false)
const openActionSetter = (action: Action, actionIndex: number, actionMeta?: ActionMeta) => {
  // console.log('openActionSetter,action, actionIndex, actionMeta:', action, actionIndex, actionMeta)
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
  currentActionIndex.value = actionIndex
  actionCodeEditorVisible.value = true
  // global.$modal.open({
  //   title: "动作（事件）编排",
  //   content: h(CommandEditor, {key: currentAction.value.id, action: currentAction.value}),
  //   width: 1360,
  //   bodyStyle: "padding:0",
  //   onOk: openActionSetter,
  //   onCancel: closeActionCodeEditor
  // })
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}
const onUpdateAction = (action: Action) => {
  // console.log('onUpdateAction', action)
  // @ts-ignore
  props.componentInstance.actions[currentActionIndex.value] = action
}

const closeActionCodeEditor = () => {
  onUpdateAction(JSON.parse(JSON.stringify(currentAction.value)))
  generateScript()
  actionCodeEditorVisible.value = false
}

/**
 * 基于block生成脚本
 */
const generateScript = () => {
  const action = props.componentInstance?.actions[currentActionIndex.value]
  // console.log('generateScript action:', action)
  if (action) {
    action.body = blocksHandler.parseToScript(action.__commandBlock)
  }
}

const openActionEditor = (args: any) => {
  console.log('openActionSetter:', args)
  openActionSetter(args.action, args.actionIndex)
}
emitter.on(EventNames.GlIdeOpenActionEditor, openActionEditor)

onUnmounted(() => {
  // console.log('GlComponentSetter > onUnmounted ...', props.componentInstance?.componentName, props.componentInstance?.id)
  emitter.off(EventNames.GlIdeOpenActionEditor, openActionEditor)
})
</script>

<style scoped>

</style>
