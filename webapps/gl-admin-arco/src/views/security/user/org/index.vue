<template>
  <div class="container">
    <Breadcrumb :items="['sercurity.orgUser.index.menu.list', 'sercurity.orgUser.index.menu.list.searchTable']"/>
    <a-card :title="$t('sercurity.orgUser.index.menu.list.searchTable')" class="general-card">
      <!-- list   -->
      <OrgUserList ref="orgUserListRef"></OrgUserList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import OrgUserList from "@/views/security/user/org/list.vue";

const orgUserListRef = ref(null);

const loadIndex = () => {
  if (orgUserListRef.value) {
    orgUserListRef.value?.loadList({action: 'edit'});
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