<script lang="ts">
export default {
  name: "GlIdeStageTemplatePage"
}
</script>
<script lang="ts" setup>
import GlIdeStageBasePage from "./BasePage.vue";
import {utils} from "@geelato/gl-ui";
</script>

<template>
  <GlIdeStageBasePage :key="utils.gid('p')"
                      :enableToolbar="true"
                      componentStoreId="useComponentStore"></GlIdeStageBasePage>
</template>
<style>
</style>