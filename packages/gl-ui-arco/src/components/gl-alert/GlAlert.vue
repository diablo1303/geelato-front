<script lang="ts">
export default {
  name: 'GlAlert'
}
</script>
<script lang="ts" setup>
const props = defineProps({
  _content: String
})
</script>

<template>
  <a-alert>
    {{ _content }}
    <template #action>
      <slot name="action"></slot>
    </template>
  </a-alert>
</template>
