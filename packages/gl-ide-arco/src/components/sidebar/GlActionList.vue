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

const actionList = ref(componentStore.getActionList())
onMounted(() => {
  actionList.value = componentStore.getActionList()
})

const selectComponent = (inst: ComponentInstance) => {
  componentStore.setCurrentSelectedComponent(inst)
}

const openActionSetter = (inst: ComponentInstance, action: Action, actionIndex: number) => {
  selectComponent(inst)
  emitter.emit(EventNames.GlIdeSetterPanelSwitch, {key: 'actions'})
  utils.sleep(100).then(() => {
    emitter.emit(EventNames.GlIdeOpenActionEditor, {action, actionIndex})
  })
}

</script>

<template>
  <div class="gl-action-list">
    <a-alert :show-icon="false" banner center>当前页面已配置的事件</a-alert>
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item v-for="(inst,index) in componentStore.getActionList()"
                       :header="inst.props.label||inst.componentName" :key="index">
        <template #extra>
          <a-tag size="small" color="blue" @click.stop="selectComponent(inst)">选择组件</a-tag>
        </template>
        <div v-for="(action,actionIndex) in inst.actions" class="gl-action-item"
             @click="openActionSetter(inst,action,actionIndex)">
          <div class="gl-title">
            {{ action.title }}：{{ action.name }}
          </div>
          <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
            <GlIconfont type="gl-thunderbolt" class="gl-active" style="cursor: pointer"/>
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
  margin-bottom: 1px
}

.gl-action-item:hover {
  background-color: #E8F7FF;
}

.gl-action-item .gl-title {
  flex: auto;
  cursor: pointer
}
</style>
