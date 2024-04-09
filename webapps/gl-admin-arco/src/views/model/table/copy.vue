<script lang="ts">
export default {
  name: 'ModelTableCopy'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import type {FormInstance} from "@arco-design/web-vue";
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import {copyTable, getTableForeign, QueryConnectForm, QueryTableForm, validateTableEntityName} from "@/api/model";
import {useI18n} from "vue-i18n";

type PageParams = {
  connectId?: string; // 数据库连接主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const {t} = useI18n();// 国际化
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const appSelectOptions = ref<QueryAppForm[]>([]);

const generateFormData = () => {
  return {
    id: props.modelValue || '',
    connectId: props.parameter?.connectId || '', // 数据库连接 id
    title: '', // 名称(中文)
    entityName: '', // 实体名称
    tableComment: '', // 备注
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());

/**
 * 新增或更新接口
 * @param params
 * @param successBack
 * @param failBack
 */
const createOrUpdateData = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await copyTable(params);
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
    const {data} = await getTableForeign(id);
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
    const {data} = await validateTableEntityName(formData.value as unknown as QueryTableForm);
    if (!data) callback(t('security.form.rules.match.uniqueness'));
  } catch (err) {
    console.log(err);
  }
}

/**
 * 重置验证信息
 */
const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryTableForm) => {
    done();
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    done(false)
  });
};
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  if (props.visible === true) {
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
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm"
           :cancel-text="$t('model.table.index.model.cancel.text')"
           :footer="formState!=='view'"
           :ok-text="$t('model.table.index.model.ok.text')"
           :title="title"
           :width="width"
           title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :label="$t('model.table.index.form.title')"
                       :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                       field="title">
            <a-input v-model.trim="formData.title" :max-length="32" :readonly="formState==='view'"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :label="$t('model.table.index.form.entityName')"
                       :rules="[{required: formState==='add',message: $t('model.form.rules.match.required')},
            {match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:$t('model.form.rules.match.entityName.match')},
            {validator:validateCode}]" field="entityName">
            <a-input v-model.trim="formData.entityName" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :label="$t('model.table.index.form.appId')"
                       :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                       field="appId">
            <a-select v-model="formData.appId" :disabled="formState==='view'">
              <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="labelCol+wrapperCol">
          <a-form-item :label="$t('model.table.index.form.tableComment')"
                       :label-col-props="{ span: labelCol/formCol }"
                       :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                       field="tableComment">
            <a-textarea v-model="formData.tableComment" :auto-size="{minRows:2,maxRows:4}" :disabled="formState==='view'" :max-length="512" show-word-limit/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
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