<script lang="ts">
export default {
  name: 'AppSettings',
};
</script>
<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, shallowRef} from 'vue';
import cloneDeep from "lodash/cloneDeep";
import {Message} from "@arco-design/web-vue";
import {EventNames} from '@geelato/gl-ide';
import {emitter, useGlobal, authUtil, utils, userApi, applicationApi} from '@geelato/gl-ui';
import type {QueryAppForm, QueryOrgForm} from "@geelato/gl-ui";
import {useUser, useLoading, useUserStore, PageSizeOptions} from "@geelato/gl-ui-arco-admin";
import pinia from '../../store';

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 428;
const ListRowHeight = 49;

provide('pinia', pinia);
const userStore = useUserStore();
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();
const appData = ref<QueryAppForm>({} as unknown as QueryAppForm);
const showPage = ref(false);
const tableFormRef = ref(null);
const {loading, setLoading} = useLoading(false);
const tabsKey = ref<number>(1);

/**
 * 调整应用信息高度
 */
const resetAppModelHeight = () => {
  return window.innerHeight - 215;
}
/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return window.innerHeight - 168;
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
/**
 * 调整树形结构高度
 */
const resetTreeHeight = () => {
  return window.innerHeight - 200;
}
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return utils.resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

// 引用页面所需参数
// 应用信息
const appModelParams = ref({
  height: resetAppModelHeight(),
  visible: false, id: '', formState: 'edit', formCol: 2, parameter: {appId: '', tenantCode: ''}
});
const generateListParams = () => {
  return {
    visible: false,
    parameter: {appId: '', tenantCode: ''},
    formState: 'edit',
    filterCol: 3,
    pageSize: resetListPageSize(),
    height: resetListHeight(),
  }
};
// 字典管理
const dictListParams = ref(generateListParams());
// 角色管理
const roleListParams = ref(generateListParams());
// 编码管理
const encodingListParams = ref(generateListParams());
// 文件管理
const fileListParams = ref(generateListParams());
// 系统配置
const configListParams = ref(generateListParams());

const userTreeParams = ref({
  visible: false, parameter: {appId: '', tenantCode: ''}, height: resetTreeHeight()
});
const userPerListParams = ref(generateListParams());

/**
 * 登出功能
 */
const handleLogout = () => {
  ideLogout();
};
/**
 * 浏览器高度调整时事件
 */
const handleResize = () => {
  const listRecord = {height: resetListHeight(), pageSize: resetListPageSize()}
  switch (tabsKey.value) {
    case 1: // 应用信息
      appModelParams.value.height = resetAppModelHeight();
      break;
    case 2: // 应用字典
      Object.assign(dictListParams.value, listRecord);
      break;
    case 3: // 应用角色
      Object.assign(roleListParams.value, listRecord);
      break;
    case 4: // 应用编码
      Object.assign(encodingListParams.value, listRecord);
      break;
    case 5: // 应用文件
      Object.assign(fileListParams.value, listRecord);
      break;
    case 6: // 应用配置
      Object.assign(configListParams.value, listRecord);
      break;
    case 7: // 应用配置
      Object.assign(userPerListParams.value, listRecord);
      Object.assign(userTreeParams.value, {height: resetTreeHeight()});
      splitHeight.value = resetSplitHeight();
      break;
    default:
      break;
  }
}

/**
 * 获取应用信息
 * @param id
 * @param successBack
 * @param failBack
 */
