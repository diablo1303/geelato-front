<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GlHtml',
  components: {},
  props: {
    html: String
  }
})
</script>
