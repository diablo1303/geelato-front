<template>
  <a-divider orientation="left">
    <a-space>
      <strong> 基本信息 </strong>
      <a-tooltip v-if="!baseEdit" content="编辑" position="top">
        <icon-edit class="tree-extra-icon" @click="changeBaseBoolean($event)"/>
      </a-tooltip>
      <a-tooltip v-if="baseEdit" content="保存" position="top">
        <icon-save class="tree-extra-icon" @click="saveBaseData($event)"/>
      </a-tooltip>
    </a-space>
  </a-divider>
  <a-form ref="validateBaseForm" :model="baseData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item label="企业名称" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="companyName">
          <a-input v-if="baseEdit" v-model="baseData.companyName" :max-length="1024"/>
          <a-space v-else>
            {{ baseData.companyName }}
            <CopyToClipboard v-model="baseData.companyName"/>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="企业域名" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="companyArea">
          <a-input v-if="baseEdit" v-model="baseData.companyArea" :max-length="1024"/>
          <a-space v-else>
            {{ baseData.companyArea }}
            <CopyToClipboard v-model="baseData.companyArea"/>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Corp ID" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="corpId">
          <a-input v-if="baseEdit" v-model="baseData.corpId" :max-length="1024"/>
          <a-space v-else>
            {{ baseData.corpId }}
            <CopyToClipboard v-model="baseData.corpId"/>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="Corp Token" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="corpToken">
          <a-input v-if="baseEdit" v-model="baseData.corpToken" :max-length="1024"/>
          <a-space v-else>
            {{ baseData.corpToken }}
            <CopyToClipboard v-model="baseData.corpToken"/>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <a-divider orientation="left">
    <a-space>
      <strong> 登录页面样式 </strong>
      <a-tooltip v-if="!indexEdit" content="编辑" position="top">
        <icon-edit class="tree-extra-icon" @click="changeIndexBoolean($event)"/>
      </a-tooltip>
      <a-tooltip v-if="indexEdit" content="保存" position="top">
        <icon-save class="tree-extra-icon" @click="saveIndexData($event)"/>
      </a-tooltip>
    </a-space>
  </a-divider>
  <a-form ref="validateIndexForm" :model="indexData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item label="logo" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="logo">
          <UploadImageBase64 v-model="indexData.logo" :disabled="!indexEdit" image-name="logo"/>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="租户名称" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="tenantName">
          <a-input v-if="indexEdit" v-model="indexData.tenantName" :max-length="1024"/>
          <span v-else>{{ indexData.tenantName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="登录主标题" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="loginTitle">
          <a-input v-if="indexEdit" v-model="indexData.loginTitle" :max-length="1024"/>
          <span v-else>{{ indexData.loginTitle }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="登录副标题" :rules="[{required: true,message: $t('security.form.rules.match.required')}]" field="loginSubTitle">
          <a-input v-if="indexEdit" v-model="indexData.loginSubTitle" :max-length="1024"/>
          <span v-else>{{ indexData.loginSubTitle }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script lang="ts">
export default {
  name: 'TenantSettings'
}
</script>
<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance} from "@arco-design/web-vue";
import {useRoute} from "vue-router";
import {formDataFromFile, formDataToFile, TenantBaseForm, TenantIndexForm} from "@/api/tenant";
import {useUserStore} from "@/store";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import UploadImageBase64 from "@/components/upload-base64/image.vue";
import {isJSON} from "@/utils/is";

// 国际化
const {t} = useI18n();
const route = useRoute();
const userStore = useUserStore();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || userStore.tenantCode as string
});
/* 基础表单 */
const generateBaseData = (): TenantBaseForm => {
  return {
    tenantCode: routeParams.value.tenantCode,
    companyName: '1111111111111',
    corpId: '111111111',
    corpToken: '11111111111',
    companyArea: '11111111111',
  };
}
const validateBaseForm = ref<FormInstance>();
const baseData = ref(generateBaseData());
const baseEdit = ref(true);

const changeBaseBoolean = (ev?: MouseEvent) => {
  baseEdit.value = !baseEdit.value;
}

const saveBaseData = (ev?: MouseEvent) => {
  baseEdit.value = !baseEdit.value;
}

const setBaseEdit = () => {
  let isFull = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item in baseData.value) {
    if (!item) {
      isFull = false;
      break;
    }
  }
  baseEdit.value = !isFull;
}

/* 登录页面样式 */
const generateIndexData = (): TenantIndexForm => {
  return {
    tenantCode: routeParams.value.tenantCode,
    logo: '',
    tenantName: '',
    loginTitle: '',
    loginSubTitle: '',
  };
}
const validateIndexForm = ref<FormInstance>();
const indexData = ref(generateIndexData());
const indexEdit = ref(true);

const indexFormDataToFile = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  const res = await validateIndexForm.value?.validate();
  if (!res) {
    try {
      const {data} = await formDataToFile(params, `${routeParams.value.tenantCode}.config`);
      changeIndexBoolean();
      // eslint-disable-next-line no-unused-expressions
      successBack && successBack(data);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      failBack && failBack(err);
    }
  } else {
    // eslint-disable-next-line no-unused-expressions
    failBack && failBack();
  }
}

const indexFormDataFromFile = async (tenantCode: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await formDataFromFile(`${tenantCode}.config`);
    if (data && isJSON(data)) {
      indexData.value = JSON.parse(data) || generateIndexData();
    } else {
      indexData.value = generateIndexData();
    }
    // eslint-disable-next-line no-unused-expressions
    successBack && successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-unused-expressions
    failBack && failBack(err);
  }
}
const changeIndexBoolean = (ev?: MouseEvent) => {
  indexEdit.value = !indexEdit.value;
}

const saveIndexData = (ev?: MouseEvent) => {
  indexFormDataToFile(indexData.value);
}

const setIndexEdit = () => {
  let isFull = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item in indexData.value) {
    if (!item) {
      isFull = false;
      break;
    }
  }
  indexEdit.value = !isFull;
}

const resetValidate = async () => {
  await validateBaseForm.value?.resetFields();
  await validateIndexForm.value?.resetFields();
};

/* 对外调用方法 */
const loadModel = () => {
  baseData.value = generateBaseData();
  indexData.value = generateIndexData();
  // 重置验证
  resetValidate();
  // 获取数据
  indexFormDataFromFile(routeParams.value.tenantCode);
  setIndexEdit();
  setBaseEdit();
}
loadModel();
</script>

<style lang="less" scoped>
.tree-extra-icon {
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  color: #3370ff;
}
</style>