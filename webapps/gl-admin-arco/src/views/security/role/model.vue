<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
            :label="$t('security.role.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
            :label="$t('security.role.index.form.code')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="code">
          <a-input v-if="pageData.button" v-model="formData.code" :max-length="32"/>
          <span v-else>{{ formData.code }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
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
      <a-col :span="12">
        <a-form-item
            :label="$t('security.role.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="pageData.button" v-model="formData.type">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.role.index.form.type.${formData.type}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
            :label="$t('security.role.index.form.seqNo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number
              v-if="pageData.button" v-model="formData.seqNo" :max="999999" :min="1"
              :placeholder="$t('security.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
            :label="$t('security.role.index.form.description')" :label-col-props="{ span: 3 }"
            :wrapper-col-props="{ span: 21 }" field="description">
          <a-textarea v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {Modal} from "@arco-design/web-vue";
import {createOrUpdateRole as createOrUpdateForm, getRole as getForm, QueryRoleForm as QueryForm} from '@/api/security';
import {ListUrlParams} from '@/api/base';
import {enableStatusOptions, typeOptions} from "@/views/security/role/searchTable";
import {FormInstance} from "@arco-design/web-vue/es/form";

const pageData = ref({formState: 'add', button: true});
const validateForm = ref<FormInstance>();
const generateFormData = (): QueryForm => {
  return {
    id: '',
    name: '',
    code: '',
    type: '',
    enableStatus: 1,
    seqNo: 999,
    description: ''
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