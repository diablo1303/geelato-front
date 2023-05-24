<template>
  <div class="gl-command-editor-sidebar gl-ide-sidebar">
    <KeepAlive>
      <GlComponents size="mini" :componentGroups="componentGroups"></GlComponents>
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
import GlComponents from "../../sidebar/Components/ComponentsSidebar.vue";

const componentGroups = [
  {name: 'block_var', text: '变量', opened: true},
  {name: 'block_page', text: '页面', opened: true},
  {name: 'block_condition', text: '条件判断', opened: true},
  {name: 'block_circulate', text: '循环', opened: true},
  {name: 'block_saveData', text: '保存数据', opened: true},
  {name: 'block_loadData', text: '获取数据', opened: true},
  {name: 'block_feedback', text: '反馈', opened: true},
  {name: 'block_other', text: '其它', opened: true}]

</script>

<style scoped>

</style>
