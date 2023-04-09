<template>
  <div>
    <div v-for="componentMeta in schemaBlock.componentMetas" style="margin-bottom: 4px">
      <a-space>
        <span style="width: 20em">{{ componentMeta.title }} {{ componentMeta.componentName }}</span>
        <ComponentBuilderExample :componentMeta="componentMeta"/>
      </a-space>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "AllBlocks"
}
</script>
<script lang="ts" setup>
  import {schemaBlock} from "@geelato/gl-ui-schema-arco";
</script>

<style scoped>

</style>