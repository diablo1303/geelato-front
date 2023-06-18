<script lang="ts">
export default {
  name: "GlIdeStageListPage"
}
</script>
<script lang="ts" setup>
import GlIdeStageBasePage from "./BasePage.vue";
import {utils} from "@geelato/gl-ui";
const key = utils.gid('p')
</script>

<template>
  <GlIdeStageBasePage :key="key"
                      :enableToolbar="false"
                      componentStoreId="useComponentStore"></GlIdeStageBasePage>
</template>
<style>
</style>