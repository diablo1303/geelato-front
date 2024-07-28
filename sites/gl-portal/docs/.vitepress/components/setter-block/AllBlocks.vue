<template>
  <table class="gl-table" style="width: 100%">
    <tr>
      <th style="min-width: 5em">序号</th>
      <th style="width: 100%">组件</th>
      <th style="min-width: 6em">进展</th>
      <th style="min-width: 8em">操作</th>
    </tr>
    <tr v-for="(componentMeta,index) in schemaBlockBrowser.componentMetas" style="margin-bottom: 4px">
      <td>{{ index + 1 }}</td>
      <td><span style="width: 30em">{{ componentMeta.title }} {{
          componentMeta.componentName
        }}</span>
      </td>
      <td>
        <a-progress :steps="10" size="small" :percent="componentMeta.properties.length===0?0:1" />
      </td>
      <td>
        <ComponentBuilderExample :componentMeta="componentMeta"/>
      </td>
    </tr>
  </table>
</template>
<script lang="ts">
export default {
  name: "AllBlocks"
}
</script>
<script lang="ts" setup>
  import {schemaBlockBrowser} from "@geelato/gl-ui-schema-arco";
</script>

<style scoped>

</style>