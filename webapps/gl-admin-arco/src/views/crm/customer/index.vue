<template>
  <div>
    <a-button @click="openDrawer">打开表单</a-button>
    <GlComponent :glComponentInst="pageInstance">
    </GlComponent>
    <a-drawer :width="1024" :visible="drawerVisible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
      <template #title>
        Title
      </template>
      <div>
        <FORM></FORM>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import pageInstance from './listInstance.json';
import FORM from "./Form.vue"

const drawerVisible = ref(false)
const openDrawer = ()=>{
  drawerVisible.value = true
}
const handleOk = ()=>{
  drawerVisible.value = false
}
const handleCancel = ()=>{
  drawerVisible.value = false
}
</script>

<style scoped lang="less">
</style>
