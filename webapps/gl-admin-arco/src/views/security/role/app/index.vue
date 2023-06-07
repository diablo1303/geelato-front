<template>
  <div class="container">
    <Breadcrumb :items="['security.roleApp.index.menu.list', 'security.roleApp.index.menu.list.searchTable']"/>
    <a-card :title="$t('security.roleApp.index.menu.list.searchTable')" class="general-card">
      <!-- list   -->
      <RoleAppList ref="roleAppListRef"></RoleAppList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import RoleAppList from "@/views/security/role/app/list.vue";

const roleAppListRef = ref(null);

const loadIndex = () => {
  if (roleAppListRef.value) {
    // @ts-ignore
    roleAppListRef.value?.loadList({action: 'edit'});
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

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

/* form */
.arco-tabs-pane .arco-breadcrumb.container-breadcrumb {
  display: none !important;
}

.arco-tabs-pane .container {
  padding: 0 20px 0px 20px !important;
}

.arco-tabs-pane .container .general-card > .arco-card-header {
  display: none !important;
}

.arco-tabs-pane .container .general-card > .arco-card-body {
  padding: 0 20px 0px 20px !important;
}
</style>
