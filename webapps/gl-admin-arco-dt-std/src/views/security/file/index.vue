<script lang="ts">
export default {
  name: 'FileTemplateIndex'
};
</script>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from 'vue';
// 系统对象，路由、用户、国际
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
// 公共方法
import {utils} from '@geelato/gl-ui';
import type {ListParams} from '@geelato/gl-ui';
import {EventNames} from "@geelato/gl-ide";
import {useUserStore, PageSizeOptions} from "@geelato/gl-ui-arco-admin";

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 475;
const ListRowHeight = 49;

const {t} = useI18n(); // 国际化
const route = useRoute(); // 路由
const userStore = useUserStore(); // 用户
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || userStore.tenantCode || ''
});// 页面的应用id、租户编码(路由或用户所属)

/**
 * 调整列表高度
 */
const resetListHeight = () => {
  return window.innerHeight - ListUsedHeight;
}
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return utils.resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

// 引用页面所需参数
const listParams = ref<ListParams>({
  visible: true,
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: 'edit',
  filterCol: 3,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});

/**
 * 浏览器高度调整时事件
 */
const handleResize = () => {
  listParams.value = Object.assign(listParams.value, {
    height: resetListHeight(), pageSize: resetListPageSize(),
  })
}

onMounted(() => {
  window.addEventListener(EventNames.WindowResize, handleResize);
});
onUnmounted(() => {
  window.removeEventListener(EventNames.WindowResize, handleResize);
});
</script>

<template>
  <div class="container">
    <GlBreadcrumb :items="['security.file.index.menu.list', 'security.file.index.menu.list.searchTable']"/>
    <a-card class="general-card">
      <GlFileTemplateList :filterCol="listParams.filterCol"
                          :formState="listParams.formState"
                          :height="listParams.height"
                          :pageSize="listParams.pageSize"
                          :parameter="listParams.parameter"
                          :visible="listParams.visible"/>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  padding-top: 20px;
}
</style>