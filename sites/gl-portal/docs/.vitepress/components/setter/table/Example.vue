<template>
  <SetterExample :instanceData="componentInstance" :metaData="componentMeta"></SetterExample>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import {TableMeta as componentMeta} from "@geelato/gl-ui-schema-arco";
import componentInstance from "./instanceData";

export default defineComponent({
  data() {
    return {
      componentMeta: componentMeta,
      componentInstance: componentInstance
    }
  },
  methods: {}
})
</script>

<style scoped>

</style>
