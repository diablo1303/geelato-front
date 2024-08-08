<script lang="ts">
export default {
  name: 'GlModelRestfulAppForm'
};
</script>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Modal, type SelectOptionData} from "@arco-design/web-vue";
import type {TableColumnData, FormInstance} from "@arco-design/web-vue";
import type {QueryAppForm, QueryAppRestfulForm, QueryRestfulForm} from '@geelato/gl-ui';
import {restfulApi, applicationApi, useGlobal} from "@geelato/gl-ui";
import {approvalStatusOptions} from "../searchTable";

type PageParams = {
  restfulId: string; // 数据库链接id
  restfulTitle: string; // 模型名称
  restfulKey: string;
  restfulAppId: string; // 应用id
  author: boolean; // 创建人
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
  title: {type: String, default: '模型视图'},// 表达标题
  width: {type: String, default: ''},// 表单宽度
});

const global = useGlobal();
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const tableTabHeight = ref<number>(555);
const tableTabStyle = ref({height: `${tableTabHeight.value}px`});
const appSelectOptions = ref<QueryAppForm[]>([]);
const resfulSelectOptions = ref<SelectOptionData[]>([]);

const generateFormData = (): QueryAppRestfulForm => {
  return {
    id: props.modelValue || '',
    appName: '',
    restfulId: props.parameter.restfulId || '',
    restfulTitle: props.parameter.restfulTitle || '',
    restfulKey: '',
    restfulAppId: props.parameter.restfulAppId || '',
    approvalStatus: 'draft',
    approvalNeed: false,
    enableStatus: 1,
    description: '',
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
const createOrUpdateData = async (params: QueryAppRestfulForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await restfulApi.createOrUpdateAppRestful(params);
      if (successBack && typeof successBack === 'function') successBack(data);
    } catch (err) {
      if (failBack && typeof failBack === 'function') failBack(err);
    }
  } else {
    if (failBack && typeof failBack === 'function') failBack();
  }
};
/**
 * 获取单条数据接口
 * @param id
 * @param successBack
 * @param failBack
 */
const getData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await restfulApi.getAppRestful(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

const queryRestfulSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await restfulApi.pageQueryRestfuls(params);
    if (successBack && typeof successBack === 'function') successBack(data.items || []);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

/**
 * 单个数据删除接口
 * @param id
 * @param successBack
 * @param failBack
 */
const deleteData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    await restfulApi.deleteAppRestful(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

const resetValidate = async () => {
  await validateForm.value?.resetFields();
};

/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, (data: QueryAppRestfulForm) => {
    done(true);
    visibleForm.value = false;
    emits('saveSuccess', data, props.formState);
  }, () => {
    done(false);
    visibleForm.value = true;
  });
};

/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
}

const tableAppIdChange = () => {
  resfulSelectOptions.value = [];
  formData.value.restfulId = '';
  if (formData.value.restfulAppId) {
    queryRestfulSelectOptions({
      order: 'keyName|asc', current: 1, pageSize: 10000,
      appId: formData.value.restfulAppId, tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryRestfulForm[]) => {
      for (const item of data) {
        resfulSelectOptions.value.push({label: `${item.keyName} ${item.title}`, value: item.id});
      }
    });
  }
}

watch(() => props, () => {
  // 显示页面
  visibleForm.value = props.visible === true;
  if (props.visible === true) {
    // 应用信息
    applicationApi.getAppSelectOptions({
      id: '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data.filter((item) => item.id !== props.parameter?.appId) || [];
    }, () => {
      appSelectOptions.value = [];
    });
    tableAppIdChange();
    // 表单数据重置
    formData.value = generateFormData();
    // 重置验证
    resetValidate();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryAppRestfulForm) => {
        formData.value = JSON.parse(JSON.stringify(data));
        tableAppIdChange();
        formData.value.restfulId = data.restfulId;
      });
    }
  }
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});

type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'&&['draft','reject'].includes(formData.approvalStatus)" :width="width" cancel-text="取消"
           draggable ok-text="确认" title-align="start"
           @cancel="handleModelCancel" @before-ok="handleModelOk">
    <template #title>
      <a-space>
        {{ title || '自定义SQL权限申请 |' }}
        <span v-for="option of approvalStatusOptions.filter((item)=> item.value===formData.approvalStatus)"
              :style="option.other">{{ option.label }}</span>
      </a-space>
    </template>
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col v-if="!parameter.author" :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="appId" label="申请来源">
            <span>{{ formData.appName }}</span>
          </a-form-item>
        </a-col>
        <a-col v-else :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="restfulAppId" label="所属应用">
            <a-select v-if="formState!=='view'&&!!parameter.author" v-model="formData.restfulAppId" :disabled="!!parameter.restfulAppId"
                      allow-search @change="tableAppIdChange">
              <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
            </a-select>
            <span v-else>{{ formData.restfulAppId }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="restfulId" label="自定义接口">
            <a-select v-if="formState!=='view'&&!!parameter.author" v-model="formData.restfulId" :disabled="!!parameter.restfulId"
                      :options="resfulSelectOptions" allow-search/>
            <span v-else>{{ `${formData.restfulKey} ${formData.restfulTitle}` }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="labelCol+wrapperCol">
          <a-form-item :label-col-props="{ span: labelCol/formCol }"
                       :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                       field="description" label="补充描述">
            <a-textarea v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
            <span v-else :title="formData.description" class="textarea-span" @click="openModal(`${formData.description}`)">
              {{ formData.description }}
            </span>
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
  white-space: normal;
  word-wrap: break-word;
}
</style>