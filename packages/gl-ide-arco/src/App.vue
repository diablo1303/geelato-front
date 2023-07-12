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
import {Utils} from "@geelato/gl-ui";

const ideStore = useIdeStore()
// 安装插件
ideStore.usePlugin(plugin)
ideStore.addComponentMetas(useComponentMaterialStore().componentMetas)
ideStore.setUiLibName('arco')

// 获取应用id
if(Utils.CheckUtil.isBrowser()){

}
</script>
<template>
  <DndProvider :backend="HTML5Backend">
    <GlIde/>
  </DndProvider>
</template>
<style>
</style>
