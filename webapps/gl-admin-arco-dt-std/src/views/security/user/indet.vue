<script lang="ts">
export default {
  name: 'UserIndet',
};
</script>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from 'vue';
// 系统对象，路由、用户、国际
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
// 公共方法
import {utils} from '@geelato/gl-ui';
import type {ListParams, QueryOrgForm} from '@geelato/gl-ui';
import {EventNames} from "@geelato/gl-ide";
import {useUserStore, PageSizeOptions} from "@geelato/gl-ui-arco-admin";

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 485;
const ListRowHeight = 49;

const {t} = useI18n(); // 国际化
const route = useRoute(); // 路由
const userStore = useUserStore(); // 用户
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || userStore.tenantCode || ''
});// 页面的应用id、租户编码(路由或用户所属)

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return window.innerHeight - 220;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('250px');
const splitSize = ref<number | string>(splitMin.value);
/**
 * 调整列表高度
 */
const resetListHeight = () => {
  return window.innerHeight - ListUsedHeight;
}
const resetTreeHeight = () => {
  return window.innerHeight - 255;
}
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return utils.resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

// 引用页面所需参数
const treeParams = ref({
  visible: true,
  parameter: {
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  height: resetTreeHeight(),
});
const listParams = ref<ListParams>({
  visible: true,
  parameter: {
    orgId: '', orgName: '',
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode
  },
  formState: 'edit',
  filterCol: 2,
  pageSize: resetListPageSize(),
  height: resetListHeight(),
});

/**
 * 选中添加、取消移除
 * @param isSelected
 * @param data
 */
const selectChange = (isSelected: boolean, data: QueryOrgForm) => {
  if (isSelected && data) {
    Object.assign(listParams.value, {parameter: {orgId: data.id, orgName: data.name}})
  } else {
    Object.assign(listParams.value, {parameter: {orgId: '', orgName: ''}})
  }
}

/**
 * 浏览器高度调整时事件
 */
const handleResize = () => {
  Object.assign(listParams.value, {
    height: resetListHeight(), pageSize: resetListPageSize(),
  })
  Object.assign(treeParams.value, {
    height: resetTreeHeight(),
  })
  splitHeight.value = resetSplitHeight();
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
    <GlBreadcrumb :items="['security.user.index.menu.list', 'security.user.index.menu.list.searchTable']"/>
    <a-card class="general-card" style="padding-top: 20px;">
      <a-split v-model:size="splitSize" :min="splitMin"
               :style="{height: `${splitHeight}px`,width: '100%'}">
        <template #first>
          <div class="general-card1" style="padding-right: 10px;">
            <GlOrgSelectTree :has-root="true"
                             :height="treeParams.height"
                             :max-count="1"
                             :parameter="treeParams.parameter"
                             :root-selected="true"
                             :visible="true"
                             @change="selectChange"/>
          </div>
        </template>
        <template #second>
          <div class="general-card1" style="padding-left: 10px;">
            <GlUserList :filterCol="listParams.filterCol"
                        :formState="listParams.formState"
                        :height="listParams.height"
                        :pageSize="listParams.pageSize"
                        :parameter="listParams.parameter"
                        :visible="listParams.visible"/>
          </div>
        </template>
      </a-split>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.general-card1 {
  font-size: 14px;
  position: relative;
  background: var(--color-bg-2);
  border-radius: var(--border-radius-none);
  transition: box-shadow 0.2s cubic-bezier(0, 0, 1, 1);
}
</style>
