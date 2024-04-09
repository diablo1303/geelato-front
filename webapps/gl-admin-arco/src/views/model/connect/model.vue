<script lang="ts">
export default {
  name: 'ModelConnectModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Message, Modal, SelectOptionData} from "@arco-design/web-vue";
import {querySelectOptions} from "@/api/security";
import {createOrUpdateConnect as createOrUpdateForm, getConnect as getForm, jdbcConnect, QueryConnectForm as QueryForm} from "@/api/model";
import {enableStatusOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
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
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
    dbConnectName: '',
    dbName: '',
    dbSchema: '',
    dbType: '', // 数据库类型 mysql|oracle|sqlserver|postgresql
    dbHostnameIp: '', // 主机名或IP
    dbPort: 3306, // 连接端口
    dbUserName: '',// 用户名
    dbPassword: '', // 密码
    enableStatus: 1, // 状态
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const dbTypeOptions = ref<SelectOptionData[]>([]);

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const saveData = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await createOrUpdateForm(params);
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
    const {data} = await getForm(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 测试链接可行性接口
 * @param params
 * @param successBack
 * @param failBack
 */
const connectionTest = async (params: QueryForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await jdbcConnect(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else if (failBack && typeof failBack === 'function') failBack();
};

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
 * 测试链接按钮
 * @param ev
 */
const linkTest = (ev?: MouseEvent) => {
  connectionTest(formData.value, (result: boolean) => {
    if (result === true) {
      Message.success(t('model.connect.index.model.title.link.success'));
    } else {
      Message.error(t('model.connect.index.model.title.link.fail'));
    }
  });
}

/**
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  saveData(formData.value, (data: QueryForm) => {
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
  // 数据库类型
  querySelectOptions("dbType").then((data) => {
    dbTypeOptions.value = data || [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 其他初始化
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      formData.value = data;
    });
  }
}

watch(() => props, () => {
  if (props.visible === true) loadPage();
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({saveOrUpdate, loadPage, linkTest});
</script>

<template>
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbConnectName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbConnectName">
          <a-input v-if="formState!=='view'" v-model.trim="formData.dbConnectName" :max-length="125"/>
          <span v-else>{{ formData.dbConnectName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbSchema')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbSchema">
          <a-input v-if="formState!=='view'" v-model.trim="formData.dbSchema" :max-length="125"/>
          <span v-else>{{ formData.dbSchema }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbName">
          <a-input v-if="formState!=='view'" v-model.trim="formData.dbName" :max-length="75"/>
          <span v-else>{{ formData.dbName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbType')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbType">
          <a-select v-if="formState!=='view'" v-model="formData.dbType" :options="dbTypeOptions"/>
          <span v-else>{{ formData.dbType }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbHostnameIp')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbHostnameIp">
          <a-input v-if="formState!=='view'" v-model.trim="formData.dbHostnameIp" :max-length="75"/>
          <span v-else>{{ formData.dbHostnameIp }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbPort')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbPort">
          <a-input-number
              v-if="formState!=='view'"
              v-model.trim="formData.dbPort"
              :max="999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999]'"
              :precision="0"/>
          <span v-else>{{ formData.dbPort }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbUserName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbUserName">
          <a-input v-if="formState!=='view'" v-model="formData.dbUserName" :max-length="10"/>
          <span v-else>{{ formData.dbUserName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.dbPassword')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="dbPassword">
          <a-input-password
              v-if="formState!=='view'"
              v-model="formData.dbPassword"
              :invisible-button="false"
              :max-length="25" allow-clear/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.connect.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option v-for="item of enableStatusOptions" :key="item.value as string"
                      :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.connect.index.form.enableStatus.${formData.enableStatus}`) }}</span>
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
}
</style>