const getAppData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await applicationApi.getApp(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 更新应用信息
 */
const updateApp = () => {
  setLoading(true)
  // @ts-ignore
  if (tableFormRef.value && typeof tableFormRef.value?.saveOrUpdate === 'function') {
    // @ts-ignore
    tableFormRef.value?.saveOrUpdate((data: QueryAppForm) => {
      setLoading(false);
      Message.success("更新成功！");
      appData.value = data;
    }, () => {
      setLoading(false);
    });
  }
};

/**
 * 打开链接
 * @param type
 */
const enterLink = (type: string) => {
  if (appData.value.id && appData.value.tenantCode) {
    const host = `${window.location.protocol}//${window.location.host}`;
    const params = `tenantCode=${appData.value.tenantCode}&appId=${appData.value.id}&appName=${appData.value.name}`;
    switch (type) {
      case 'index':
        window.open(`${host}/${appData.value.tenantCode}/${appData.value.id}/page`, "_blank");
        break;
      case 'design':
        window.open(`${host}/ide.html?${params}`, "_blank");
        break;
      case 'version':
        window.open(`${host}/appVersion.html?${params}`, "_blank");
        break;
      case 'manage':
        break;
      default:
        break;
    }
  }
}

/**
 * 选中添加、取消移除
 * @param isSelected
 * @param data
 */
const selectChange = (isSelected: boolean, data: QueryOrgForm, forms: QueryOrgForm[]) => {
  const params = {orgIds: [] as string[], orgNames: [] as string[]};
  if (forms && forms.length > 0) {
    forms.forEach((item) => {
      params.orgIds.push(item.id);
      params.orgNames.push(item.name);
    });
  }
  Object.assign(userPerListParams.value.parameter, {
    orgId: params.orgIds.length > 0 ? params.orgIds.join() : '',
    orgName: params.orgNames.length > 0 ? params.orgNames.join() : '',
  })
}

onMounted(() => {
  // 未登录重定向
  if (!authUtil.getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  window.addEventListener(EventNames.WindowResize, handleResize);
  // 加载配置变量
  const urlParams = new URL(window.location.href).searchParams;
  appData.value.id = urlParams.get('appId') || '';
  if (appData.value.id) {
    getAppData(appData.value.id, (data: QueryAppForm) => {
      appData.value = data;
      // 系统参数
      userStore.info(() => {
        userApi.getSysConfig(global, userStore, {
          appId: data.id, tenantCode: data.tenantCode || '',
        });
      });
      document.title = `应用配置 | ${data.name}`;
      // 应用基本信息
      Object.assign(appModelParams.value, {
        visible: true, id: data.id, parameter: {appId: data.id, tenantCode: data.tenantCode || ''}
      })
      // 列表
      const listRecord = {visible: true, parameter: {appId: data.id, tenantCode: data.tenantCode || ''}}
      // 字典管理
      Object.assign(dictListParams.value, listRecord);
      // 角色管理
      Object.assign(roleListParams.value, listRecord);
      // 编码管理
      Object.assign(encodingListParams.value, listRecord);
      // 文件管理
      Object.assign(fileListParams.value, listRecord);
      // 系统配置
      Object.assign(configListParams.value, listRecord);
      // 用户管理
      Object.assign(userTreeParams.value, listRecord);
      // 组织管理
      userPerListParams.value.filterCol = 2;
      Object.assign(userPerListParams.value, cloneDeep(listRecord));
    });
  }

  showPage.value = true;
});

onUnmounted(() => {
  window.removeEventListener(EventNames.WindowResize, handleResize);
  emitter.off(EventNames.GlIdeLogout, handleLogout);
});
</script>
<template>
  <div class="gl-app-settings">
    <div v-if="!appData.id">
      <a-alert>
        请在url中传入appId参数，如：https://域名:端口/appSettings.html?tenantCode=?&appId=?&appName=?。
      </a-alert>
    </div>
    <div v-else>
      <div :style="{ padding: '4px 14px' }" class="gl-page-header">
        <a-page-header title="应用设置" :subtitle="appData.name" :show-back="false">
          <template #extra>
            <a-space>
              <a-button type="text" class="app-button" @click="enterLink('index')">
                <template #icon>
                  <icon-link/>
                </template>
                应用站点
              </a-button>
              <a-button type="text" class="app-button" @click="enterLink('design')">
                <template #icon>
                  <icon-link/>
                </template>
                设计站点
              </a-button>
              <a-button type="text" class="app-button" @click="enterLink('version')">
                <template #icon>
                  <icon-link/>
                </template>
                版本管理
              </a-button>
            </a-space>
          </template>
        </a-page-header>
      </div>
      <div :style="{ padding: '14px' }">
        <a-card>
          <a-tabs v-model:active-key="tabsKey" :default-active-key="1" direction="vertical" :lazy-load="true">
            <a-tab-pane :key="1">
              <template #title>
                <icon-calendar/>
                基本信息
              </template>
              <a-card class="general-card">
                <template #extra>
                  <a-space>
                    <a-popconfirm content="是否更新该应用的基本信息？" position="br" type="info" @ok="updateApp">
                      <a-button :disabled="!appModelParams.id" type="text" :loading="loading">
                        <template #icon>
                          <icon-save/>
                        </template>
                        更新
                      </a-button>
                    </a-popconfirm>
                  </a-space>
                </template>
                <a-scrollbar :style="{overflow:'auto',height:`${appModelParams.height}px`}">
                  <div style="width: 98.6%;">
                    <GlApplicationModel ref="tableFormRef"
                                        :visible="appModelParams.visible"
                                        :parameter="appModelParams.parameter"
                                        :formState="appModelParams.formState"
                                        :modelValue="appModelParams.id"
                                        :formCol="appModelParams.formCol"/>
                  </div>
                </a-scrollbar>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="2">
              <template #title>
                <icon-clock-circle/>
                应用字典
              </template>
              <a-card class="general-card">
                <GlDictionaryList :visible="dictListParams.visible"
                                  :parameter="dictListParams.parameter"
                                  :formState="dictListParams.formState"
                                  :filterCol="dictListParams.filterCol"
                                  :pageSize="dictListParams.pageSize"
                                  :height="dictListParams.height"/>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="3">
              <template #title>
                <icon-user/>
                应用角色
              </template>
              <a-card class="general-card">
                <GlRoleList :visible="roleListParams.visible"
                            :parameter="roleListParams.parameter"
                            :formState="roleListParams.formState"
                            :filterCol="roleListParams.filterCol"
                            :pageSize="roleListParams.pageSize"
                            :height="roleListParams.height"/>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="7">
              <template #title>
                <icon-user-add/>
                用户授权
              </template>
              <a-card class="general-card">
                <a-split v-model:size="splitSize" :min="splitMin"
                         :style="{height: `${splitHeight}px`,width: '100%'}">
                  <template #first>
                    <div class="general-card1" style="padding-right: 10px;">
                      <GlOrgSelectTree :has-root="true"
                                       :root-selected="false"
                                       :check-strictly="false"
                                       :height="userTreeParams.height"
                                       :max-count="1"
                                       :parameter="userTreeParams.parameter"
                                       :visible="true"
                                       @change="selectChange"/>
                    </div>
                  </template>
                  <template #second>
                    <div class="general-card1" style="padding-left: 10px;">
                      <GlUserPermissionList :visible="userPerListParams.visible"
                                            :parameter="userPerListParams.parameter"
                                            :formState="userPerListParams.formState"
                                            :filterCol="userPerListParams.filterCol"
                                            :pageSize="userPerListParams.pageSize"
                                            :height="userPerListParams.height"/>
                    </div>
                  </template>
                </a-split>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="4">
              <template #title>
                <icon-code-block/>
                字段编码
              </template>
              <a-card class="general-card">
                <GlEncodingList :visible="encodingListParams.visible"
                                :parameter="encodingListParams.parameter"
                                :formState="encodingListParams.formState"
                                :filterCol="encodingListParams.filterCol"
                                :pageSize="encodingListParams.pageSize"
                                :height="encodingListParams.height"/>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="5">
              <template #title>
                <icon-file/>
                应用文件
              </template>
              <a-card class="general-card">
                <GlFileTemplateList :visible="fileListParams.visible"
                                    :parameter="fileListParams.parameter"
                                    :formState="fileListParams.formState"
                                    :filterCol="fileListParams.filterCol"
                                    :pageSize="fileListParams.pageSize"
                                    :height="fileListParams.height"/>
              </a-card>
            </a-tab-pane>
            <a-tab-pane :key="6">
              <template #title>
                <icon-settings/>
                应用参数
              </template>
              <a-card class="general-card">
                <GlSystemConfigList :visible="configListParams.visible"
                                    :parameter="configListParams.parameter"
                                    :formState="configListParams.formState"
                                    :filterCol="configListParams.filterCol"
                                    :pageSize="configListParams.pageSize"
                                    :height="configListParams.height"/>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.gl-app-settings .gl-page-header {
  //border-bottom: 1px #04559f solid;
  background-image: url('@/assets/images/bg/page-header-bg-layered-peaks.png');
  background-size: cover;
}

.gl-app-settings .arco-page-header-title {
  color: white;
}

.gl-app-settings .arco-page-header-subtitle {
  color: white;
  font-size: 16px;
}

.gl-app-settings .app-button {
  color: white !important;
  padding: 0 10px;
}

.gl-app-settings .app-button[type='button']:hover {
  background-color: transparent;
}
</style>
