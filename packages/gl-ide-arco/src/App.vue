<script lang="ts" >
export default {
  name:'GlIdeArco'
}
</script>
<script setup lang="ts" >
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {plugin} from "./plugin";

const ideStore = useIdeStore()
// 安装插件
ideStore.usePlugin(plugin)
ideStore.addComponentMetas(useComponentMaterialStore().componentMetas)
ideStore.setUiLibName('arco')

</script>
<template>
  <GlIde/>
</template>
<style>
</style>
