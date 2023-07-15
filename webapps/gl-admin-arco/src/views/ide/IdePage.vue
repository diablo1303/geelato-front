<script lang="ts">
export default {
  name: "IdePage"
}
</script>
<script setup lang="ts">
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import {useIdeStore} from "@geelato/gl-ide";

const componentMaterialStore = useComponentMaterialStore()
componentMaterialStore.initRegisterComponentMetas()
const ideStore = useIdeStore()
ideStore.addComponentMetas(componentMaterialStore.componentMetas)
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>