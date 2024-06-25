<script lang="ts">
export default {
  name: 'AppVersionCompareTabs'
};
</script>

<script lang="ts" setup>
import {shallowRef, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import cloneDeep from "lodash/cloneDeep";
import {getAppSelectOptions, getAppVersion, QueryAppForm, queryAppPackage, QueryAppVersionForm} from "@/api/application";
import {AppMeta, AppVersion, PageParams} from "@/views/compare/type";
import CompareModel from "@/views/compare/model.vue";
import PlatformModelCompare from "@/views/compare/package/platform-model.vue";
import PlatformDictCompare from "@/views/compare/package/platform-dict.vue";
import PlatformPageCompare from "@/views/compare/package/platform-page.vue";
import PlatformSysConfigCompare from "@/views/compare/package/platform-sys-config.vue";
import PlatformExportTemplateCompare from "@/views/compare/package/platform-export-template.vue";
import PlatformEncodingCompare from "@/views/compare/package/platform-encoding.vue";
import PlatformResourcesCompare from "@/views/compare/package/platform-resources.vue";
import PlatformApiCompare from "@/views/compare/package/platform-api.vue";

const emits = defineEmits(['update:modelValue', 'canPacket']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  compareId: {type: String, default: ''},// 对比id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  height: {type: Number, default: 0},// 表单宽度
});

const modelRef = shallowRef(PlatformModelCompare);
const dictRef = shallowRef(PlatformDictCompare);
const pageRef = shallowRef(PlatformPageCompare);
const configRef = shallowRef(PlatformSysConfigCompare);
const templateRef = shallowRef(PlatformExportTemplateCompare);
const encodingRef = shallowRef(PlatformEncodingCompare);
const resourcesRef = shallowRef(PlatformResourcesCompare);
const apiRef = shallowRef(PlatformApiCompare);

const {t} = useI18n();// 国际化
const tabsKey = ref<number>(1);// 定位tabs页面
const appSelectOptions = ref<QueryAppForm[]>([]);
const tableData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appVersionData = ref<AppVersion>({} as AppVersion);
const tableCompareData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appVersionCompareData = ref<AppVersion>({} as AppVersion);

const generateDiffResult = () => {
  return {
    api: 0,
    model: 0, dict: 0,
    //  role: 0, permission: 0,
    page: 0, config: 0,
    template: 0, encoding: 0, resources: 0,
  }
}
const diffResult = ref(generateDiffResult());

const generateListParams = () => {
  return {
    visible: false,
    parameter: {appId: '', tenantCode: ''},
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
  try {
    const {data} = await queryAppPackage(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 获取模型数据，并处理
 * @param id
 */
const tableFormat = async (successBack?: any) => {
  // 应用信息
  await getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });

  await getData(props.modelValue, (data: QueryAppVersionForm) => {
    tableData.value = data;
  });
  await getData(props.compareId, (data: QueryAppVersionForm) => {
    tableCompareData.value = data;
  });
  await getPackData(props.modelValue, (data: Record<string, any>) => {
    appVersionData.value = (data || {}) as AppVersion;
  });
  await getPackData(props.compareId, (data: Record<string, any>) => {
    appVersionCompareData.value = (data || {}) as AppVersion;
  });

  Object.assign(listParams.value, {visible: true});
}

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
    diffResult.value = generateDiffResult();
    listParams.value.height = props.height;
    Object.assign(listParams.value.parameter, props.parameter);
    // 编辑、查看 状态 查询数据
    if (props.modelValue && props.compareId) {
      tableFormat();
    }
  }
}, {deep: true, immediate: true});

watch(() => diffResult, (val) => {
  const total: number[] = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in diffResult.value) {
    // @ts-ignore
    total.push(diffResult.value[key]);
  }
  emits("canPacket", !(total.includes(0)));
}, {deep: true, immediate: true});

