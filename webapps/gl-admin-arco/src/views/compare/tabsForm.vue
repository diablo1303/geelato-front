<script lang="ts">
export default {
  name: 'AppVersionCompareTabs'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {getAppSelectOptions, getAppVersion, QueryAppForm, queryAppPackage, QueryAppVersionForm} from "@/api/application";
import CompareModel from "@/views/compare/model.vue";
import {AppVersion, PageParams} from "@/views/compare/type";
import PlatformModelCompare from "@/views/compare/package/platform-model.vue";
import PlatformDictCompare from "@/views/compare/package/platform-dict.vue";
import PlatformPageCompare from "@/views/compare/package/platform-page.vue";
import PlatformSysConfigCompare from "@/views/compare/package/platform-sys-config.vue";
import PlatformExportTemplateCompare from "@/views/compare/package/platform-export-template.vue";
import PlatformEncodingCompare from "@/views/compare/package/platform-encoding.vue";
import PlatformResourcesCompare from "@/views/compare/package/platform-resources.vue";

const emits = defineEmits(['update:modelValue', 'toModel', 'toTable']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  compareId: {type: String, default: ''},// 对比id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  height: {type: Number, default: 0},// 表单宽度
});

const {t} = useI18n();// 国际化
const tabsKey = ref<number>(1);// 定位tabs页面
const appSelectOptions = ref<QueryAppForm[]>([]);
const tableData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appVersionData = ref<AppVersion>({} as AppVersion);
const tableCompareData = ref<QueryAppVersionForm>({} as QueryAppVersionForm);
const appVersionCompareData = ref<AppVersion>({} as AppVersion);

const generateDiffResult = () => {
  return {
    model: 0, dict: 0, role: 0,
    permission: 0, page: 0, config: 0,
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
    console.log(`appVersionData : ${props.modelValue}`, data);
    appVersionData.value = (data || {}) as AppVersion;
  });
  await getPackData(props.compareId, (data: Record<string, any>) => {
    console.log(`appVersionCompareData : ${props.compareId}`, data);
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
        <a-tooltip v-if="diffResult.model===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.model===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.model===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformModelCompare :compare-value="appVersionCompareData"
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
        <a-tooltip v-if="diffResult.dict===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.dict===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.dict===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformDictCompare :compare-value="appVersionCompareData"
                             :height="listParams.height"
                             :model-value="appVersionData"
                             :parameter="listParams.parameter"
                             :visible="listParams.visible"
                             @difference="(diff)=>{diffResult.dict = diff}"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="4" class="a-tabs-five" title="角色管理">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="5" class="a-tabs-five" title="菜单管理">
      <template #title>
        菜单管理
        <a-tooltip v-if="diffResult.page===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.page===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.page===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformPageCompare :compare-value="appVersionCompareData"
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
        <a-tooltip v-if="diffResult.config===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.config===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.config===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformSysConfigCompare :compare-value="appVersionCompareData"
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
        <a-tooltip v-if="diffResult.template===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.template===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.template===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformExportTemplateCompare :compare-value="appVersionCompareData"
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
        <a-tooltip v-if="diffResult.encoding===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.encoding===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.encoding===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformEncodingCompare :compare-value="appVersionCompareData"
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
        <a-tooltip v-if="diffResult.resources===0" content="比较中..." position="top">
          <IconLoading style="color: rgb(var(--primary-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.resources===1" content="存在差异" position="top">
          <IconStar style="color: rgb(var(--danger-6))"/>
        </a-tooltip>
        <a-tooltip v-if="diffResult.resources===2" content="完全相同" position="top">
          <IconStarFill style="color: rgb(var(--success-6))"/>
        </a-tooltip>
      </template>
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformResourcesCompare :compare-value="appVersionCompareData"
                                  :height="listParams.height"
                                  :model-value="appVersionData"
                                  :parameter="listParams.parameter"
                                  :visible="listParams.visible"
                                  @difference="(diff)=>{diffResult.resources = diff}"/>
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