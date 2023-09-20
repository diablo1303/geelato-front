<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-row :gutter="16">
      <a-form-item
          :label="$t('security.sysConfig.index.form.configKey')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
          field="configKey">
        <a-textarea v-if="pageData.button" v-model.trim="formData.configKey" :auto-size="{minRows:1}" :max-length="100" show-word-limit/>
        <span v-else>{{ formData.configKey }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.sysConfig.index.form.configValue')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="configValue">
        <a-textarea v-if="pageData.button" v-model.trim="formData.configValue" :auto-size="{minRows:1}" :max-length="2000" show-word-limit/>
        <span v-else>{{ formData.configValue }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.sysConfig.index.form.enableStatus')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="enableStatus">
        <a-select v-if="pageData.button" v-model="formData.enableStatus">
          <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.sysConfig.index.form.enableStatus.${formData.enableStatus}`) }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.sysConfig.index.form.remark')" field="remark">
        <a-textarea v-if="pageData.button" v-model="formData.remark" :auto-size="{minRows:3,maxRows:6}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.remark" class="textarea-span" @click="openModal(`${formData.remark}`)">{{ formData.remark }}</span>
      </a-form-item>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateSysConfig as createOrUpdateForm, getSysConfig as getForm, QuerySysConfigForm as QueryForm, validateSysConfigKey} from '@/api/sysconfig'
import {enableStatusOptions} from "@/views/security/sysconfig/searchTable";

const route = useRoute();
const {t} = useI18n();
const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    configKey: '',
    configValue: '',
    remark: '',
    enableStatus: 1,
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
}
const formData = ref(generateFormData());

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await createOrUpdateForm(params);
      successBack(data);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    failBack(err);
  }
};

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateCode = async (value: any, callback: any) => {
  try {
    const {data} = await validateSysConfigKey(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 1;
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      formData.value = data;
      urlParams.loadSuccessBack(data);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel});
</script>
<script lang="ts">
export default {
  name: 'SystemConfigModel'
};
</script>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>