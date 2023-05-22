<template>
  <div class="container">
    <Breadcrumb :items="['sercurity.rolePermission.index.menu.list', 'sercurity.rolePermission.index.menu.list.searchTable']"/>
    <a-card :title="$t('sercurity.rolePermission.index.menu.list.searchTable')" class="general-card">
      <!-- list   -->
      <RolePermissionList ref="rolePermissionListRef"></RolePermissionList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import RolePermissionList from "@/views/security/role/permission/list.vue";

const rolePermissionListRef = ref(null);

const loadIndex = () => {
  if (rolePermissionListRef.value) {
    rolePermissionListRef.value?.loadList({action: 'edit'});
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
