<template>
  <div class="gl-command-editor-sidebar gl-ide-sidebar">
    <KeepAlive>
      <GlComponentsSidebar :size="SizeType.small" :componentGroups="componentGroups"></GlComponentsSidebar>
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
// import GlComponents from "../../sidebar/Components/ComponentsSidebar.vue";
import {SizeType} from "../Types";

const componentGroups = [
  {name: 'block_var', text: '变量', opened: true},
  {name: 'block_page', text: '页面和组件', opened: true},
  {name: 'block_condition', text: '条件判断', opened: true},
  {name: 'block_circulate', text: '循环', opened: true},
  {name: 'block_data', text: '数据', opened: true},
  {name: 'block_feedback', text: '反馈', opened: true},
  {name: 'block_code', text: '代码', opened: true},
  {name: 'block_file', text: '文件', opened: true},
  {name: 'block_other', text: '其它', opened: true}]

</script>

<style scoped>

</style>
