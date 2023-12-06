<script lang="ts">
export default {
  name: 'GlAlert'
}
</script>
<script lang="ts" setup>
const props = defineProps({
  label: String,
  _content: String
})
</script>

<template>
  <a-alert>
    <template #title v-if="label">
      {{ label }}
    </template>
    {{ _content }}
    <template #action>
      <slot name="action"></slot>
    </template>
  </a-alert>
</template>
