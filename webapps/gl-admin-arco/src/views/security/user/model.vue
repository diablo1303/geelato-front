<template v-model="pageData">
  <a-form ref="validateForm" :label-col-props="{ span: 6 }" :model="formData" :wrapper-col-props="{ span: 18 }">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item v-show="false">
          <a-input v-show="false" v-model="formData.id"/>
          <a-input v-show="false" v-model="formData.salt"/>
          <a-input v-show="false" v-model="formData.orgName"/>
          <a-input v-show="false" v-model="formData.avatar"/>
          <a-input v-show="false" v-model="formData.password"/>
          <a-input v-show="false" v-model="formData.plainPassword"/>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="pageData.button" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.enName')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
            field="enName">
          <a-input v-if="pageData.button" v-model="formData.enName" :max-length="32"/>
          <span v-else>{{ formData.enName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.loginName')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateLoginName}]"
            field="loginName">
          <a-input v-if="pageData.button" v-model="formData.loginName" :max-length="32"/>
          <span v-else>{{ formData.loginName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.jobNumber')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')},{validator:validateJobNumberName}]"
            field="jobNumber">
          <a-input v-if="pageData.button" v-model="formData.jobNumber" :max-length="32"/>
          <span v-else>{{ formData.jobNumber }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.orgName')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="orgId">
          <OrgChooseBox v-if="pageData.button"
                        v-model:model-value="formData.orgId"
                        v-model:org-names="formData.orgName"
                        :max-count="1" :has-root="false" :disabled="!pageData.button"/>
          <!--          <a-tree-select
                        v-if="pageData.button"
                        v-model="formData.orgId"
                        :data="orgSelectOptions"
                        :field-names="{key:'value',title:'label'}" allow-clear allow-search/>-->
          <!-- <a-cascader v-if="pageData.button" v-model="formData.orgId" :options="orgSelectOptions" allow-clear allow-search check-strictly/>-->
          <span v-else>{{ formData.orgName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.sex')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="sex">
          <a-select v-if="pageData.button" v-model="formData.sex">
            <a-option v-for="item of sexOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.sex.${formData.sex}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.mobilePhone')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateMobilePhone}]"
            field="mobilePhone">
          <a-input v-if="pageData.button" v-model="formData.mobilePhone" :max-length="32">
            <template #prepend>
              <a-select v-model="formData.mobilePrefix" :options="prefixTypeOptions" :style="{width:'112.5px'}" allow-search>
                <template #label="{data}">
                  {{ data.value }}
                </template>
              </a-select>
            </template>
          </a-input>
          <span v-else>{{ formData.mobilePrefix }} {{ formData.mobilePhone }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.telephone')" field="telephone">
          <a-input v-if="pageData.button" v-model="formData.telephone" :max-length="32"/>
          <span v-else>{{ formData.telephone }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.email')" field="email">
          <a-input v-if="pageData.button" v-model="formData.email" :max-length="32"/>
          <span v-else>{{ formData.email }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.post')" field="post">
          <a-input v-if="pageData.button" v-model="formData.post" :max-length="32"/>
          <span v-else>{{ formData.post }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.provinceCode')" field="provinceCode">
          <a-input v-if="pageData.button" v-model="formData.provinceCode" :max-length="32"/>
          <span v-else>{{ formData.provinceCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.cityCode')" field="cityCode">
          <a-input v-if="pageData.button" v-model="formData.cityCode" :max-length="32"/>
          <span v-else>{{ formData.cityCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item :label="$t('security.user.index.form.cooperatingOrgId')" field="cooperatingOrgId">
          <a-input v-if="pageData.button" v-model="formData.cooperatingOrgId" :max-length="32"/>
          <span v-else>{{ formData.cooperatingOrgId }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="pageData.button" v-model="formData.type">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.type.${formData.type}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.source')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="source">
          <a-select v-if="pageData.button" v-model="formData.source">
            <a-option v-for="item of sourceOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.source.${formData.source}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="pageData.button" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="24/pageData.formCol">
        <a-form-item
            :label="$t('security.user.index.form.seqNo')"
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
            :label="$t('security.user.index.form.description')"
            :label-col-props="{ span: 6/pageData.formCol }"
            :wrapper-col-props="{ span: pageData.formCol===2?21:18 }" field="description">
          <a-textarea
              v-if="pageData.button" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}"
              :max-length="512" show-word-limit/>
          <span
              v-else :title="formData.description" class="textarea-span"
              @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {FormInstance, Modal, SelectOptionData} from "@arco-design/web-vue";
import {
  createOrUpdateUser as createOrUpdateForm,
  getUser as getForm,
  QueryOrgForm,
  queryOrgs,
  QueryUserForm as QueryForm,
  validateUserParams
} from '@/api/security';
import {ListUrlParams, SelectOption} from '@/api/base';
import {sexOptions, sourceOptions, typeOptions} from "@/views/security/user/searchTable";
import mobilePrefix from '@/config/mobilePrefix.json';
import {useI18n} from "vue-i18n";
import {copyToClipboard} from "@/utils/strings";
import {useRoute} from "vue-router";
import OrgChooseBox from "@/components/org-choose-box/index.vue";
import {enableStatusOptions} from "@/views/security/sysconfig/searchTable";

const route = useRoute();
const {t} = useI18n();
const pageData = ref({formState: 'add', button: true, formCol: 2});
const validateForm = ref<FormInstance>();
const orgSelectOptions = ref<SelectOption[]>([]);
const generateFormData = (): QueryForm => {
  return {
    id: '',
    jobNumber: '',
    name: '',
    enName: '',
    loginName: '',
    seqNo: 999,
    sex: 0,
    salt: '',
    avatar: '',
    password: '',
    plainPassword: '',
    mobilePrefix: '+86',
    mobilePhone: '',
    telephone: '',
    orgId: '',
    orgName: '',
    email: '',
    post: '',
    provinceCode: '',
    cityCode: '',
    type: 0,
    source: 0,
    enableStatus: 1,
    description: '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    cooperatingOrgId: ''
  };
}
const formData = ref(generateFormData());
const prefixTypeOptions = computed<SelectOptionData[]>(() => {
  const options: SelectOptionData[] = [];
  mobilePrefix.forEach((item, index) => {
    options.push({value: item.code, label: `${item.area} ${item.code}`});
  });
  return options;
});

const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.pid === data.value) {
        data.children?.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children && data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async (params: QueryOrgForm = {status: 1} as unknown as QueryOrgForm) => {
  try {
    params.tenantCode = (route.params && route.params.tenantCode as string) || '';
    const {data} = await queryOrgs(params);
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children || [];
  } catch (err) {
    console.log(err);
  }
}

const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await createOrUpdateForm(params);
      successBack(data);
      // @ts-ignore
      const pwd: string = data && data.plainPassword;
      if (pwd) {
        Modal.success({
          title: t('security.user.index.form.password'),
          content: pwd,
          okText: "复制",
          onBeforeOk: (done: any) => {
            copyToClipboard(pwd, t('copy.to.clipboard.success'), t('copy.to.clipboard.fail'));
            done(true);
          }
        });
      }
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
const validateEnName = async (value: any, callback: any) => {
  try {
    const {data} = await validateUserParams('enName', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
const validateLoginName = async (value: any, callback: any) => {
  try {
    const {data} = await validateUserParams('loginName', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
const validateJobNumberName = async (value: any, callback: any) => {
  if (formData.value.jobNumber) {
    try {
      const {data} = await validateUserParams('jobNumber', formData.value);
      if (!data) callback(t('security.form.rules.match.uniqueness'));
    } catch (err) {
      console.log(err);
    }
  }
}
const validateMobilePhone = async (value: any, callback: any) => {
  try {
    const {data} = await validateUserParams('mobilePhone', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/* 对外调用方法 */
const loadModel = (urlParams: ListUrlParams) => {
  // 组织加载
  getOrgOptions();
  // 全局
  pageData.value.formState = urlParams.action || "view";
  pageData.value.button = (urlParams.action === 'add' || urlParams.action === 'edit');
  pageData.value.formCol = urlParams.formCol || 2;
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