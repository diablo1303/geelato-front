<template>
  <GlIde/>
</template>

<script lang="ts" setup>
import {useIdeStore} from "@geelato/gl-ide";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
const ideStore = useIdeStore()
ideStore.addComponentMetas(useComponentMaterialStore().componentMetas.value)
ideStore.setUiLibName('arco')
</script>

<style>
</style>
