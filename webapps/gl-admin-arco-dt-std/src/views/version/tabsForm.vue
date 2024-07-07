<script lang="ts">
export default {
  name: 'AppVersionTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {getAppSelectOptions, getAppVersion, QueryAppForm, queryAppPackage, QueryAppVersionForm} from "@/api/application";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import UploadFile from "@/components/upload-file/index.vue";
import PlatformApiList from "@/views/version/package/platform-api.vue";
import PlatformDictList from "@/views/version/package/platform-dict.vue";
import PlatformModelList from "@/views/version/package/platform-model.vue";
import PlatformRoleList from "@/views/version/package/platform-role.vue";
import PlatformSysConfigList from "@/views/version/package/platform-sys-config.vue";
import PlatformExportTemplateList from "@/views/version/package/platform-export-template.vue";
import PlatformEncodingList from "@/views/version/package/platform-encoding.vue";
import PlatformResourcesList from "@/views/version/package/platform-resources.vue";
import PlatformPageList from "@/views/version/package/platform-page.vue";
import PlatformPacketList from "@/views/version/package/platform-packet.vue";
import {Message} from "@arco-design/web-vue";
import {AppMeta, generateRenderData, PageParams} from "@/views/compare/type";
import {getOptionLabel} from "../../api/base";
import {packageSourceOptions, packageStatusOptions} from "./searchTable";

const emits = defineEmits(['update:modelValue', 'toModel', 'toTable']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  height: {type: Number, default: 0},// 表单宽度
});

const {t} = useI18n();// 国际化
const tabsKey = ref<number>(1);// 定位tabs页面
const tableData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appSelectOptions = ref<QueryAppForm[]>([]);
const appVersion = ref<Record<string, any>>({});
const appMetaList = ref<AppMeta[]>([]);
const tabsVisible = ref(false);
const openTabsLoading = ref(false);
const renderData = ref(generateRenderData());

const generateListParams = () => {
  return {
    visible: false,
    parameter: {appCode: '', appId: '', tenantCode: ''},
    formState: props.formState,
    height: props.height,
  }
};
const listParams = ref(generateListParams());

/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getAppVersion(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 打包的详细数据
 * @param id
 * @param successBack
 * @param failBack
 */
const getPackData = async (id: string, successBack?: any, failBack?: any) => {
  openTabsLoading.value = true;
  try {
    const {data} = await queryAppPackage(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    openTabsLoading.value = false;
  }
};

const getAppOptionLabel = (appId: string) => {
  if (appSelectOptions.value && appSelectOptions.value.length > 0) {
    for (let i = 0; i < appSelectOptions.value.length; i += 1) {
      if (appSelectOptions.value[i].id === appId) {
        return `（${appSelectOptions.value[i].name}）`;
      }
    }
  }
  return '';
}

/**
 * 获取模型数据，并处理
 * @param id
 */
const tableFormat = (id: string, successBack?: any) => {
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });

  getData(id, (data: QueryAppVersionForm) => {
    tableData.value = data;
  });
}

const generateListModels = () => {
  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const key in renderData.value) {
    // @ts-ignore
    renderData.value[key].data = appMetaList.value.find(item => item.metaName === renderData.value[key].code)?.metaData || [];
    // @ts-ignore
    // eslint-disable-next-line eqeqeq
    renderData.value[key].data = renderData.value[key].data.filter(item => item.del_status == 0);
  }
}

const loadTabs = (data: Record<string, any>) => {
  appMetaList.value = data?.appMetaList || [];
  console.log("getPackData", appMetaList.value);
  generateListModels();
  Object.assign(listParams.value, {
    visible: true, parameter: {
      "appCode": data?.appCode || '', "appId": data?.sourceAppId, tenantCode: ''
    },
  });
}

