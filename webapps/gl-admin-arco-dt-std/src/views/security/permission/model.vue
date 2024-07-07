<script lang="ts">
export default {
  name: 'PermissionFormModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {
  createOrUpdatePermission as createOrUpdateForm,
  getPermission as getForm,
  QueryAppForm,
  QueryPermissionForm as QueryForm,
  validatePermissionCode
} from '@/api/security';
import {getAppSelectOptions} from "@/api/application";
import {ruleOptions, typeOptions} from "@/views/security/permission/searchTable";
import {utils} from "@geelato/gl-ui";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";

// 页面所需 参数
type PageParams = {
  object: string; // 对象
  type: string; // 类型
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  visible: {type: Boolean, default: false},// 显示
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  autoCode: {type: Boolean, default: false},// 默认19位字符串
});


const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = (): QueryForm => {
  return {
    id: props.modelValue || '',
    name: '',
    code: props.autoCode ? utils.uuid(19) : '',
    type: props.parameter.type || '',
    object: props.parameter.object || '',
    rule: '',
    description: '',
    default: false,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: QueryForm, successBack?: any, failBack?: any) => {
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

function extractBetweenHashes(str: string) {
  // 使用正则表达式匹配 # 之间的内容
  // 这里使用了非贪婪匹配（?:），这样如果字符串中有多个 # 对，它只会匹配到最近的那一对
  const regex = /#(.*?)#/g;
  let matches;
  const result = [];
  // 使用 exec 方法在字符串中查找所有匹配项
  // 注意：exec 方法在每次调用后都会更新 lastIndex 属性，所以我们需要在一个循环中使用它
  // eslint-disable-next-line no-cond-assign
  while ((matches = regex.exec(str)) !== null) {
    // 第一个匹配项（整个匹配）在索引 0，我们想要的是捕获组（括号内的部分），它在索引 1
    result.push(matches[1]);
  }

  return result;
}

const validateRule = async (value: any, callback: any) => {
  const regex = ruleOptions.value.map(item => item.value);
  try {
    let isRegex = true;
    const data: string[] = extractBetweenHashes(formData.value.rule);
    if (data && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const datum of data) {
        if (!datum || !regex.includes(`#${datum}#`)) {
          isRegex = false;
          break;
        }
      }
    }
    if (!isRegex) callback(t('security.form.rules.match.permission.rule'));
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
 * 页面数据创建或更新方法，对外提供
 * @param successBack
 * @param failBack
 */
const saveOrUpdate = (successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, (data: QueryForm) => {
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
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      // 表格数据处理
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
            :label="$t('security.permission.index.form.name')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="name">
          <a-input v-if="formState!=='view'" v-model="formData.name" :max-length="32"/>
          <span v-else>{{ formData.name }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.permission.index.form.code')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateCode}]"
            field="code">
          <a-input v-if="formState!=='view'&&!formData.default&&!autoCode" v-model="formData.code" :max-length="32"/>
          <span v-else>{{ formData.code }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.permission.index.form.type')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="type">
          <a-select v-if="formState!=='view'&&!parameter.type" v-model="formData.type">
            <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ formData.type ? $t(`security.permission.index.form.type.${formData.type}`) : '' }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('security.permission.index.form.object')"
            :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
            field="object">
          <a-input v-if="formState!=='view'&&!parameter.object" v-model="formData.object" :max-length="32"/>
          <span v-else>{{ formData.object }}</span>
        </a-form-item>
      </a-col>
      <a-col v-if="!!parameter.appId" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('security.permission.index.form.appId')"
                     :rules="[{required: true,message: $t('security.form.rules.match.required')}]"
                     field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'" :field-names="{value: 'id', label: 'name'}"
                    :options="appSelectOptions" allow-search/>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.permission.index.form.rule')"
                     :label-col-props="{ span: labelCol/formCol }"
                     :rules="[{required: true,message: $t('security.form.rules.match.required')},{validator:validateRule}]"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="rule">
          <a-textarea v-if="formState!=='view'" v-model="formData.rule" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.rule" class="textarea-span" @click="openModal(`${formData.rule}`)">{{ formData.rule }}</span>
          <template v-if="formState!=='view'" #extra>
            <a-descriptions :column="formCol" bordered="true" layout="" size="small">
              <a-descriptions-item v-for="(item,index) of ruleOptions" :key="index" :label="item.label">
                <CopyToClipboard v-if="item.value" :model-value="item.value"/>
                {{ item.value }}
              </a-descriptions-item>
            </a-descriptions>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label="$t('security.permission.index.form.description')" :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }" field="description">
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
}
</style>