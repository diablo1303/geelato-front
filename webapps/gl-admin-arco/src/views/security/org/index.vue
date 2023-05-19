<template>
  <div class="container">
    <!-- 面包屑 Breadcrumb 是辅助导航模式，用于识别页面在层次结构内的位置，并根据需要向上返回。-->
    <Breadcrumb :items="['sercurity.org.index.menu.list', 'sercurity.org.index.menu.list.searchTable']"/>
    <!-- 卡片 Card 将信息分类后分标题、详情等区域聚合展现，一般作为简洁介绍或者信息的大盘和入口。   -->
    <a-card class="general-card" :title="$t('sercurity.org.index.menu.list.searchTable')">
      <!-- list   -->
      <OrgList ref="orgListRef"></OrgList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import OrgList from "@/views/security/org/list.vue";

const orgListRef = ref(null);

const loadIndex = () => {
  if (orgListRef.value) {
    orgListRef.value?.loadList('view');
  }
}

onMounted(() => {
  loadIndex();
});
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
