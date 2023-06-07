<template>
  <div class="container">
    <!-- 面包屑 Breadcrumb 是辅助导航模式，用于识别页面在层次结构内的位置，并根据需要向上返回。-->
    <Breadcrumb :items="['security.user.index.menu.list', 'security.user.index.menu.list.searchTable']"/>
    <!-- 卡片 Card 将信息分类后分标题、详情等区域聚合展现，一般作为简洁介绍或者信息的大盘和入口。   -->
    <a-card :title="$t('security.user.index.menu.list.searchTable')" class="general-card">
      <!-- list   -->
      <UserList ref="userListRef"></UserList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import UserList from "@/views/security/user/list.vue";

const userListRef = ref(null);

const loadIndex = () => {
  if (userListRef.value) {
    // @ts-ignore
    userListRef.value?.loadList({action: 'edit'});
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

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>