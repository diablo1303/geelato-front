<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 8 }" :model="formData" :wrapper-col-props="{ span: 16 }"
          class="form">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbConnectName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbConnectName">
          <a-input v-if="pageData.button" v-model.trim="formData.dbConnectName" :max-length="125"/>
          <span v-else>{{ formData.dbConnectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbSchema')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbSchema">
          <a-input v-if="pageData.button" v-model.trim="formData.dbSchema" :max-length="125"/>
          <span v-else>{{ formData.dbSchema }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbName">
          <a-input v-if="pageData.button" v-model.trim="formData.dbName" :max-length="75"/>
          <span v-else>{{ formData.dbName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbType')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbType">
          <a-select v-if="pageData.button" v-model="formData.dbType" :options="dbTypeOptions"/>
          <span v-else>{{ formData.dbType }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbHostnameIp')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbHostnameIp">
          <a-input v-if="pageData.button" v-model.trim="formData.dbHostnameIp" :max-length="75"/>
          <span v-else>{{ formData.dbHostnameIp }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbPort')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbPort">
          <a-input-number
              v-if="pageData.button"
              v-model.trim="formData.dbPort"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
          <span v-else>{{ formData.dbPort }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbUserName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbUserName">
          <a-input v-if="pageData.button" v-model="formData.dbUserName" :max-length="10"/>
          <span v-else>{{ formData.dbUserName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbPassword')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbPassword">
          <a-input-password
              v-if="pageData.button"
              v-model="formData.dbPassword"
              :invisible-button="false"
              :max-length="25" allow-clear/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('model.connect.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string"
                      :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.connect.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {ListUrlParams} from '@/api/base';
import {createOrUpdateConnect as createOrUpdateForm, getConnect as getForm, jdbcConnect, QueryConnectForm as QueryForm} from '@/api/model';
import {dbTypeOptions, enableStatusOptions} from "@/views/model/connect/searchTable";
import {useRoute} from "vue-router";

const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
const pageData = ref({formState: 'add', button: true, formCol: 1});
const validateForm = ref<FormInstance>();
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: '',
    dbConnectName: '',
    dbName: '',
    dbSchema: '',
    dbType: '', // 数据库类型 mysql|oracle|sqlserver|postgresql
    dbHostnameIp: '', // 主机名或IP
    dbPort: 3306, // 连接端口
    dbUserName: '',// 用户名
    dbPassword: '', // 密码
    enableStatus: 1, // 状态
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode,
  };
}
const formData = ref(generateFormData());

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      await createOrUpdateForm(params);
      successBack(params);
    } catch (err) {
      failBack(err);
    }
  } else {
    failBack();
  }
};
const connectionTest = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await jdbcConnect(params);
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
      formData.value = data;
      urlParams.loadSuccessBack(data);
    }, urlParams.loadFailBack);
  }
}
const submitModel = (done: any, successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, successBack, failBack);
};
const connectModel = (successBack?: any, failBack?: any) => {
  connectionTest(formData.value, successBack, failBack);
};

// 将方法暴露出去
defineExpose({loadModel, submitModel, connectModel});
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