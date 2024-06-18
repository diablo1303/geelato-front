<script lang="ts">
export default {
  name: 'AppVersion',
};
</script>
<script lang="ts" setup>
import {compile, h, onMounted, onUnmounted, provide, ref, shallowRef} from 'vue';
import {getToken} from '@/utils/auth';
import {getSysConfig} from '@/api/user';
import {Message, Modal} from "@arco-design/web-vue";
import cloneDeep from "lodash/cloneDeep";
import {EventNames} from '@geelato/gl-ide';
import {emitter, useGlobal} from '@geelato/gl-ui';
import useUser from '@/hooks/user';
import useLoading from "@/hooks/loading";
import {deleteAppVersion, deployAppVersion, getApp, packetAppVersion, pageQueryAppVersions, QueryAppForm, QueryAppVersionForm,} from "@/api/application";
import {initTables, initViews, QueryTableForm, queryTables} from "@/api/model";
import {PageQueryRequest, PageSizeOptions, resetValueByOptions} from '@/api/base';
import {fetchFileById} from "@/api/attachment";
import ApplicationModel from "@/views/application/model.vue";
import AppVersionList from "@/views/version/list.vue";
import AppVersionTabs from "@/views/version/tabsForm.vue";
import AppVersionForm from "@/views/version/form.vue";
import AppVersionCompareTabs from "@/views/compare/tabsForm.vue";
import {formatTime, generateRandom} from "@/utils/strings";
import {getValueByKeys} from "@/api/sysconfig";
import {isJSON} from "@/utils/is";
import pinia, {useUserStore} from '../../store';

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 425;
const ListRowHeight = 49;

const tableFormRef = shallowRef(ApplicationModel);
const versionCompareTabs = shallowRef(AppVersionCompareTabs);

provide('pinia', pinia);
const userStore = useUserStore();
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();
const appData = ref<QueryAppForm>({} as unknown as QueryAppForm);
const showPage = ref(false);
const {loading, setLoading} = useLoading(false);
const tabsKey = ref<number>(1);
const isCompare = ref<boolean>(false);
const compareVersionId = ref<string>('');
const appVersionData = ref<QueryAppVersionForm[]>([]);
const packLoading = ref(false);
const deployLoading = ref(false);
const deployCompareLoading = ref(false);
const isCanPacket = ref(false);
const syncTableLoading = ref(false);
const syncViewLoading = ref(false);
const packDefaultData = ref<Record<string, any>>({});
const packData = ref<Record<string, any>>({
  visible: false,
  first: [] as QueryTableForm[],
  second: [] as QueryTableForm[],
  version: '',
  description: '',
  extra: [] as string[],
});

/**
 * 调整树形结构高度
 */
const resetSplitHeight = () => {
  return window.innerHeight - 135;
}
const splitHeight = ref<number>(resetSplitHeight());
const splitMin = ref<number | string>('300px');
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
  return window.innerHeight - 180;
}
/**
 * 调整包结构高度
 */
const resetPackModelHeight = () => {
  return window.innerHeight * 0.7;
}
const packHeight = ref<number>(resetPackModelHeight());
/**
 * 调整列表展示行数
 */
const resetListPageSize = () => {
  return resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

const listParams = ref({
  load: generateRandom(),
  visible: false,
  parameter: {appId: '', tenantCode: ''},
  formState: 'edit',
  pageSize: 10000,
  height: resetTreeHeight(),
  selected: {id: '', title: '', item: {}},
});
const formParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '',
  height: '',
  parameter: {appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 1,
});

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
  listParams.value.height = resetTreeHeight();
  splitHeight.value = resetSplitHeight();
  packHeight.value = resetPackModelHeight();
}

/**
 * 获取应用信息
 * @param id
 * @param successBack
 * @param failBack
 */
const getAppData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getApp(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 查询版本列表
 */
const queryAppVersion = async (successBack?: any, failBack?: any) => {
  try {
    const {data} = await pageQueryAppVersions({
      current: 1, pageSize: 10000, order: "packetTime|desc",
      appId: appData.value.id, tenantCode: appData.value.tenantCode
    } as PageQueryRequest)
    appVersionData.value = data.items as unknown as QueryAppVersionForm[];
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    appVersionData.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

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
      case 'settings':
        window.open(`${host}/appSettings.html?${params}`, "_blank");
        break;
      case 'manage':
        break;
      default:
        break;
    }
  }
}

