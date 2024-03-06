<template v-model="pageData">
  <a-modal
      v-model:visible="visibleModel"
      :cancel-text="$t('security.permission.index.model.cancel.text')"
      :footer="pageData.button"
      :ok-text="$t('security.permission.index.model.ok.text')"
      :title="$t(`security.permission.index.model.title.${pageData.formState}`)"
      @cancel="handleModelCancel($event)"
      @before-ok="handleModelOk">
    <a-form ref="validateForm" :model="formData">
      <a-form-item v-show="false">
        <a-input v-show="false" v-model="formData.id"/>
      </a-form-item>
      <a-form-item
          :label="$t('security.permission.index.form.name')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="name">
        <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
        <span v-else>{{ formData.name }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.permission.index.form.code')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
          field="code">
        <a-input v-if="pageData.button&&!formData.default" v-model="formData.code" :max-length="32"/>
        <span v-else>{{ formData.code }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.permission.index.form.type')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="type">
        <a-select v-if="pageData.button&&pageData.params.type===''" v-model="formData.type">
          <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
        </a-select>
        <span v-else>{{ $t(`security.permission.index.form.type.${formData.type}`) }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.permission.index.form.object')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="object">
        <a-input v-if="pageData.button&&pageData.params.object===''" v-model="formData.object" :max-length="32"/>
        <span v-else>{{ formData.object }}</span>
      </a-form-item>
      <a-form-item
          :label="$t('security.permission.index.form.rule')"
          :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
          field="rule">
        <a-textarea v-if="pageData.button" v-model="formData.rule" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.rule" class="textarea-span" @click="openModal(`${formData.rule}`)">{{ formData.rule }}</span>
      </a-form-item>
      <a-form-item :label="$t('security.permission.index.form.appId')" field="appId">
        <a-select :disabled="!pageData.button" v-model="formData.appId" :field-names="{value: 'id', label: 'name'}"
                  :options="selectAppOptions" allow-search/>
      </a-form-item>
      <a-form-item :label="$t('security.permission.index.form.description')" field="description">
        <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
        <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {
  createOrUpdatePermission as createOrUpdateForm,
  getPermission as getForm, QueryAppForm, QueryAppForm as QuerySelectForm, queryApps as querySelectOptions,
  QueryPermissionForm as QueryForm,
  validatePermissionCode
} from '@/api/security';
import {ListUrlParams} from '@/api/base';
import {useRoute} from "vue-router";
import {typeOptions} from "@/views/security/permission/searchTable";

// 国际化
const {t} = useI18n();
const route = useRoute();
const pageData = ref({
  formState: 'add', button: true, params: {
    type: '', object: ''
  }
});
const validateForm = ref<FormInstance>();
// 显示隐藏
const visibleModel = ref(false);
// 表单数据
const generateFormData = (): QueryForm => {
  return {
    id: '',
    name: '',
    code: '',
    type: '',
    object: '',
    rule: '',
    description: '',
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    default: false
  };
}
const formData = ref(generateFormData());
// 页面响应
let okSuccessBack: any;

/**
 * 创建、更新
 * @param params
 * @param done
 */
const createOrUpdateData = async (params: QueryForm, done: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      await createOrUpdateForm(params);
      done();
      okSuccessBack();
    } catch (err) {
      done(false);
    }
  } else {
    done(false);
  }
};

/**
 * 获取一条数据
 * @param id
 * @param successBack
 */
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getForm(id);
    successBack(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
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
    const {data} = await validatePermissionCode(formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

const selectAppOptions = ref<QuerySelectForm[]>([]);
const getSelectAppOptions = async () => {
  try {
    const {data} = await querySelectOptions({
      tenantCode: (route.params && route.params.tenantCode as string) || '',
    } as unknown as QueryAppForm);
    selectAppOptions.value = data || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

/* 对外调用方法 */
const openForm = (urlParams: ListUrlParams) => {
  getSelectAppOptions();
  // 全局
  pageData.value.formState = urlParams.action;
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.params.type = urlParams.params?.type || '';
  pageData.value.params.object = urlParams.params?.object || '';
  formData.value = {...generateFormData(), ...pageData.value.params};
  // 重置验证
  resetValidate();
  // 特色
  if (urlParams.action === "add") {
    visibleModel.value = true;
  } else if (urlParams.id) {
    getData(urlParams.id, (data: QueryForm) => {
      formData.value = data;
      visibleModel.value = true;
    });
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