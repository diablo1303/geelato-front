<script lang="ts">
export default {
  name: "IdeMain"
}
</script>
<script setup lang="ts">
import pinia from '../../store';
import {provide} from "vue";
provide('pinia',pinia)
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>