<template>
  <div class="gl-form-page">
    <GlIdeBasePage><gl-x :glComponentInst="componentStore.currentComponentTree[0]"></gl-x>
    </GlIdeBasePage>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlIdeFormPage"
}
</script>
<script setup lang="ts">
import {useComponentStore} from "@geelato/gl-ide";

const componentStore = useComponentStore()

</script>

<style>
.gl-ide-arco-stage-main {
  padding: 10px 10px 2em 10px;
  overflow: hidden;
}
</style>
