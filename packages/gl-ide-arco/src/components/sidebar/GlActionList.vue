<script lang="ts">
export default {
  name: 'GlActionList'
}
</script>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {EventNames, useComponentStore} from "@geelato/gl-ide";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {Action} from "@geelato/gl-ui-schema";
import {emitter, utils} from "@geelato/gl-ui";

const componentStore = useComponentStore()
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})


const beRefActions = ref(componentStore.getBeRefActions())

const selectComponent = (inst: ComponentInstance) => {
  componentStore.setCurrentSelectedComponent(inst)
}

const openActionSetter = (inst: ComponentInstance, action: Action, actionIndex?: number) => {
  selectComponent(inst)
  // 等组件属性面板打开，200ms后，切换到动作面板
  utils.sleep(200).then(() => {
    emitter.emit(EventNames.GlIdeSetterPanelSwitch, {key: 'actions'})
  })
  // 等100ms,再弹出动作页面
  utils.sleep(200).then(() => {
    emitter.emit(EventNames.GlIdeOpenActionEditor, {action, actionIndex})
  })
}

const openRefActionSetter = (beRefAction:{componentId:string,action:Action})=>{
  const inst = componentStore.findComponentFromTreeById(beRefAction.componentId)
  const action = inst.actions.find((action:Action)=>{
    return beRefAction.action.id === action.id
  })
  openActionSetter(inst,action)
}
</script>

<template>
  <div class="gl-action-list">
    <a-alert :show-icon="false" banner center>当前页面已配置的事件</a-alert>
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item
        v-for="(inst, index) in componentStore.getActionList()"
        :header="inst.props.label || inst.componentName"
        :key="index"
      >
        <template #extra>
          <a-tag size="small" color="blue" @click.stop="selectComponent(inst)">选择组件</a-tag>
        </template>
        <div
          v-for="(action, actionIndex) in inst.actions"
        >
          <div class="gl-action-item">
            <div class="gl-title" @click="openActionSetter(inst, action, actionIndex)">{{ action.title }}：{{ action.name }}</div>
            <div style="flex: 0 0 2em; text-align: center; line-height: 2em">
              <GlIconfont type="gl-thunderbolt" class="gl-active" style="cursor: pointer"  @click="openActionSetter(inst, action, actionIndex)"/>
            </div>
          </div>
          <div v-for="beRefAction in beRefActions[action.id]" :key="beRefAction.action.id">
            <a-tooltip :content="`以上事件（${action.title}），被此事件引用，该事件来源于组件（${beRefAction.label}）`" position="right">
              <div class="gl-action-item">
                <GlIconfont type="gl-link" style="margin: 0 0.5em"></GlIconfont>
                <div class="gl-title" @click="openRefActionSetter(beRefAction)">{{ beRefAction.action.title }}：{{ beRefAction.action.name }}</div>
                <div style="flex: 0 0 2em; text-align: center; line-height: 2em">
                  <GlIconfont type="gl-thunderbolt" class="gl-active" style="cursor: pointer"  @click="openRefActionSetter(beRefAction)"/>
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<style>
.gl-action-list .arco-collapse-item-content {
  padding-left: 12px !important;
}

.gl-action-item {
  width: 100%;
  display: flex;
  margin-bottom: 1px;
}

.gl-action-item:hover {
  background-color: #e8f7ff;
  color: #0e72cc;
}

.gl-action-item .gl-title {
  flex: auto;
  cursor: pointer;
}

</style>