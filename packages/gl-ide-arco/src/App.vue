<script lang="ts" >
export default {
  name:'GlIdeArco'
}
</script>
<script setup lang="ts" >
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {plugin} from "./plugin";
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {inject} from "vue";
import type {Pinia} from "pinia";

const pinia:Pinia = inject('pinia')!

const componentMaterialStore = useComponentMaterialStore(pinia)
componentMaterialStore.initRegisterComponentMetas()

const ideStore = useIdeStore(pinia)
// 安装插件
ideStore.usePlugin(plugin)
ideStore.addComponentMetas(componentMaterialStore.componentMetas)
ideStore.setUiLibName('arco')

</script>
<template>
  <DndProvider :backend="HTML5Backend">
    <GlIde/>
  </DndProvider>
</template>
<style>
</style>
