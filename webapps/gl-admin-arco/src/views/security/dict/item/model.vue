<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }" class="form">
    <a-form-item v-show="false">
      <a-input v-show="false" v-model="formData.id"/>
      <a-input v-show="false" v-model="formData.dictId"/>
    </a-form-item>
    <a-form-item
        :label="$t('security.dictItem.index.form.itemName')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="itemName">
      <a-input v-if="pageData.button" v-model.trim="formData.itemName" :max-length="32"/>
      <span v-else>{{ formData.itemName }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dictItem.index.form.itemCode')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="itemCode">
      <a-input v-if="pageData.button" v-model.trim="formData.itemCode" :max-length="32"/>
      <span v-else>{{ formData.itemCode }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dictItem.index.form.enableStatus')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="enableStatus">
      <a-select v-if="pageData.button" v-model="formData.enableStatus">
        <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
      </a-select>
      <span v-else>{{ $t(`security.dictItem.index.form.enableStatus.${formData.enableStatus}`) }}</span>
    </a-form-item>
    <a-form-item
        :label="$t('security.dictItem.index.form.seqNo')"
        :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
        field="seqNo">
      <a-input-number
          v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1"
          :placeholder="$t('security.form.rules.match.length.title')+'[0,999999]'"
          :precision="0"/>
      <span v-else>{{ formData.seqNo }}</span>
    </a-form-item>
    <a-form-item :label="$t('security.dictItem.index.form.itemRemark')" field="itemRemark">
      <a-textarea v-if="pageData.button" v-model="formData.itemRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
      <span v-else :title="formData.itemRemark" class="textarea-span" @click="openModal(`${formData.itemRemark}`)">{{ formData.itemRemark }}</span>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {FormInstance} from "@arco-design/web-vue/es/form";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateDictItem as createOrUpdateForm, getDictItem as getForm, QueryDictItemForm as QueryForm} from '@/api/security'
import {enableStatusOptions} from "@/views/security/dict/item/searchTable";

const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {id: '', dictId: '', itemName: '', itemCode: '', enableStatus: 1, seqNo: 999, itemRemark: ''};
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
  formData.value.dictId = urlParams.params?.pId || '';
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