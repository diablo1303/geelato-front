<script lang="ts">
export default {
  name: "GlTemplatePage"
}
</script>
<script lang="ts" setup>
import GlBasePage from "./BasePage.vue";
import {utils} from "@geelato/gl-ui";
</script>

<template>
  <GlBasePage :key="utils.gid('p')"
                      :enableToolbar="true"
                      componentStoreId="useComponentStore"></GlBasePage>
</template>
<style>
</style>