<script lang="ts">
export default {
  name: 'AppVersion',
};
</script>
<script lang="ts" setup>
import {compile, computed, h, onMounted, onUnmounted, provide, ref} from 'vue';
import {Message} from "@arco-design/web-vue";
import cloneDeep from "lodash/cloneDeep";
import {EventNames} from '@geelato/gl-ide';
import {
  emitter,
  useGlobal,
  authUtil,
  isUtil,
  stringUtil,
  utils,
  userApi,
  applicationApi,
  fileApi,
  versionApi,
  modelApi,
  sysConfigApi,
  encodingApi
} from "@geelato/gl-ui";
import type {QueryAppForm, QueryAppVersionForm, QueryTableForm, PageQueryRequest} from "@geelato/gl-ui";
import {useUser, useLoading, useUserStore, getPinia, packageStatusOptions, PageSizeOptions} from "@geelato/gl-ui-arco-admin";
import {handleUrlParams, validateIde, validateIdeUrl} from "./utils";

// 常量使用
const ListDefaultPageSize = 5;
const ListUsedHeight = 425;
const ListRowHeight = 49;

const versionCompareTabs = ref(null);

provide('pinia', getPinia());
const userStore = useUserStore();
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();
// 获取url参数
const urlParams = ref<Record<string, string>>({});
// 页面显示状态, 0:错误，1：正常，2：待校验
const showPage = ref<Record<string, any>>({valid: 2, message: ''});

const appData = ref<QueryAppForm>({} as unknown as QueryAppForm);
const {loading, setLoading} = useLoading(false);
const tabsKey = ref<number>(1);
const isCompare = ref<boolean>(false);
const compareVersionId = ref<string>('');
const appVersionData = ref<QueryAppVersionForm[]>([]);
const packLoading = ref(false);
const deployLoading = ref(false);
const deployCompareLoading = ref(false);
const downloadLoading = ref(false);
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
  return utils.resetValueByOptions(PageSizeOptions, (resetListHeight() / ListRowHeight), ListDefaultPageSize);
}

