<script lang="ts">
export default {
  name: 'UserModel'
};
</script>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {Message, Modal} from "@arco-design/web-vue";
import type {FormInstance, SelectOptionData} from "@arco-design/web-vue";
import {utils, securityApi} from '@geelato/gl-ui'
import type {QueryUserForm} from '@geelato/gl-ui';
import mobilePrefix from '../../../assets/mobilePrefix.json';
import {sexOptions, sourceOptions, typeOptions, enableStatusOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
  orgId: string; // 组织主键
  orgName: string; // 组织名称
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
});

const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = (): QueryUserForm => {
  return {
    id: props.modelValue || '',
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
    orgId: props.parameter.orgId || '',
    orgName: props.parameter.orgName || '',
    email: '',
    post: '',
    provinceCode: '',
    cityCode: '',
    type: 0,
    source: 0,
    enableStatus: 1,
    description: '',
    cooperatingOrgId: '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
// 国际区号
const prefixTypeOptions = computed<SelectOptionData[]>(() => {
  const options: SelectOptionData[] = [];
  mobilePrefix.forEach((item, index) => {
    options.push({value: item.code, label: `${item.area} ${item.code}`});
  });
  return options;
});
/* 区域选择框宽度变化 */
const prefixStyle = ref({width: '86px'});
const prefixVisibleChange = (visible: boolean) => {
  prefixStyle.value = {width: visible ? '200px' : '94px'};
}

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const saveData = async (params: QueryUserForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await securityApi.createOrUpdateUser(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await securityApi.getUser(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 唯一性校验
 * @param value
 * @param callback
 */
const validateEnName = async (value: any, callback: any) => {
  try {
    const {data} = await securityApi.validateUserParams('enName', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
const validateLoginName = async (value: any, callback: any) => {
  try {
    const {data} = await securityApi.validateUserParams('loginName', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
const validateJobNumberName = async (value: any, callback: any) => {
  if (formData.value.jobNumber) {
    try {
      const {data} = await securityApi.validateUserParams('jobNumber', formData.value);
      if (!data) callback(t('security.form.rules.match.uniqueness'));
    } catch (err) {
      console.log(err);
    }
  }
}
const validateMobilePhone = async (value: any, callback: any) => {
  try {
    const {data} = await securityApi.validateUserParams('mobilePhone', formData.value);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}
/**
 * 文本域查看
 * @param content
 */
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}
/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 复制密码
 * @param value
 */
const copyPlainPassword = (value: string) => {
  if (value) {
    Modal.success({
      title: t('security.user.index.form.password'),
      content: value,
      okText: "复制",
      onBeforeOk: (done: any) => {
        utils.copyToClipboard(value, () => {
          Message.success(t('copy.to.clipboard.success'));
        }, () => {
          Message.error(t('copy.to.clipboard.fail'));
        });
        done(true);
      }
    });
  }
}

/**
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  saveData(formData.value, (data: QueryUserForm) => {
    // 复制密码
    copyPlainPassword(data && data.plainPassword);
    // 设计当前页面的操作
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 其他初始化
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryUserForm) => {
      // 表格数据处理
      data.seqNo = Number(data.seqNo);
      formData.value = data;
    });
  }
}

watch(() => props, () => {
  if (props.visible === true) loadPage();
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({saveOrUpdate, loadPage});
</script>

<template>
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.enName')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')}]"
            field="enName">
          <a-input v-if="formState!=='view'" v-model="formData.enName" :max-length="32"/>
          <span v-else>{{ formData.enName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.loginName')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateLoginName}]"
            field="loginName">
          <a-input v-if="formState!=='view'" v-model="formData.loginName" :max-length="32"/>
          <span v-else>{{ formData.loginName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.jobNumber')"
            :rules="[{required: false,message: $t('security.form.rules.match.required')},{validator:validateJobNumberName}]"
            field="jobNumber">
          <a-input v-if="formState!=='view'" v-model="formData.jobNumber" :max-length="32"/>
          <span v-else>{{ formData.jobNumber }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.orgName')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="orgId">
          <GlOrgSelect v-if="formState!=='view'"
                       v-model:model-value="formData.orgId"
                       v-model:org-names="formData.orgName"
                       :max-count="1" :has-root="false"/>
          <span v-else>{{ formData.orgName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.sex')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="sex">
          <a-select v-if="formState!=='view'" v-model="formData.sex">
            <a-option v-for="item of sexOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.sex.${formData.sex}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.mobilePhone')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateMobilePhone}]"
            field="mobilePhone">
          <a-select v-if="formState!=='view'" v-model="formData.mobilePrefix" :style="prefixStyle"
                    allow-search @popupVisibleChange="prefixVisibleChange">
            <a-option v-for="(item,index) in prefixTypeOptions" :key="index" :title="item.label"
                      :label="item.label" :value="item.value" :disabled="item.disabled"/>
            <template #label="{data}">
              {{ data.value }}
            </template>
          </a-select>
          <a-input v-if="formState!=='view'" v-model="formData.mobilePhone" :max-length="32"/>
          <span v-else>{{ formData.mobilePrefix }} {{ formData.mobilePhone }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.telephone')" field="telephone">
          <a-input v-if="formState!=='view'" v-model="formData.telephone" :max-length="32"/>
          <span v-else>{{ formData.telephone }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.email')" field="email">
          <a-input v-if="formState!=='view'" v-model="formData.email" :max-length="32"/>
          <span v-else>{{ formData.email }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.post')" field="post">
          <a-input v-if="formState!=='view'" v-model="formData.post" :max-length="32"/>
          <span v-else>{{ formData.post }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.provinceCode')" field="provinceCode">
          <a-input v-if="formState!=='view'" v-model="formData.provinceCode" :max-length="32"/>
          <span v-else>{{ formData.provinceCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.cityCode')" field="cityCode">
          <a-input v-if="formState!=='view'" v-model="formData.cityCode" :max-length="32"/>
          <span v-else>{{ formData.cityCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.user.index.form.cooperatingOrgId')" field="cooperatingOrgId">
          <a-input v-if="formState!=='view'" v-model="formData.cooperatingOrgId" :max-length="32"/>
          <span v-else>{{ formData.cooperatingOrgId }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="formState!=='view'" v-model="formData.type">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.type.${formData.type}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.source')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="source">
          <a-select v-if="formState!=='view'" v-model="formData.source">
            <a-option v-for="item of sourceOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.source.${formData.source}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.enableStatus')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`security.user.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.user.index.form.seqNo')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number v-if="formState!=='view'" v-model="formData.seqNo" :max="999999999" :min="1"
                          :placeholder="$t('security.form.rules.match.length.title')+'[0,999999999]'" :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     :label="$t('security.user.index.form.description')" field="description">
          <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style lang="less" scoped>
div.arco-form-item-content > span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
}
</style>