const listSelected = (record: QueryAppVersionForm) => {
  compareVersionId.value = "";
  isCompare.value = false;
  if (record.id) {
    Object.assign(listParams.value.selected, {
      id: record.id,
      title: `${record.version} | ${record.packetTime || record.createAt}`,
      item: record
    });
  } else {
    Object.assign(listParams.value.selected, {id: '', title: '', item: {}});
  }
}

const packetCompare = async (record: QueryAppVersionForm, appointMetas: Record<string, string>) => {
  deployCompareLoading.value = true;
  try {
    const version = `${appData.value.code}_version${formatTime(new Date(), 'yyyyMMddHHmmss')}`;
    const description = record ? `当前环境基于版本【${record.version}】对比打包形成的应用包` : '当前环境打包形成的应用包';
    const {data} = await packetAppVersion(appData.value.id, version, description, appointMetas);
    Message.success('打包成功!');
    // @ts-ignore
    listParams.value.selected.id = data.id || '';
  } catch (err) {
    console.log(err);
  } finally {
    deployCompareLoading.value = false;
  }
}

const deployCompareVersion = (item: QueryAppVersionForm) => {
  // @ts-ignore
  if (versionCompareTabs.value && typeof versionCompareTabs.value?.deploy === 'function') {
    // @ts-ignore
    versionCompareTabs.value?.deploy((result: Record<string, any>) => {
      if (result) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const versionId in result) {// 版本id => {}
          // eslint-disable-next-line guard-for-in,no-restricted-syntax
          for (const entityName in result[versionId]) {// 实体名称 => []
            const value = result[versionId][entityName];
            result[versionId][entityName] = !value || value.length === 0 ? '' : value.join(',');
          }
        }
        console.log(result);
        // packetCompare(item, result);
      } else {
        Message.warning('对比信息未加载完整，请稍等！');
      }
    });
  }
}

const startCompare = () => {
  queryAppVersion(() => {
    compareVersionId.value = "";
    isCompare.value = true;
  });
}
const cancelCompare = () => {
  compareVersionId.value = "";
  isCompare.value = false;
}

/**
 * 同步表至数据库
 */
const syncTableToData = async () => {
  syncTableLoading.value = true;
  const msgLoading = Message.loading({content: `正在将 ${appData.value.name} 下的所有模型同步至数据库`, duration: 60 * 60 * 1000});
  try {
    const tableResult = await initTables(appData.value.id);
    Message.success(`${appData.value.name} 下的所有模型同步至数据库成功`);
  } catch (err) {
    Message.error(`${appData.value.name} 下的所有模型同步至数据库失败`);
  } finally {
    syncTableLoading.value = false;
    msgLoading.close();
  }
}

const initViewResult = (result: Record<string, any>) => {
  const data: string[] = [];
  if (result && typeof result === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in result) {
      if (result[key] !== true) {
        data.push(`<p>${key} - ${result[key]}</p>`);
      }
    }
  }
  if (data.length > 0) {
    Message.error(`${appData.value.name} 下的所有视图同步至数据库失败`);
    Message.warning({content: () => h(compile(`${data.join('')}`)), duration: 15 * 1000});
  } else {
    Message.success(`${appData.value.name} 下的所有视图同步至数据库成功`);
  }
}

const syncViewToData = async () => {
  syncViewLoading.value = true;
  const msgLoading = Message.loading({content: `正在将 ${appData.value.name} 下的所有视图同步至数据库`, duration: 60 * 60 * 1000});
  try {
    const viewResult = await initViews(appData.value.id);
    initViewResult(viewResult.data);
  } catch (err) {
    Message.error(`${appData.value.name} 下的所有视图同步至数据库失败`);
  } finally {
    syncViewLoading.value = false;
    msgLoading.close();
  }
}

const packAppVersion = async () => {
  packLoading.value = true;
  try {
    const {data} = await packetAppVersion(appData.value.id, packData.value.version, packData.value.description);
    Message.success('打包成功!');
    // @ts-ignore
    listParams.value.selected.id = data.id || '';
  } catch (err) {
    console.log(err);
  } finally {
    packLoading.value = false;
  }
}

