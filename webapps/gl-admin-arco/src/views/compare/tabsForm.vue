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
import PlatformSysConfigCompare from "@/views/compare/package/platform-sys-config.vue";
import PlatformDictCompare from "@/views/compare/package/platform-dict.vue";
import {AppVersion, PageParams} from "@/views/compare/type";


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
    appVersionData.value = (data || []) as AppVersion;
  });
  await getPackData(props.compareId, (data: Record<string, any>) => {
    console.log(`appVersionCompareData : ${props.compareId}`, data);
    appVersionCompareData.value = (data || []) as AppVersion;
  });

  Object.assign(listParams.value, {visible: true});
}

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
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
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
    <a-tab-pane :key="1" title="版本信息" class="a-tabs-five">
      <div style="width:100%;display: inline-flex;justify-content: center;">
        <CompareModel :visible="true" :model-value="tableData" :app-value="appSelectOptions"/>
        <a-divider direction="vertical"/>
        <CompareModel :visible="true" :model-value="tableCompareData" :app-value="appSelectOptions"/>
      </div>
    </a-tab-pane>
    <a-tab-pane :key="2" title="模型管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="3" title="数据字典" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformDictCompare :model-value="appVersionData"
                             :compare-value="appVersionCompareData"
                             :visible="listParams.visible"
                             :height="listParams.height"
                             :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="4" title="角色管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="5" title="菜单管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="6" title="系统配置" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformSysConfigCompare :model-value="appVersionData"
                                  :compare-value="appVersionCompareData"
                                  :visible="listParams.visible"
                                  :height="listParams.height"
                                  :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="7" title="文件管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="8" title="编码管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="9" title="资源管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">

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