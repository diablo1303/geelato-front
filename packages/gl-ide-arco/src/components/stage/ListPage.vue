<script lang="ts">
export default {
  name: "GlListPage"
}
</script>
<script lang="ts" setup>
import GlBasePage from "./BasePage.vue";
import {utils} from "@geelato/gl-ui";
const key = utils.gid('p')
</script>

<template>
  <GlBasePage :key="key"
                      :enableToolbar="false"
                      componentStoreId="useComponentStore"></GlBasePage>
</template>
<style>
</style>