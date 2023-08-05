<script lang="ts">
export default {
  name: 'GlActionList'
}
</script>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {useComponentStore} from "@geelato/gl-ide";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

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

</script>

<template>
  <div>
    <a-alert :show-icon="false" banner center>当前页面已配置的事件</a-alert>
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item v-for="(inst,index) in componentStore.getActionList()"
                       :header="inst.props.label||inst.componentName" :key="index">
        <template #extra>
          <a-tag size="small" color="blue" @click.stop="selectComponent(inst)">选择组件</a-tag>
        </template>
        <GlArrayBaseSetter v-slot:default="slotProps" v-model="inst.actions">
          <div style="width:100%;display: flex;margin-bottom: 1px">
            <div style="flex:auto">
              <a-input v-model="inst.actions[slotProps.index].name"></a-input>
            </div>
            <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
              <GlIconfont type="gl-thunderbolt" style="cursor: pointer"></GlIconfont>
            </div>
          </div>
        </GlArrayBaseSetter>
      </a-collapse-item>
    </a-collapse>
<!--    <a-modal v-if="actionCodeEditorVisible" draggable :visible="actionCodeEditorVisible" title="动作（事件）编排"-->
<!--             @ok="closeActionCodeEditor"-->
<!--             @cancel="closeActionCodeEditor"-->
<!--             :hide-cancel="true"-->
<!--             ok-text="关闭"-->
<!--             body-style="padding:0"-->
<!--             fullscreen-->
<!--    >-->
<!--      <CommandEditor v-if="refreshFlag&&currentAction" :key="currentAction.id"-->
<!--                     v-model:action="currentAction"></CommandEditor>-->
<!--    </a-modal>-->
  </div>
</template>

<style scoped>

</style>
