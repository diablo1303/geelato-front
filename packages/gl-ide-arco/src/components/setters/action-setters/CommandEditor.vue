<template>
  <div class="gl-ide-plugin-form-designer" style="width:100%;min-height: 500px">
    <a-row>
      <a-col :span="5" style="border-right: 1px solid #F2F2F2;padding: 0.5em">
        <GlCommandEditorSidebar></GlCommandEditorSidebar>
      </a-col>
      <a-col :span="12" style="border-right: 1px solid #F2F2F2;padding: 0.5em">
        <a-tabs @change="generateScript">
          <a-tab-pane key="1">
            <template #title>
              <GlIconfont type="gl-setting"/>
              设计
            </template>
            <div style="width: 100%;line-height: 2em;min-height:38em;">
              <BlockPage :key="mv.id" :glComponentInst="mv.__commandBlock" @update="updateInstance"></BlockPage>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title>
              <GlIconfont type="gl-file"/>
              脚本
            </template>
            <div style="padding: 2px 4px ">
              {{ mv.body }}
            </div>
          </a-tab-pane>
        </a-tabs>

      </a-col>
      <a-col :span="7" style="border-right: 1px solid #F2F2F2;padding: 0.5em">
        <template v-if="componentStore.currentSelectedComponentId&&componentStore.currentSelectedComponentMeta?.componentName!=='GlDndPlaceholder'">
          <div style="border-bottom: 1px solid #F2F2F2;padding: 0.5em;">
          <span style="font-weight: 600">
            {{ componentStore.currentSelectedComponentMeta?.title }}
          </span>
            <a-button-group style="float: right">
              <a-button type="primary" @click="componentStore.switchCurrentSelectedComponentStatus()"
                        title="点击启用或停用该指令块">
                {{ componentStore.currentSelectedComponentInstance?._disabled === true ? '点击启用' : '点击停用' }}
              </a-button>
              <a-button type="primary" status="danger" @click="deleteBlock">删除</a-button>
            </a-button-group>
          </div>
          <GlComponentPropertiesSetter
              :key="componentStore.currentSelectedComponentId"
              :componentMeta="componentStore.currentSelectedComponentMeta"
              :componentInstance="componentStore.currentSelectedComponentInstance"/>
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
export default {
  name: "CommandEditor"
}
</script>
<script lang="ts" setup>
import GlCommandEditorSidebar from './Sidebar.vue'
import {getCurrentInstance, onMounted, onUpdated, PropType, ref, toRaw, watch} from "vue";
import "./blocks/style.css"
import {Action, ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import {blocksHandler} from "./blocks/BlockHandler";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {componentStoreFactory} from "@geelato/gl-ide";
import BlockPage from "../../../components/stage/BlockPage.vue";

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

const componentMaterialStore = useComponentMaterialStore()
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
const emits = defineEmits(["update:action", 'updateAction'])

const mv = ref(props.action)


onMounted(()=>{
  reset()
})

const reset = ()=>{
  mv.value = props.action
}


const findBlockMeta = (componentName: string) => {
  return componentMaterialStore.findMetaByName(componentName)
}

const updateInstance = (instance: ComponentInstance) => {
  console.log('updateInstance block:', instance)
  mv.value.__commandBlock = JSON.parse(JSON.stringify(instance))
  generateScript()
  emits("update:action", mv.value)
  emits("updateAction", mv.value)
}

const generateScript = () => {
  mv.value.body = blocksHandler.parseToScript(componentStore.currentComponentTree[0])
}

const deleteBlock = () => {
  componentStore.deleteCurrentSelectedComponentInst()
}

reset()
</script>

<style>
</style>