const listParams = ref({
  load: utils.generateRandom(),
  visible: false,
  parameter: {versionInfo: '', appId: '', tenantCode: ''},
  formState: 'edit',
  pageSize: 10000,
  height: resetTreeHeight(),
  selected: {id: '', title: '', status: '', item: {}},
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
    const {data} = await applicationApi.getApp(id);
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
    const {data} = await versionApi.pageQueryAppVersions({
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

const originAppVersionData = computed(() => {
  const data = [];
  for (let i = 0; i < appVersionData.value.length; i += 1) {
    const item = appVersionData.value[i];
    data.push({
      label: `${i + 1}, ${item.version} ${utils.getOptionLabel(item.status, packageStatusOptions.value)}`,
      value: item.id,
      disabled: item.id === listParams.value.selected.id
    });
  }
  return data;
});

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
  downloadLoading.value = false;
  if (record.id) {
    Object.assign(listParams.value.selected, {
      id: record.id,
      title: `${record.version} | ${record.packetTime || record.createAt}`,
      status: record.status,
      item: record
    });
  } else {
    Object.assign(listParams.value.selected, {id: '', title: '', status: '', item: {}});
  }
}

const packetCompare = async (record: QueryAppVersionForm, appointMetas: Record<string, string>) => {
  deployCompareLoading.value = true;
  try {
    const version = `${appData.value.code}_version${stringUtil.formatTime(new Date(), 'yyyyMMddHHmmss')}`;
    const description = record ? `当前环境基于版本【${record.version}】对比打包形成的应用包` : '当前环境打包形成的应用包';
    const {data} = await versionApi.packetMergeAppVersion(appData.value.id, version, description, appointMetas);
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
        packetCompare(item, result);
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

const downloadPacket = async (id: string) => {
  downloadLoading.value = true;
  await fileApi.fetchFileById(id, null, () => {
    downloadLoading.value = false;
  }, () => {
    downloadLoading.value = false;
  });
}

/**
 * 同步表至数据库
 */
const syncTableToData = async () => {
  syncTableLoading.value = true;
  const msgLoading = Message.loading({content: `正在将 ${appData.value.name} 下的所有模型同步至数据库`, duration: 60 * 60 * 1000});
  try {
    const tableResult = await modelApi.initTables(appData.value.id);
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
    const viewResult = await modelApi.initViews(appData.value.id);
    initViewResult(viewResult.data);
  } catch (err) {
    Message.error(`${appData.value.name} 下的所有视图同步至数据库失败`);
  } finally {
    syncViewLoading.value = false;
    msgLoading.close();
  }
}

const packAppVersion = async (done: any) => {
  packLoading.value = true;
  try {
    if (!packData.value.version || !packData.value.description) {
      Message.warning('打包版本号和描述不能为空！');
      done(false);
      return;
    }
    const valid = await versionApi.validateAppVersion({
      version: packData.value.version, description: packData.value.description, appId: appData.value.id,
    } as unknown as QueryAppVersionForm);
    if (!valid.data) {
      Message.warning('打包版本号已存在！');
      done(false);
      return;
    }
    const {data} = await versionApi.packetAppVersion(appData.value.id, packData.value.version, packData.value.description);
    Message.success('打包成功!');
    // @ts-ignore
    listParams.value.selected.id = data.id || '';
    done(true);
  } catch (err) {
    done(false);
  } finally {
    packLoading.value = false;
  }
}

const querySysConfigValueByKey = async (key: string) => {
  packDefaultData.value = packDefaultData.value || {};
  try {
    const {data} = await sysConfigApi.getValueByKeys(key);
    packDefaultData.value = isUtil.isJSON(data) ? JSON.parse(data) : {};
  } catch (err) {
    console.log(err);
  }
}

const generateEncodingById = async (key: string) => {
  packDefaultData.value = packDefaultData.value || {};
  packDefaultData.value.encoding = '';
  try {
    const {data} = await encodingApi.generateCode(key);
    packDefaultData.value.encoding = data as unknown as string;
  } catch (err) {
    console.log(err);
  }
}

const queryAppTables = async (successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.queryTables({
      order: 'entityName|asc', tenantCode: appData.value.tenantCode
    } as unknown as PageQueryRequest);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}

const duplicateArray = (data: QueryTableForm[]) => {
  const names: string[] = [];
  const indexs: number[] = [];
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (!names.includes(data[i].entityName)) {
        names.push(data[i].entityName);
      } else {
        indexs.push(i);
      }
    }
    for (let i = 0; i < indexs.length; i += 1) data.splice(indexs[i], 1);
  }
}

const packetAppVersionClick = async () => {
  await querySysConfigValueByKey('packetVersionExtra');
  await generateEncodingById("5283664243797921792");
  await queryAppTables((data: QueryTableForm[]) => {
    Object.assign(packData.value, {
      visible: false, first: [] as QueryTableForm[], second: [] as QueryTableForm[],
      version: `${appData.value.code}_version${stringUtil.formatTime(new Date(), 'yyyyMMddHHmmss')}`,
      description: '当前环境打包形成的应用包',
      extra: packDefaultData.value.extra || [],
    });
    if (packDefaultData.value.encoding) {
      packData.value.version = `${appData.value.code}_${packDefaultData.value.encoding}.${stringUtil.formatTime(new Date(), 'yyyyMMddHHmmss')}`;
    }
    if (data && data.length > 0) {
      const firstEntityNames = packDefaultData.value.first || [];
      const secondEntityNames = packDefaultData.value.second || [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        // 增量为：仅插入打包数据，不修改不删除表数据。
        if (firstEntityNames.includes(item.entityName)) packData.value.first.push(item);
        // 全量为：先清空表再插入打包数据。
        if (secondEntityNames.includes(item.entityName)) packData.value.second.push(item);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        // 增量为：仅插入打包数据，不修改不删除表数据。
        if (item.packBusData === 1) packData.value.first.push(item);
        // 全量为：先清空表再插入打包数据。
        if (item.packBusData === 2) packData.value.second.push(item);
      }
      // 去除重复的表
      duplicateArray(packData.value.first || []);
      duplicateArray(packData.value.second || []);
      // 渲染
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
    const result = await versionApi.deployAppVersion(item.id);
    Message.success("应用部署成功！");
    window.location.reload();
  } catch (err) {
    console.error(err);
  } finally {
    deployLoading.value = false;
    msgLoading.close();
  }
}

const releaseVersion = async (item: QueryAppVersionForm) => {
  try {
    const params = cloneDeep(item);
    params.status = 'release';
    // @ts-ignore
    delete params.active;
    // @ts-ignore
    delete params.sort;
    await versionApi.createOrUpdateAppVersion(params);
    Message.success("发布成功");
    listParams.value.load = utils.generateRandom();
  } catch (err) {
    console.error(err);
  }
}

const deleteVersion = async (item: QueryAppVersionForm) => {
  try {
    await versionApi.deleteAppVersion(item.id);
    Message.success("删除成功");
    listParams.value.selected.id = '';
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  // 未登录重定向
  if (!authUtil.getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  window.addEventListener(EventNames.WindowResize, handleResize);
  // 获取url参数
  urlParams.value = handleUrlParams();
  // 校验url参数
  showPage.value = validateIdeUrl(urlParams.value, "appVersion");
  if (showPage.value.valid !== 1) return;
  // 数据校验
  const {valid, message} = await validateIde(urlParams.value);
  showPage.value = {valid, message};
  if (valid !== 1) return;
  // 更新标题
  document.title = `应用版本管理 | ${urlParams.value.appName}`;
  // 应用信息
  appData.value = global.$gl.app || {};
  // 查询版本列表
  await queryAppVersion();
  compareVersionId.value = "";
  // 列表
  const listRecord = {
    visible: true, parameter: {
      versionInfo: appData.value.versionInfo || '',
      appId: appData.value.id || '',
      tenantCode: appData.value.tenantCode || ''
    }
  }
  Object.assign(listParams.value, listRecord);
});

onUnmounted(() => {
  window.removeEventListener(EventNames.WindowResize, handleResize);
  emitter.off(EventNames.GlIdeLogout, handleLogout);
});
</script>
<template>
  <div class="gl-app-settings">
    <div v-if="showPage.valid===0">
      <a-alert>{{ showPage.message }}</a-alert>
    </div>
    <div v-else-if="showPage.valid===1">
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
                <GlAppVersionList v-if="listParams.visible"
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
                        <a-button v-if="!isCompare&&!['draft'].includes(listParams.selected.status)" :loading="downloadLoading"
                                  style="color: rgb(var(--primary-6))"
                                  type="text" @click.stop="downloadPacket(listParams.selected.item.packagePath)">
                          <icon-download/>
                          下载
                        </a-button>
                        <a-popconfirm v-if="!isCompare && !syncTableLoading && !syncViewLoading && !['draft'].includes(listParams.selected.status)"
                                      content="确认部署当前版本？" position="br" @ok="deployVersion(listParams.selected.item)">
                          <a-button :loading="deployLoading" style="color: rgb(var(--success-6))" type="text">
                            <icon-star/>
                            部署
                          </a-button>
                        </a-popconfirm>
                        <a-popconfirm v-if="!isCompare && !syncTableLoading && !syncViewLoading && ['draft'].includes(listParams.selected.status)"
                                      content="确认发布当前版本（将状态变更为‘已发布’）？" position="br" @ok="releaseVersion(listParams.selected.item)">
                          <a-tooltip content="将版本状态变更为‘已发布’，发布后才能‘下载’、‘部署’" position="tr">
                            <a-button style="color: rgb(var(--success-6))" type="text">
                              <icon-send/>
                              发布
                            </a-button>
                          </a-tooltip>
                        </a-popconfirm>
                        <a-popconfirm
                            v-if="!isCompare && !syncTableLoading && !syncViewLoading && !deployLoading && !['deployed'].includes(listParams.selected.status)"
                            content="是否删除该版本数据？" position="br" type="warning" @ok="deleteVersion(listParams.selected.item)">
                          <a-button style="color: rgb(var(--danger-6))" type="text">
                            <icon-delete/>
                            删除
                          </a-button>
                        </a-popconfirm>
                        <div v-if="isCompare">
                          <a-select v-model="compareVersionId" :options="originAppVersionData" :style="{width:'320px'}"
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
                    <GlAppVersionCompareTabs v-if="!!compareVersionId"
                                             ref="versionCompareTabs"
                                             :compareId="compareVersionId"
                                             :height="listParams.height"
                                             :model-value="listParams.selected.id"
                                             :visible="true"
                                             @canPacket="(can)=>{isCanPacket = can}"/>
                    <GlAppVersionTabs v-else :key="listParams.load"
                                      :height="listParams.height"
                                      :model-value="listParams.selected.id"
                                      :parameter="listParams.parameter"
                                      :visible="true"/>
                  </div>
                </div>
              </template>
            </a-split>
          </a-card>
        </a-spin>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="packData.visible" :on-before-ok="packAppVersion" :width="1250" draggable title="版本打包" title-align="start">
    <a-scrollbar :style="{overflow:'auto',maxHeight:`${packHeight}px`}">
      <a-descriptions :bordered="true" :column="1" layout="horizontal" size="medium">
        <template #title>
          <span style="font-weight: bold;">{{ `是否打包 ${appData.name}？` }}</span>
        </template>
        <a-descriptions-item label="版本名称">
          <a-input v-model="packData.version" class="pack-version-input" placeholder="请输入版本名称"/>
        </a-descriptions-item>
        <a-descriptions-item label="版本描述">
          <a-textarea v-model="packData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="125"
                      class="pack-version-input" placeholder="请输入版本描述" show-word-limit/>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :bordered="true" :column="3" layout="horizontal" size="medium" style="margin-top: 12px;">
        <template #title>
          <span>打包增量插入N项（用于部署时，只插入本次打包的数据，不修改不删除目标表数据；一般为需要在生产环境并行维护的数据，如系统的参数。）</span>
        </template>
        <a-descriptions-item v-for="(item,index) of packData.first" :key="index" :label="item.title">
          {{ item.entityName }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :bordered="true" :column="3" layout="horizontal" size="medium" style="margin-top: 12px;">
        <template #title>
          <span>打包全量更新M项（用于部署时，清空目标表之后插入本次打包的数据。）</span>
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

  <GlAppVersionForm v-model:visible="formParams.visible"
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
  min-width: 600px;
  width: 100%;
  border-bottom: 1px solid rgb(22, 93, 255) !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
  background-color: #FFFFFF !important;
}

.pack-version-item {

}
</style>
