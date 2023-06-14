<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-form-item v-show="false">
      <a-input v-show="false" v-model="formData.id"/>
      <a-input v-show="false" v-model="formData.appId"/>
    </a-form-item>
    <a-form-item
        :label="$t('security.dict.index.form.dicName')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="dicName">
      <a-input v-if="pageData.button" v-model="formData.dicName" :max-length="32"/>
      <span v-else>{{ formData.dicName }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dict.index.form.dicCode')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="dicCode">
      <a-input v-if="pageData.button" v-model="formData.dicCode" :max-length="32"/>
      <span v-else>{{ formData.dicCode }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dict.index.form.tenantCode')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="tenantCode">
      <a-input v-if="pageData.button" v-model="formData.tenantCode" :max-length="32"/>
      <span v-else>{{ formData.tenantCode }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dict.index.form.enableStatus')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="enableStatus">
      <a-select v-if="pageData.button" v-model="formData.enableStatus">
        <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
      </a-select>
      <span v-else>{{ $t(`security.dict.index.form.enableStatus.${formData.enableStatus}`) }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dict.index.form.seqNo')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="seqNo">
      <a-input-number
          v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1"
          :placeholder="$t('security.form.rules.match.length.title')+'[0,999999]'"
          :precision="0"/>
      <span v-else>{{ formData.seqNo }}</span>
    </a-form-item>
    <a-form-item :label="$t('security.dict.index.form.dicRemark')" field="dicRemark">
      <a-textarea v-if="pageData.button" v-model="formData.dicRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
      <span v-else :title="formData.dicRemark" class="textarea-span" @click="openModal(`${formData.dicRemark}`)">{{ formData.dicRemark }}</span>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams} from '@/api/service/base_service';
import {createOrUpdateDict as createOrUpdateForm, getDict as getForm, QueryDictForm as QueryForm} from '@/api/service/security_service'
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";

const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {id: '', tenantCode: '', appId: '', dicName: '', dicCode: '', dicRemark: '', enableStatus: 1, seqNo: 999};
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
      data.seqNo = Number(data.seqNo);
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