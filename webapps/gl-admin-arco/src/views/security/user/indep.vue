<script lang="ts">
export default {
  name: 'UserIndep',
};
</script>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from 'vue';
// 系统对象，路由、用户、国际
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {useUserStore} from "@/store";
import {EventNames} from "@geelato/gl-ide";
// 公共方法
import {ListParams, PageSizeOptions, resetValueByOptions} from '@/api/base';
import {QueryOrgForm} from "@/api/security";
// 引入组件
import OrgTree from "@/components/org-choose-box/tree.vue";
import UserPermissionList from "@/views/security/user/permission/list.vue";

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 470;
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
const resetTreeHeight = () => {
  return window.innerHeight - 255;
}
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
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
const selectChange = (isSelected: boolean, data: QueryOrgForm, forms: QueryOrgForm[]) => {
  if (isSelected && data) {
    const params = {orgIds: [] as string[], orgNames: [] as string[]};
    if (forms && forms.length > 0) {
      forms.forEach((item) => {
        params.orgIds.push(item.id);
        params.orgNames.push(item.name);
      });
    }
    Object.assign(listParams.value, {
      parameter: {
        orgId: params.orgIds.length > 0 ? params.orgIds.join() : '',
        orgName: params.orgNames.length > 0 ? params.orgNames.join() : '',
      }
    })
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
    <Breadcrumb :items="['security.user.index.menu.list', 'security.user.index.menu.list.searchTable']"/>
    <a-card class="general-card" style="padding-top: 20px;">
      <a-row>
        <a-col :span="5">
          <div class="general-card1" style="padding-right: 10px;border-right: 1px solid var(--color-neutral-3);">
            <OrgTree :has-root="true" :root-selected="false"
                     :check-strictly="false"
                     :height="treeParams.height"
                     :max-count="1"
                     :parameter="treeParams.parameter"
                     :visible="true"
                     @change="selectChange"/>
          </div>
        </a-col>
        <a-col :span="19">
          <div class="general-card1" style="padding-left: 10px;">
            <UserPermissionList :visible="listParams.visible"
                                :parameter="listParams.parameter"
                                :formState="listParams.formState"
                                :filterCol="listParams.filterCol"
                                :pageSize="listParams.pageSize"
                                :height="listParams.height"/>
          </div>
        </a-col>
      </a-row>
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