const openTabs = () => {
  if (props.modelValue) {
    tabsKey.value = 1;
    tabsVisible.value = true;
    appMetaList.value = [];
    renderData.value = generateRenderData();
    if (appVersion.value && appVersion.value.appCode) {
      loadTabs(appVersion.value);
    } else {
      getPackData(props.modelValue, (data: Record<string, any>) => {
        appVersion.value = data;
        loadTabs(data);
      });
    }
  } else {
    Message.warning('版本数据缺失！');
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
    tabsVisible.value = false;
    openTabsLoading.value = false;
    listParams.value.height = props.height + 75;
    appSelectOptions.value = [];
    tableData.value = {} as unknown as QueryAppVersionForm;
    appVersion.value = {};
    appMetaList.value = [];
    renderData.value = generateRenderData();
    // 编辑、查看 状态 查询数据
    if (props.modelValue) {
      tableFormat(props.modelValue);
    }
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-card class="general-card" title="基本信息">
    <template #extra>
      <a-space>
        <a-button :loading="openTabsLoading" type="primary" @click="openTabs">
          <template #icon>
            <icon-unordered-list/>
          </template>
          包详细信息
        </a-button>
      </a-space>
    </template>
    <a-form :label-col-props="{ span: '2px' }" :model="tableData" class="form" style="padding-left: 16px;">
      <a-form-item field="appId" label="应用主键：">
        <CopyToClipboard v-if="tableData.appId" :model-value="tableData.appId"/>
        <span>{{ tableData.appId }}{{ getAppOptionLabel(tableData.appId) }}</span>
      </a-form-item>
      <a-form-item field="version" label="版本名称：">
        <CopyToClipboard v-if="tableData.version" :model-value="tableData.version"/>
        <span>{{ tableData.version }}</span>
      </a-form-item>
      <a-form-item field="packageSource" label="版本来源：">
        <span>{{ getOptionLabel(tableData.packageSource, packageSourceOptions) }}</span>
      </a-form-item>
      <a-form-item field="status" label="版本状态：">
        <span>{{ getOptionLabel(tableData.status, packageStatusOptions) }}</span>
      </a-form-item>
      <a-form-item field="packetTime" label="打包时间：">
        <span>{{ tableData.packetTime }}</span>
      </a-form-item>
      <a-form-item field="creatorName" label="打包人员：">
        <span>{{ tableData.creatorName }}</span>
      </a-form-item>
      <a-form-item v-if="!['draft'].includes(tableData.status)" field="packagePath" label="应用包：">
        <UploadFile v-model="tableData.packagePath" :disabled="true"/>
      </a-form-item>
      <a-form-item field="description" label="版本描述：">
        <span :title="tableData.description">{{ tableData.description }}</span>
      </a-form-item>
    </a-form>
  </a-card>

  <a-modal v-model:visible="tabsVisible" :footer="false" :title="`包详细信息 ${tableData.version}`" fullscreen title-align="start">
    <a-spin :loading="openTabsLoading" dot style="width: 100%" tip="正在获取版本包详细信息...">
      <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
        <a-tab-pane :key="1" class="a-tabs-five" title="模型管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformModelList :dev-column="renderData.devColumn.data"
                               :dev-db-connect="renderData.devDbConnect.data"
                               :dev-table="renderData.devTable.data"
                               :dev-table-foreign="renderData.devTableForeign.data"
                               :dev-view="renderData.devView.data"
                               :height="listParams.height"
                               :parameter="listParams.parameter"
                               :permission="renderData.permission.data"
                               :role="renderData.role.data"
                               :role-permission="renderData.rolePermission.data"
                               :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="2" class="a-tabs-five" title="数据字典">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformDictList :dict="renderData.dict.data"
                              :dictItem="renderData.dictItem.data"
                              :height="listParams.height"
                              :parameter="listParams.parameter"
                              :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="3" class="a-tabs-five" title="角色管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformRoleList :height="listParams.height"
                              :parameter="listParams.parameter"
                              :permission="renderData.permission.data"
                              :role="renderData.role.data"
                              :role-app="renderData.roleApp.data"
                              :role-permission="renderData.rolePermission.data"
                              :role-tree-node="renderData.roleTreeNode.data"
                              :tree-node="renderData.treeNode.data"
                              :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="4" class="a-tabs-five" title="菜单管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformPageList :appPage="renderData.appPage.data"
                              :height="listParams.height"
                              :parameter="listParams.parameter"
                              :treeNode="renderData.treeNode.data"
                              :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="5" class="a-tabs-five" title="系统配置">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformSysConfigList :data="renderData.sysConfig.data"
                                   :height="listParams.height"
                                   :parameter="listParams.parameter"
                                   :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="6" class="a-tabs-five" title="文件管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformExportTemplateList :data="renderData.exportTemplate.data"
                                        :height="listParams.height"
                                        :parameter="listParams.parameter"
                                        :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="7" class="a-tabs-five" title="编码管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformEncodingList :data="renderData.encoding.data"
                                  :height="listParams.height"
                                  :parameter="listParams.parameter"
                                  :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="8" class="a-tabs-five" title="资源管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformResourcesList :data="renderData.resources.data"
                                   :height="listParams.height"
                                   :parameter="listParams.parameter"
                                   :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="9" class="a-tabs-five" title="接口管理">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformApiList :api="renderData.api.data"
                             :api-param="renderData.apiParam.data"
                             :height="listParams.height"
                             :parameter="listParams.parameter"
                             :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
        <a-tab-pane :key="10" class="a-tabs-five" title="业务数据">
          <a-card v-if="listParams.visible" class="general-card6">
            <PlatformPacketList :model-value="appMetaList"
                                :height="listParams.height"
                                :parameter="listParams.parameter"
                                :visible="listParams.visible"/>
          </a-card>
          <a-empty v-else/>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<style lang="less">
.general-card6 .arco-card-body {
  padding: 0px 1px 16px 0px !important;
}
</style>