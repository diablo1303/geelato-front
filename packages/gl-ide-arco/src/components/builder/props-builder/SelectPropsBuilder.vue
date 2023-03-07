<template>
  <div>
    <span>模式：</span>
    <a-radio-group size="small" v-model="mode">
      <a-radio value='SECRET_COMBOBOX_MODE_DO_NOT_USE'>单选</a-radio>
      <a-radio value="multiple">多选</a-radio>
      <a-radio value="tags">标签</a-radio>
    </a-radio-group>
    <span>&nbsp;&nbsp;可选项：</span>
    <GlOptions v-model="options"
               :columns="[{dataIndex: 'label'},{dataIndex: 'value'}]"></GlOptions>
  </div>
</template>

<script lang="ts">
export default {name: "SelectPropsSetter"}
</script>
<script setup lang="ts">
import GlOptions from "../../setters/GlOptions.vue";


const props = defineProps({
  mode: String,
  options: {
    type: Array,
    default() {
      return []
    }
  }
})
</script>

<style scoped>

</style>