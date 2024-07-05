<script lang="ts">
export default {
  name: 'DictionaryEntryModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import type {FormInstance} from "@arco-design/web-vue";
import {Modal} from "@arco-design/web-vue";
import {securityApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryDictItemForm} from "@geelato/gl-ui";
import {enableStatusOptions} from "../searchTable";

// 页面所需 参数
type PageParams = {
  pid: string; // 父级主键
  dictId: string; // 字典主键
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
});

const labelCol = ref<number>(6);// 表单-标题宽度
const wrapperCol = ref<number>(18); // 表单-内容宽度
const validateForm = ref<FormInstance>();// 表单-校验
/* 表单 */
const generateFormData = () => {
  return {
    id: props.modelValue || '',
    pid: props.parameter.pid || '',
    dictId: props.parameter.dictId || '',
    itemName: '',
    itemCode: '',
    enableStatus: 1,
    seqNo: 999,
    itemRemark: '',
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
const createOrUpdateData = async (params: QueryDictItemForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await securityApi.createOrUpdateDictItem(params);
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
    const {data} = await securityApi.getDictItem(id);
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
    const {data} = await securityApi.validateDictItemCode(formData.value);
    if (!data) callback('不能重复');
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
  createOrUpdateData(formData.value, (data: QueryDictItemForm) => {
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
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryDictItemForm) => {
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
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="itemName" label="名称">
          <a-input v-if="formState!=='view'" v-model.trim="formData.itemName" :max-length="32"/>
          <span v-else>{{ formData.itemName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'},{validator:validateCode}]" field="itemCode" label="编码">
          <a-textarea v-if="formState!=='view'" v-model.trim="formData.itemCode" :auto-size="{minRows:1,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else>{{ formData.itemCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus" :options="enableStatusOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.enableStatus, enableStatusOptions) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="seqNo" label="排序">
          <a-input-number v-if="formState!=='view'" v-model="formData.seqNo" :max="999999999" :min="1" :precision="0" placeholder="长度 [0,999999999]"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item :label-col-props="{ span: labelCol/formCol }" :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="itemRemark" label="备注">
          <a-textarea v-if="formState!=='view'" v-model="formData.itemRemark" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.itemRemark" class="textarea-span" @click="openModal(`${formData.itemRemark}`)">{{ formData.itemRemark }}</span>
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