const deploy = (successBack: any) => {
  const data = {};
  // @ts-ignore
  if (modelRef.value && typeof modelRef.value?.deploy === 'function') {
    // @ts-ignore
    modelRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (dictRef.value && typeof dictRef.value?.deploy === 'function') {
    // @ts-ignore
    dictRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (pageRef.value && typeof pageRef.value?.deploy === 'function') {
    // @ts-ignore
    pageRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (configRef.value && typeof configRef.value?.deploy === 'function') {
    // @ts-ignore
    configRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (templateRef.value && typeof templateRef.value?.deploy === 'function') {
    // @ts-ignore
    templateRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (encodingRef.value && typeof encodingRef.value?.deploy === 'function') {
    // @ts-ignore
    encodingRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (resourcesRef.value && typeof resourcesRef.value?.deploy === 'function') {
    // @ts-ignore
    resourcesRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }
  // @ts-ignore
  if (apiRef.value && typeof apiRef.value?.deploy === 'function') {
    // @ts-ignore
    apiRef.value?.deploy((result: Record<string, any>) => {
      Object.assign(data, result);
    });
  }

  const result = {};
  // @ts-ignore
  const sourceList = (cloneDeep(appVersionData.value?.appMetaList) || []) as AppMeta[];
  const {version} = tableData.value;
  // @ts-ignore
  result[version] = {};
  if (sourceList && sourceList.length > 0) {
    for (let i = 0; i < sourceList.length; i += 1) {
      const key = sourceList[i].metaName;
      // @ts-ignore
      result[version][key] = [];
      const form = sourceList[i].metaData;
      // @ts-ignore
      const keys = (data[key] || []).map(item => item.key);
      // @ts-ignore
      result[version][key] = form.map(item => item.id).filter(val => !keys.includes(val));
    }
  }
  const versionC = tableCompareData.value.version;
  // @ts-ignore
  result[versionC] = {};
  // eslint-disable-next-line no-restricted-syntax,guard-for-in
  for (const key in data) {
    // @ts-ignore
    result[versionC][key] = [];
    // @ts-ignore
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data[key]) {
      if ([2, 3].includes(item.type)) {
        // @ts-ignore
        result[versionC][key].push(item.key);
      }
    }
  }
  if (successBack && typeof successBack === 'function') successBack(result);
}

defineExpose({deploy});
</script>

<template>
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="false" position="top" type="line">
    <a-tab-pane :key="1" class="a-tabs-five" title="版本信息">
      <div style="width:100%;display: inline-flex;justify-content: center;">
        <CompareModel :app-value="appSelectOptions" :model-value="tableData" :visible="true"/>
        <a-divider direction="vertical"/>
        <CompareModel :app-value="appSelectOptions" :model-value="tableCompareData" :visible="true"/>
      </div>
    </a-tab-pane>
    <a-tab-pane :key="2" class="a-tabs-five" title="模型管理">
      <template #title>
        模型管理
        <a-tooltip v-if="diffResult.model===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformModelCompare ref="modelRef" :compare-value="appVersionCompareData"
                              :height="listParams.height"
                              :model-value="appVersionData"
                              :parameter="listParams.parameter"
                              :visible="listParams.visible"
                              @difference="(diff)=>{diffResult.model = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="3" class="a-tabs-five" title="数据字典">
      <template #title>
        数据字典
        <a-tooltip v-if="diffResult.dict===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformDictCompare ref="dictRef" :compare-value="appVersionCompareData"
                             :height="listParams.height"
                             :model-value="appVersionData"
                             :parameter="listParams.parameter"
                             :visible="listParams.visible"
                             @difference="(diff)=>{diffResult.dict = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="5" class="a-tabs-five" title="菜单管理">
      <template #title>
        菜单管理
        <a-tooltip v-if="diffResult.page===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformPageCompare ref="pageRef" :compare-value="appVersionCompareData"
                             :height="listParams.height"
                             :model-value="appVersionData"
                             :parameter="listParams.parameter"
                             :visible="listParams.visible"
                             @difference="(diff)=>{diffResult.page = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="6" class="a-tabs-five" title="系统配置">
      <template #title>
        系统配置
        <a-tooltip v-if="diffResult.config===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformSysConfigCompare ref="configRef" :compare-value="appVersionCompareData"
                                  :height="listParams.height"
                                  :model-value="appVersionData"
                                  :parameter="listParams.parameter"
                                  :visible="listParams.visible"
                                  @difference="(diff)=>{diffResult.config = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="7" class="a-tabs-five" title="文件管理">
      <template #title>
        文件管理
        <a-tooltip v-if="diffResult.template===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformExportTemplateCompare ref="templateRef" :compare-value="appVersionCompareData"
                                       :height="listParams.height"
                                       :model-value="appVersionData"
                                       :parameter="listParams.parameter"
                                       :visible="listParams.visible"
                                       @difference="(diff)=>{diffResult.template = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="8" class="a-tabs-five" title="编码管理">
      <template #title>
        编码管理
        <a-tooltip v-if="diffResult.encoding===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformEncodingCompare ref="encodingRef" :compare-value="appVersionCompareData"
                                 :height="listParams.height"
                                 :model-value="appVersionData"
                                 :parameter="listParams.parameter"
                                 :visible="listParams.visible"
                                 @difference="(diff)=>{diffResult.encoding = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="9" class="a-tabs-five" title="资源管理">
      <template #title>
        资源管理
        <a-tooltip v-if="diffResult.resources===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformResourcesCompare ref="resourcesRef" :compare-value="appVersionCompareData"
                                  :height="listParams.height"
                                  :model-value="appVersionData"
                                  :parameter="listParams.parameter"
                                  :visible="listParams.visible"
                                  @difference="(diff)=>{diffResult.resources = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="10" class="a-tabs-five" title="接口管理">
      <template #title>
        接口管理
        <a-tooltip v-if="diffResult.resources===1" content="存在差异" position="top">
          <IconExclamationCircle style="color: rgb(var(--warning-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformApiCompare ref="apiRef" :compare-value="appVersionCompareData"
                            :height="listParams.height"
                            :model-value="appVersionData"
                            :parameter="listParams.parameter"
                            :visible="listParams.visible"
                            @difference="(diff)=>{diffResult.api = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less">
.general-card6 .arco-card-body {
  padding: 0px 1px 16px 0px !important;
}
</style>