const querySysConfigValueByKey = async (key: string) => {
  packDefaultData.value = {};
  try {
    const {data} = await getValueByKeys(key);
    packDefaultData.value = isJSON(data) ? JSON.parse(data) : {};
  } catch (err) {
    console.log(err);
  }
}

const queryAppTables = async (successBack?: any, failBack?: any) => {
  try {
    const {data} = await queryTables({
      order: 'entityName|asc', tenantCode: appData.value.tenantCode
    } as unknown as PageQueryRequest);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}

const packetAppVersionClick = async () => {
  await querySysConfigValueByKey('packetVersionExtra');
  await queryAppTables((data: QueryTableForm[]) => {
    Object.assign(packData.value, {
      visible: false, first: [] as QueryTableForm[], second: [] as QueryTableForm[],
      version: `${appData.value.code}_version${formatTime(new Date(), 'yyyyMMddHHmmss')}`,
      description: '当前环境打包形成的应用包',
      extra: packDefaultData.value.extra || [],
    });
    if (data && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        // 增量为：仅插入打包数据，不修改不删除表数据。
        if ((packDefaultData.value.first && packDefaultData.value.first.includes(item.entityName))
            || (item.appId === appData.value.id && item.packBusData === 1)) {
          packData.value.first.push(item);
        }
        // 全量为：先清空表再插入打包数据。
        if ((packDefaultData.value.second && packDefaultData.value.second.includes(item.entityName))
            || (item.appId === appData.value.id && item.packBusData === 2)) {
          packData.value.second.push(item);
        }
      }
      Object.assign(packData.value, {visible: true});
    } else {
      Message.error('没有找到表');
    }
  });
}

const saveSuccess = (record: QueryAppVersionForm, action: string) => {
  listParams.value.selected.id = record.id || '';
}

const openAppVersionForm = () => {
  Object.assign(formParams.value, {
    visible: true, id: '', title: '版本上传', formState: 'add',
    parameter: {appId: appData.value.id, tenantCode: appData.value.tenantCode},
  });
}

