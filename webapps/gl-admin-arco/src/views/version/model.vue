<script lang="ts">
export default {
  name: 'AppVersionModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal, SelectOptionData} from "@arco-design/web-vue";
import {queryAppSelectOptions} from "@/api/application";
import {
  QueryAppVersionForm as QueryForm,
  createOrUpdateAppVersion as saveForm,
  getAppVersion as getForm,
} from '@/api/application'
import UploadFile from "@/components/upload-file/index.vue";
import {packageSourceOptions} from "@/views/version/searchTable";

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
    version: '',
    packagePath: '',
    packageSource: 'upload',
    packetTime: '',
    status: 'unused',
    description: '',
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<SelectOptionData[]>([]);
const appComplete = ref<SelectOptionData[]>([]);

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
      const {data} = await saveForm(params);
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

const uploadFileChange = (record: Record<string, any>) => {
  if (record.baseName) {
    // 使用'.'作为分隔符将文件名和扩展名分开
    const parts = record.baseName.split('.');
    // 移除最后一个元素（即扩展名）
    formData.value.version = parts.slice(0, -1).join('.');
  }
}

/**
 * 页面加载方法，对外提供
 */
const loadPage = () => {
  // 应用信息
  queryAppSelectOptions({
    id: '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: SelectOptionData[]) => {
    appSelectOptions.value = data || [];
    appComplete.value = data || [];
  }, () => {
    appSelectOptions.value = [];
    appComplete.value = [];
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
defineExpose({saveOrUpdate, loadPage});
</script>

<template>
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="packagePath" label="应用包上传">
          <UploadFile v-model="formData.packagePath" :disabled="formState==='view'" :object-id="formData.id"
                      :parameter="parameter" accept=".zgdp" genre="uploadVersion"
                      @change="uploadFileChange"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="version" label="版本名称">
          <a-input v-if="formState!=='view'" v-model.trim="formData.version" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="packageSource" label="版本来源">
          <a-select v-model="formData.packageSource" :disabled="true" :options="packageSourceOptions"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="应用主键">
          <a-auto-complete v-model="formData.appId" :data="appComplete" allow-clear placeholder="please enter something"/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="description" label="版本描述">
          <a-textarea v-if="formState!=='view'"
                      v-model="formData.description"
                      :auto-size="{minRows:2,maxRows:4}"
                      :max-length="512"
                      show-word-limit/>
          <span v-else
                :title="formData.description"
                class="textarea-span"
                @click="openModal(`${formData.description}`)">
            {{ formData.description }}
          </span>
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