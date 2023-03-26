<template>
  <div>
    <div v-for="(block) in blocks">

    </div>
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
import {CommandBlock} from "@geelato/gl-ui-schema";

const props = defineProps({
  blocks: {
    type: Array as PropType<Array<CommandBlock>>,
    default() {
      return []
    }
  }
})

</script>

<style scoped>

</style>
