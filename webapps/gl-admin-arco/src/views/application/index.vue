<template>
  <div class="container">
    <Breadcrumb :items="['menu.application', 'menu.application.app.list']"/>
    <a-card :title="$t('menu.application.app.list')" class="general-card">
      <!-- list   -->
      <AppList ref="appListRef"></AppList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import AppList from "@/views/application/list.vue";

const appListRef = ref(null);

const loadIndex = () => {
  if (appListRef.value) {
    // @ts-ignore
    appListRef.value?.loadList({action: 'edit'});
  }
}

onMounted(() => {
  loadIndex();
});
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
