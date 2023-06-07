<template>
  <div class="container">
    <Breadcrumb :items="['security.dict.index.menu.list', 'security.dict.index.menu.list.searchTable']"/>
    <a-card :title="$t('security.dict.index.menu.list.searchTable')" class="general-card">
      <!-- list   -->
      <DictList ref="dictListRef"></DictList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import DictList from "@/views/security/dict/list.vue";

const dictListRef = ref(null);

const loadIndex = () => {
  if (dictListRef.value) {
    // @ts-ignore
    dictListRef.value?.loadList({action: 'edit'});
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
