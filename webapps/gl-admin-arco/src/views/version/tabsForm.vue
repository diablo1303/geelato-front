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
import PlatformDictList from "@/views/version/package/platform-dict.vue";
import PlatformModelList from "@/views/version/package/platform-model.vue";
import PlatformRoleList from "@/views/version/package/platform-role.vue";
import PlatformSysConfigList from "@/views/version/package/platform-sys-config.vue";
import PlatformExportTemplateList from "@/views/version/package/platform-export-template.vue";
import PlatformEncodingList from "@/views/version/package/platform-encoding.vue";
import PlatformResourcesList from "@/views/version/package/platform-resources.vue";

type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}
type AppMeta = {
  metaName: string;
  metaData: Record<string, any>[]
}

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
const appMetaList = ref<AppMeta[]>([]);

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
  getPackData(id, (data: Record<string, any>) => {
    appMetaList.value = data?.appMetaList || [];
    console.log(appMetaList.value);
    Object.assign(listParams.value, {visible: true});
  });
}

watch(() => props, (val) => {
  if (props.visible === true) {
    tabsKey.value = 1;
    listParams.value.height = props.height;
    // 编辑、查看 状态 查询数据
    if (props.modelValue) {
      tableFormat(props.modelValue);
    }
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-tabs v-model:active-key="tabsKey" :default-active-tab="1" :lazy-load="true" position="top" type="line">
    <a-tab-pane :key="1" title="版本信息" class="a-tabs-five">
      <a-form :model="tableData" :label-col-props="{ span: '2px' }" style="padding-left: 16px;" class="form">
        <a-form-item label="应用主键：" field="appId">
          <CopyToClipboard v-if="tableData.appId" :model-value="tableData.appId"/>
          <span>{{ tableData.appId }}{{ getAppOptionLabel(tableData.appId) }}</span>
        </a-form-item>
        <a-form-item label="版本名称：" field="version">
          <span>{{ tableData.version }}</span>
        </a-form-item>
        <a-form-item label="版本来源：" field="packageSource">
          <span>{{ tableData.packageSource }}</span>
        </a-form-item>
        <a-form-item label="打包时间：" field="packetTime">
          <span>{{ tableData.packetTime }}</span>
        </a-form-item>
        <a-form-item label="打包人员：" field="creatorName">
          <span>{{ tableData.creatorName }}</span>
        </a-form-item>
        <a-form-item label="应用包：" field="packagePath">
          <UploadFile :disabled="true" v-model="tableData.packagePath"/>
        </a-form-item>
        <a-form-item label="版本描述：" field="description">
          <span :title="tableData.description">{{ tableData.description }}</span>
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane :key="2" title="模型管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformModelList :model-value="appMetaList"
                           :visible="listParams.visible"
                           :height="listParams.height"
                           :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="3" title="数据字典" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformDictList :model-value="appMetaList"
                          :visible="listParams.visible"
                          :height="listParams.height"
                          :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="4" title="角色管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformRoleList :model-value="appMetaList"
                          :visible="listParams.visible"
                          :height="listParams.height"
                          :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="5" title="菜单管理" class="a-tabs-five">
      <a-empty/>
    </a-tab-pane>
    <a-tab-pane :key="6" title="系统配置" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformSysConfigList :model-value="appMetaList"
                               :visible="listParams.visible"
                               :height="listParams.height"
                               :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="7" title="文件管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformExportTemplateList :model-value="appMetaList"
                                    :visible="listParams.visible"
                                    :height="listParams.height"
                                    :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="8" title="编码管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformEncodingList :model-value="appMetaList"
                              :visible="listParams.visible"
                              :height="listParams.height"
                              :parameter="listParams.parameter"/>
      </a-card>
      <a-empty v-else/>
    </a-tab-pane>
    <a-tab-pane :key="9" title="资源管理" class="a-tabs-five">
      <a-card v-if="listParams.visible" class="general-card6">
        <PlatformResourcesList :model-value="appMetaList"
                               :visible="listParams.visible"
                               :height="listParams.height"
                               :parameter="listParams.parameter"/>
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