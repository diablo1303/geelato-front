<script lang="ts">
export default {
  name: 'GlAlert'
}
</script>
<script lang="ts" setup>
const props = defineProps({
  label: String,
  _content: String,
  transparent:Boolean
})
</script>

<template>
  <a-alert class="gl-alert" :class="{'gl-transparent':transparent}">
    <template #title v-if="label">
      {{ label }}
    </template>
    {{ _content }}
    <template #action>
      <slot name="action"></slot>
    </template>
  </a-alert>
</template>
<style>
 .gl-alert.gl-transparent{
     background-color: transparent;
 }
</style>
