<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('model.table.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('model.table.index.model.ok.text')"
      :title="$t(`model.table.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item
          :label="$t('model.table.index.form.title')"
          :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
          field="title">
        <a-input v-model.trim="formData.title" :max-length="32"/>
      </a-form-item>
      <a-form-item
          :label="$t('model.table.index.form.entityName')"
          :rules="[{required: pageData.formState==='add',message: $t('model.form.rules.match.required')},
            {match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:$t('model.form.rules.match.entityName.match')},
            {validator:validateCode}]"
          field="entityName">
        <a-input v-model.trim="formData.entityName" :max-length="32"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {FormInstance, Modal} from "@arco-design/web-vue";
import {QueryOrgForm as QueryForm} from '@/api/security'
import {ListUrlParams, SelectOption} from '@/api/base';
import {copyTable, QueryTableForm, validateTableEntityName} from "@/api/model";

const route = useRoute();
const pageData = ref({formState: 'add', button: true, orgName: ''});
const validateForm = ref<FormInstance>();
const orgSelectOptions = ref<SelectOption[]>([]);
const orgOptions = ref<QueryForm[]>([]);
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = () => {
  return {
    id: '',
    title: '',
    entityName: '',
  };
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;
// 国际化
const {t} = useI18n();

/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: Record<string, any>, done: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await copyTable(params);
      done();
      okSuccessBack(data);
    } catch (err) {
      done(false);
    }
  } else {
    done(false);
  }
};

/* 表单 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, done);
};
const handleModelCancel = (e: Event) => {
  visibleModel.value = false;
}
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
    const {data} = await validateTableEntityName({...formData.value} as unknown as QueryTableForm);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 打开表单 */
const openForm = (urlParams: ListUrlParams) => {
  // 全局
  formData.value = generateFormData();
  formData.value.id = urlParams.id || '';
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.action === "add") {
    visibleModel.value = true;
  }
  okSuccessBack = urlParams.closeBack || null;
}

// 将方法暴露出去
defineExpose({openForm});
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