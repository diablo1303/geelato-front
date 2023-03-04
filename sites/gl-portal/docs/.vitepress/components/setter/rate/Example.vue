<template>
  <SetterExample :instanceData="componentInstance" :metaData="componentMeta"></SetterExample>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import exampleMixins from "../exampleMixins";
import {RateMeta as meta} from "@geelato/gl-ui-schema-arco";
import componentInstance from "./instanceData";

export default defineComponent({
  mixins: [exampleMixins],
  data() {
    return {
    }
  },
  beforeMount() {
    this.componentMeta = meta
    this.componentInstance = componentInstance
  },
  methods: {}
})
</script>

<style scoped>

</style>