const deployVersion = async (item: QueryAppVersionForm) => {
  deployLoading.value = true;
  const msgLoading = Message.loading({content: `${appData.value.name} 正在部署版本 ${item.version}`, duration: 60 * 60 * 1000});
  try {
    const result = await deployAppVersion(item.id);
    Message.success("应用部署成功！");
    window.location.reload();
  } catch (err) {
    console.error(err);
  } finally {
    deployLoading.value = false;
    msgLoading.close();
  }
}
const deleteVersion = async (item: QueryAppVersionForm) => {
  try {
    await deleteAppVersion(item.id);
    Message.success("删除成功");
    listParams.value.selected.id = '';
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  // 未登录重定向
  if (!getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  window.addEventListener(EventNames.WindowResize, handleResize);
  // 加载配置变量
  const urlParams = new URL(window.location.href).searchParams;
  appData.value.id = urlParams.get('appId') || '';
  if (appData.value.id) {
    getAppData(appData.value.id, (data: QueryAppForm) => {
      appData.value = data;
      // 查询版本列表
      queryAppVersion();
      compareVersionId.value = "";
      // 系统参数
      userStore.info(() => {
        getSysConfig(global, userStore && userStore.userInfo, {
          appId: data.id, tenantCode: data.tenantCode || '',
        });
      });
      document.title = `应用版本管理 | ${data.name}`;
      // 列表
      const listRecord = {visible: true, parameter: {appId: data.id, tenantCode: data.tenantCode || ''}}
      Object.assign(listParams.value, listRecord);
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
        <a-page-header :show-back="false" :subtitle="`${appData.name} ${appData.versionInfo}`" title="应用版本管理">
          <template #extra>
            <a-space>
              <a-button v-if="!deployLoading" class="app-button" type="text" @click="openAppVersionForm">
                <template #icon>
                  <icon-import/>
                </template>
                上传版本
              </a-button>
              <a-button v-if="!deployLoading" :loading="packLoading" class="app-button" type="text" @click="packetAppVersionClick">
                <template #icon>
                  <icon-export/>
                </template>
                应用打包
              </a-button>
              <a-divider v-if="!deployLoading" direction="vertical" style="margin: 0px 1px;height: 16px;"/>
              <a-popconfirm v-if="!syncViewLoading && !deployLoading" content="是否将应用下所有模型同步至数据库？" position="br" type="warning"
                            @ok="syncTableToData">
                <a-tooltip content="将模型同步至数据库（部署后使用）" position="right">
                  <a-button :loading="syncTableLoading" class="app-button" type="text">
                    <template #icon>
                      <icon-storage/>
                    </template>
                    同步模型
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
              <a-popconfirm v-if="!syncTableLoading && !deployLoading" content="是否将应用下所有视图同步至数据库？" position="br" type="warning"
                            @ok="syncViewToData">
                <a-tooltip content="将视图同步至数据库（模型同步后使用）" position="right">
                  <a-button :loading="syncViewLoading" class="app-button" type="text">
                    <template #icon>
                      <icon-storage/>
                    </template>
                    同步视图
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
              <a-divider v-if="!deployLoading" direction="vertical" style="margin: 0px 1px;height: 16px;"/>
              <a-button class="app-button" type="text" @click="enterLink('index')">
                <template #icon>
                  <icon-link/>
                </template>
                应用站点
              </a-button>
              <a-button class="app-button" type="text" @click="enterLink('design')">
                <template #icon>
                  <icon-link/>
                </template>
                设计站点
              </a-button>
              <a-button class="app-button" type="text" @click="enterLink('settings')">
                <template #icon>
                  <icon-link/>
                </template>
                配置管理
              </a-button>
            </a-space>
          </template>
        </a-page-header>
      </div>
      <div :style="{ padding: '14px' }">
        <a-spin :loading="!isCanPacket&&isCompare&&!!compareVersionId" dot style="width: 100%" tip="">
          <template #tip>
            <p>正在进行版本比对，请耐心等待...</p>
            <p style="color: rgb(var(--warning-6))">
              说明：标签带有
              <IconExclamationCircle/>
              表示存在差异；若没有，则表示完全相同。
            </p>
          </template>
          <a-card>
            <a-split v-model:size="splitSize" :min="splitMin" :style="{height: `${splitHeight}px`,width: '100%'}">
              <template #first>
                <AppVersionList v-if="listParams.visible"
                                :key="listParams.load"
                                :form-state="listParams.formState"
                                :height="listParams.height"
                                :model-value="listParams.selected.id"
                                :page-size="listParams.pageSize"
                                :parameter="listParams.parameter"
                                :visible="listParams.visible"
                                @listSelected="listSelected"/>
              </template>
              <template #second>
                <div class="general-card3">
                  <div class="card-header">
                    <a-space style="width: 100%;justify-content: space-between;">
                      <div class="card-header-title">
                        {{ listParams.selected.title }}&nbsp;
                        <a-popconfirm v-if="isCanPacket&&isCompare&&!!compareVersionId" content="确定打包修正后的版本？" position="br"
                                      @ok="deployCompareVersion(listParams.selected.item)">
                          <a-button :loading="deployCompareLoading" style="color: rgb(var(--success-6))" type="text">
                            <icon-export/>&nbsp;对比打包
                          </a-button>
                        </a-popconfirm>
                      </div>
                      <a-space v-if="!!listParams.selected.id" class="card-header-extra">
                        <a-button v-if="!isCompare" style="color: rgb(var(--primary-6))" type="text" @click.stop="startCompare">
                          <icon-common/>
                          比较
                        </a-button>
                        <a-button v-if="!isCompare" style="color: rgb(var(--primary-6))" type="text"
                                  @click.stop="fetchFileById(listParams.selected.item.packagePath)">
                          <icon-download/>
                          下载
                        </a-button>
                        <a-popconfirm v-if="!isCompare && !syncTableLoading && !syncViewLoading" content="确认部署当前版本？" position="br"
                                      @ok="deployVersion(listParams.selected.item)">
                          <a-button :loading="deployLoading" style="color: rgb(var(--success-6))" type="text">
                            <icon-star/>
                            部署
                          </a-button>
                        </a-popconfirm>
                        <a-popconfirm v-if="!isCompare && !syncTableLoading && !syncViewLoading && !deployLoading" content="是否删除该版本数据？" position="br"
                                      type="warning" @ok="deleteVersion(listParams.selected.item)">
                          <a-button style="color: rgb(var(--danger-6))" type="text">
                            <icon-delete/>
                            删除
                          </a-button>
                        </a-popconfirm>
                        <div v-if="isCompare">
                          <a-select v-model="compareVersionId" :field-names="{'label':'version','value':'id'}"
                                    :options="appVersionData.filter(item => item.id !== listParams.selected.id)"
                                    :style="{width:'320px'}"
                                    allow-clear allow-search placeholder="选中比较版本">
                            <template #prefix>对比版本</template>
                          </a-select>
                          <a-button style="padding: 0 8px;" type="dashed" @click.stop="cancelCompare">
                            关闭
                          </a-button>
                        </div>
                      </a-space>
                    </a-space>
                  </div>
                  <a-divider style="margin:0 0 5px 0"/>
                  <div v-if="!!listParams.selected.id" class="card-body2">
                    <AppVersionCompareTabs v-if="!!compareVersionId"
                                           ref="versionCompareTabs"
                                           :compareId="compareVersionId"
                                           :height="listParams.height"
                                           :model-value="listParams.selected.id"
                                           :visible="true"
                                           @canPacket="(can)=>{isCanPacket = can}"/>
                    <AppVersionTabs v-else :height="listParams.height" :model-value="listParams.selected.id" :visible="true"/>
                  </div>
                </div>
              </template>
            </a-split>
          </a-card>
        </a-spin>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="packData.visible" :width="1150" title="版本打包" title-align="start" @ok="packAppVersion">
    <a-scrollbar :style="{overflow:'auto',maxHeight:`${packHeight}px`}">
      <a-descriptions :bordered="true" :column="1" layout="horizontal" size="medium">
        <template #title>
          <span style="font-weight: bold;">{{ `是否打包 ${appData.name}？` }}</span>
        </template>
        <a-descriptions-item label="版本名称">
          <a-input v-model="packData.version" class="pack-version-input" placeholder="请输入版本名称"/>
        </a-descriptions-item>
        <a-descriptions-item label="版本描述">
          <a-textarea v-model="packData.description" :auto-size="{minRows:1,maxRows:4}" :max-length="125"
                      class="pack-version-input" placeholder="请输入版本描述" show-word-limit/>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :bordered="true" :column="3" layout="horizontal" size="medium" style="margin-top: 12px;">
        <template #title>
          <span>增量插入（仅插入打包数据，不修改不删除表数据）</span>
        </template>
        <a-descriptions-item v-for="(item,index) of packData.first" :key="index" :label="item.title">
          {{ item.entityName }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :bordered="true" :column="3" layout="horizontal" size="medium" style="margin-top: 12px;">
        <template #title>
          <span>全量更新（先清空表再插入打包数据）</span>
        </template>
        <a-descriptions-item v-for="(item,index) of packData.second" :key="index" :label="item.title">
          {{ item.entityName }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :bordered="true" :column="3" layout="horizontal" size="medium" style="margin-top: 12px;">
        <template #title>
          <span>其他提示</span>
        </template>
      </a-descriptions>
      <a-list v-if="packData.extra.length>0" :bordered="true" :split="true" size="small">
        <a-list-item v-for="(item,index) of packData.extra" :key="index" style="padding: 5px 20px;">
          {{ item }}
        </a-list-item>
      </a-list>
    </a-scrollbar>
  </a-modal>

  <AppVersionForm v-model:visible="formParams.visible"
                  :formCol="formParams.formCol"
                  :formState="formParams.formState"
                  :height="formParams.height"
                  :isModal="formParams.isModal"
                  :modelValue="formParams.id"
                  :parameter="formParams.parameter"
                  :title="formParams.title"
                  :width="formParams.width"
                  @saveSuccess="saveSuccess"/>
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

.general-card3 {
  .card-header {
    height: 32px;
    padding: 2px 16px;

    .card-header-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
    }
  }
}

.pack-version-title {
  font-weight: 600;
}

.pack-version-content {
  margin-top: 5px;
  border-top: 1px solid var(--color-neutral-6);
}

.pack-version-input {
  outline: none;
  width: 600px;
  border-bottom: 1px solid rgb(22, 93, 255) !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  background-color: #FFFFFF !important;
}

.pack-version-item {

}
</style>
