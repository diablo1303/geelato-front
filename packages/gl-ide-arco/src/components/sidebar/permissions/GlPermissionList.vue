<script lang="ts">
export default {
  name: 'GlPermissionList'
}
</script>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {EventNames, useComponentStore} from "@geelato/gl-ide";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {Action} from "@geelato/gl-ui-schema";
import {emitter, utils} from "@geelato/gl-ui";
import GlRoleMenuItem from "./GlRoleMenuItem.vue";

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

const roleMenuItem = ref()
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
const visibleRoleMenuItems = ref(false)
const openRoleMenuItemsModal = () => {
  visibleRoleMenuItems.value = true

}
const onRoleMenuItemsOk = () => {
  roleMenuItem.value.save()
}
const onRoleMenuItemsOkNotClose = () => {

}
const onRoleMenuItemsCancel = () => {
  visibleRoleMenuItems.value = false
}

</script>

<template>
  <div class="gl-action-list">
    <a-button type="outline" long @click="openRoleMenuItemsModal">点击配置页面菜单访问授权</a-button>
    <a-modal fullscreen v-model:visible="visibleRoleMenuItems"
             @ok="onRoleMenuItemsOk" @cancel="onRoleMenuItemsCancel"
             ok-text="保存"
             :key="utils.gid('id')"
             :footer="false"
             draggable>
      <template #title>
        角色可访问页面权限配置
      </template>
      <template #footer>
        <a-button @click="onRoleMenuItemsCancel">关闭</a-button>
        <a-button @click="onRoleMenuItemsOk" type="primary">保存</a-button>
      </template>
      <GlRoleMenuItem ref="roleMenuItem"/>
    </a-modal>
    <a-alert :show-icon="false" banner center>以下配置本页面组件查看、编辑权限</a-alert>
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
  background-color: #f7fbff;
}

.gl-action-item .gl-title {
  flex: auto;
  cursor: pointer
}

.arco-radio-button :hover, .arco-radio-button.arco-radio-checked {
  border: 1px solid royalblue;
}

</style>
