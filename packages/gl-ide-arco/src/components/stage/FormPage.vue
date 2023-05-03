<script lang="ts">
export default {
  name: "GlIdeStageFormPage"
}
</script>
<script lang="ts" setup>
import GlIdeStageBasePage from "./BasePage.vue";
import {utils} from "@geelato/gl-ui";

</script>

<template>
  <GlIdeStageBasePage :key="utils.gid('p')" componentStoreId="useComponentStore"></GlIdeStageBasePage>
</template>
<style>
.gl-ide-arco-stage-main {
  padding: 10px 10px 2em 10px;
  overflow: hidden;
}
</style>