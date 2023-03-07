<template>
  <GlIde/>
</template>

<script setup lang="ts" >
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";

const ideStore = useIdeStore()
ideStore.addComponentMetas(useComponentMaterialStore().componentMetas)
ideStore.setUiLibName('arco')
</script>

<style>
</style>
