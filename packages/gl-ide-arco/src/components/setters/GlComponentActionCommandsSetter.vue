<template>
  <div>
    <div v-for="(block) in blocks">

    </div>
    <CommandEditor></CommandEditor>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlComponentActionCommandsSetter"
}
</script>
<script lang="ts" setup>
import {type PropType, ref} from 'vue'
import {Action, ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import {BlockInstance} from "@geelato/gl-ui-schema";
import CommandEditor from "./action-setters/CommandEditor"
const props = defineProps({
  blocks: {
    type: Array as PropType<Array<BlockInstance>>,
    default() {
      return []
    }
  }
})

</script>

<style scoped>

</style>
