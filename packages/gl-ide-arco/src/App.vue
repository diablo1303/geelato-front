<script lang="ts">
export default {
  name: 'GlIdeArco'
}
</script>
<script setup lang="ts">
import { useIdeStore } from '@geelato/gl-ide'
import { useComponentMaterialStore } from '@geelato/gl-ui-schema-arco'
import { plugin } from './plugin'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { inject, onUnmounted, ref } from 'vue'
import type { Pinia } from 'pinia'
import { emitter, useGlobal } from '@geelato/gl-ui'
import { EventNames } from '@geelato/gl-ide'
import PageReplaceEditor from './components/toolbar/PageReplaceEditor.vue'

const pinia: Pinia = inject('pinia')!

const componentMaterialStore = useComponentMaterialStore(pinia)
componentMaterialStore.initRegisterComponentMetas()

const ideStore = useIdeStore(pinia)
// 安装插件
ideStore.usePlugin(plugin)
ideStore.addComponentMetas(componentMaterialStore.componentMetas)
ideStore.setUiLibName('arco')

const global = useGlobal()
const savedPage = (data: any) => {
  global.$message.success({
    content: '页面保存成功'
  })
}
const savedPageIgnore = (data: any) => {
  global.$message.info({
    content: data.message
  })
}

const modalVisible = ref(false)
const showPageReplaceModal = () => {
  modalVisible.value = true
}
const handleOk = () => {
  modalVisible.value = false
}
const handleCancel = () => {
  modalVisible.value = false
}
emitter.on(EventNames.GlIdeToolbarPageSaved, savedPage)
emitter.on(EventNames.GlIdeToolbarPageSaveIgnore, savedPageIgnore)
emitter.on(EventNames.GlIdeToolbarShowPagesReplaceEditor, showPageReplaceModal)

onUnmounted(() => {
  emitter.off(EventNames.GlIdeToolbarPageSaved, savedPage)
  emitter.off(EventNames.GlIdeToolbarPageSaveIgnore, savedPageIgnore)
  emitter.off(EventNames.GlIdeToolbarShowPagesReplaceEditor, showPageReplaceModal)
})
</script>
<template>
  <DndProvider :backend="HTML5Backend">
    <GlIde />
    <a-modal v-if="modalVisible" v-model:visible="modalVisible" @ok="handleOk" @cancel="handleCancel" fullscreen>
      <template #title> 页面重构（危险操作）</template>
      <PageReplaceEditor></PageReplaceEditor>
    </a-modal>
  </DndProvider>
</template>
<style></style>
