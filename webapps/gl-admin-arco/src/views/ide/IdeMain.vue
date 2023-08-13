<script lang="ts">
export default {
  name: "IdeMain"
}
</script>
<script setup lang="ts">
import {provide} from "vue";
import pinia from '../../store';

provide('pinia', pinia)
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>