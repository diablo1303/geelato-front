<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.code')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
            field="code">
          <a-input v-if="pageData.button" v-model="formData.code" :max-length="32"/>
          <span v-else>{{ formData.code }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="pageData.button&&pageData.params.type===''" v-model="formData.type" @change="typeChange">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.role.index.form.type.${formData.type}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.roleApp.index.form.appName')"
            :rules="[{required: ['app'].includes(formData.type),message: $t('security.form.rules.match.required')}]"
            field="appId">
          <a-select
              v-if="pageData.button&&['app'].includes(formData.type)&&pageData.params.appId===''" v-model="formData.appId"
              :field-names="{value: 'id', label: 'name'}"
              :options="selectOptions" allow-search/>
          <span v-else>{{ formData.appName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.weight')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="weight">
          <a-input-number
              v-if="pageData.button" v-model="formData.weight" :max="999" :min="0" :step="1"
              :placeholder="$t('security.form.rules.match.length.title')+'[0,999]'"
              :precision="0"/>
          <span v-else>{{ formData.weight }}</span>
          <a-button v-if="formData.weight!==5&&pageData.button" size="medium" type="outline" @click="ev => {formData.weight=5;}">
            <template #icon>
              <icon-undo/>
            </template>
          </a-button>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.role.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.role.index.form.seqNo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number
              v-if="pageData.button" v-model="formData.seqNo" :max="999999999" :min="1"
              :placeholder="$t('security.form.rules.match.length.title')+'[0,999999999]'"
              :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('security.role.index.form.description')"
            :label-col-props="{ span: 6/pageData.formCol }"
            :wrapper-col-props="{ span: pageData.formCol===2?21:18 }" field="description">
          <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {
  createOrUpdateRole as createOrUpdateForm,
  getRole as getForm,
  QueryAppForm,
  QueryAppForm as QuerySelectForm,
  queryApps as querySelectOptions,
  QueryRoleForm as QueryForm,
  validateRoleCode
} from '@/api/security';
import {ListUrlParams} from '@/api/base';
import {enableStatusOptions, typeOptions} from "@/views/security/role/searchTable";
import {useRoute} from "vue-router";

// 国际化
const {t} = useI18n();
const route = useRoute();
const pageData = ref({
  formState: 'add',
  button: true,
  formCol: 2,
  params: {type: 'app', appId: ''}
});
const validateForm = ref<FormInstance>();
const generateFormData = (): QueryForm => {
  return {
    id: '',
    name: '',
    code: '',
    type: '',
    weight: 5,
    enableStatus: 1,
    seqNo: 999,
    description: '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    appId: (route.params && route.params.appId as string) || '',
    appName: ''
  };
}
const formData = ref(generateFormData());
const selectOptions = ref<QuerySelectForm[]>([]);

const getSelectOptions = async () => {
  try {
    const {data} = await querySelectOptions({
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as unknown as QueryAppForm);
    selectOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      params.appId = ["app"].includes(params.type) ? params.appId : '';
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
    const {data} = await validateRoleCode(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
const typeChange = () => {
  formData.value.appId = '';
  formData.value.appName = '';
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  // 组织加载
  getSelectOptions();
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 2;
  pageData.value.params.appId = urlParams.params?.appId || '';
  pageData.value.params.type = urlParams.params?.type || '';
  formData.value = {...generateFormData(), ...pageData.value.params};
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