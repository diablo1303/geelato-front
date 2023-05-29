<template>
  <div v-if="componentInstance">
    <div class="gl-table">
      <div class="gl-table-row" v-for="(actionMeta) in componentMeta.actions">
        <div class="gl-table-cell gl-label" style="position: relative;width: 8em">{{ actionMeta.name }} {{
            actionMeta.title
          }}
        </div>
        <div class="gl-table-cell">
          <GlArrayBaseSetter v-slot:default="slotProps" v-model="componentInstance.actions"
                             :defaultItemForAdd="new Action({id:utils.uuid('act',16),name:actionMeta.name,title:actionMeta.title})"
                             @addItem="update"
                             @removeItem="update">
            <div style="width:100%;display: flex;margin-bottom: 1px">
              <div style="flex:auto">
                <a-input v-model="componentInstance.actions[slotProps.index].name"></a-input>
              </div>
              <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
                <GlIconfont type="gl-setting"
                            @click="openActionSetter(componentInstance.actions[slotProps.index],slotProps.index,actionMeta)"
                            style="cursor: pointer"></GlIconfont>
              </div>
            </div>
          </GlArrayBaseSetter>
        </div>
      </div>
    </div>
    <a-modal draggable :visible="actionCodeEditorVisible" title="动作（事件）编排"
             @ok="closeActionCodeEditor"
             @cancel="closeActionCodeEditor"
             :width="1360"
             body-style="padding:0"
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
import {h, nextTick, type PropType, ref} from 'vue'
import {Action, ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import GlArrayBaseSetter from "./property-setters/GlArrayBaseSetter.vue";
import CommandEditor from "./action-setters/CommandEditor.vue";
import {useGlobal, utils} from "@geelato/gl-ui";
import {blocksHandler} from "./action-setters/blocks/BlockHandler";

const global = useGlobal()
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: ComponentInstance
  }
})

const handleSelect = (val: Action) => {
  console.log('handleSelect action:', val)
}
const update = () => {

}
console.log('GlComponentActionsSetter > props:', props)
const refreshFlag = ref(true)

const currentAction = ref(new Action())
const currentActionIndex = ref(-1)
const actionCodeEditorVisible = ref(false)
const openActionSetter = (action: Action, actionIndex: number, actionMeta: Action) => {
  console.log('openActionSetter,action, actionIndex, actionMeta:', action, actionIndex, actionMeta)
  if (!action.title) {
    action.title = actionMeta.title
  }
  if (!action.name) {
    action.name = actionMeta.name
  }
  if (!action.id) {
    action.id = utils.gid('act', 16)
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
  console.log('onUpdateAction', action)
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
  console.log('generateScript action:', action)
  if (action) {
    action.body = blocksHandler.parseToScript(action.__commandBlock)
  }
}
</script>

<style scoped>

</style>
