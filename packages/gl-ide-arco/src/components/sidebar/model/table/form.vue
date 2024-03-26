<script lang="ts">
export default {
  name: 'GlModelTableForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {FormInstance} from "@arco-design/web-vue";
import {modelApi, applicationApi} from "@geelato/gl-ui";
import type {QueryConnectForm, QueryTableForm, QueryAppForm} from '@geelato/gl-ui';
import {enableStatusOptions, linkedOptions, tableTypeOptions} from "./searchTable";

type PageParams = {
  connectId?: string; // 数据库连接主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveSuccess']);
const props = defineProps({
  modelValue: {type: String, default: ''},// id
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  visible: {type: Boolean, default: false},// 显示
  formState: {type: String, default: 'add'},// 表单状态
  formCol: {type: Number, default: 1},// 表单列数
  title: {type: String, default: '模型数据'},
  width: {type: String, default: ''},// 表单宽度
});

const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const appSelectOptions = ref<QueryAppForm[]>([]);
const connectSelectOptions = ref<QueryConnectForm[]>([]);
/* 表单 */
const generateFormData = (): QueryTableForm => {
  return {
    id: props.modelValue || '',
    connectId: props.parameter?.connectId || '', // 数据库连接 id
    title: '', // 名称(中文)
    tableName: '', // 数据库中的表名
    entityName: '', // 实体名称
    linked: 0, // 已链接
    tableType: 'table', // 表格类型 entity:实体;view:视图
    viewSql: '',
    enableStatus: 1, // 状态
    seqNo: 999, // 排序
    tableComment: '', // 备注
    description: '', // 补充描述
    synced: false,
    sourceType: 'creation',
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
const createOrUpdateData = async (params: QueryTableForm, successBack?: any, failBack?: any) => {
  const res = await validateForm.value?.validate();
  if (!res) {
    try {
      const {data} = await modelApi.createOrUpdateTable(params);
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
    const {data} = await modelApi.getTable(id);
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
    const {data} = await modelApi.validateTableEntityName(formData.value);
    if (!data) callback('不能重复');
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
    done(false);
  });
};
/**
 * 取消修改按钮
 * @param ev
 */
const handleModelCancel = (ev: MouseEvent) => {
  visibleForm.value = false;
}

watch(() => props, () => {
  if (props.visible === true) {
    // 应用信息
    applicationApi.getAppSelectOptions({
      id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 数据连接信息
    modelApi.getConnectSelectOptions({
      appId: '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryConnectForm[]) => {
      connectSelectOptions.value = data || [];
    }, () => {
      connectSelectOptions.value = [];
    });
    // 表单数据重置
    formData.value = generateFormData();
    // 重置验证
    resetValidate();
    // 编辑、查看 状态 查询数据
    if (['edit', 'view'].includes(props.formState) && props.modelValue) {
      getData(props.modelValue, (data: QueryTableForm) => {
        data.seqNo = Number(data.seqNo);
        formData.value = data;
      });
    }
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm" :footer="formState!=='view'" :title="title"
           :width="width || ''" cancel-text="取消" ok-text="确定"
           @cancel="handleModelCancel($event)" @before-ok="handleModelOk">
    <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="title" label="名称(中文)">
            <a-input v-model.trim="formData.title" :max-length="32" :readonly="formState==='view'"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: formState==='add',message: '这是必填项'},{match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:'匹配：‘a-z’、‘A-Z’、‘0-9’、‘_’'},
                        {validator:validateCode}]" field="entityName" label="实体名称">
            <a-input v-model.trim="formData.entityName" :max-length="30" :readonly="formState!=='add'"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item field="tableName" label="数据库表名">
            <span>{{ formData.tableName }}</span>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="tableType" label="表格类型">
            <a-select v-model="formData.tableType" :disabled="formState!=='add'">
              <a-option v-for="item of tableTypeOptions" :key="item.value as string" :disabled="item.disabled" :label="item.label" :value="item.value"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="所属应用">
            <a-select v-model="formData.appId" :disabled="formState==='view'">
              <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="数据库链接">
            <a-select v-model="formData.connectId" :disabled="formState==='view'">
              <a-option v-for="item of connectSelectOptions" :key="item.id as string" :label="`${item.dbConnectName}[${item.dbName}]`" :value="item.id"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
            <a-select v-model="formData.enableStatus" :disabled="formState==='view'">
              <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="item.label" :value="item.value"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)/formCol">
          <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="linked" label="连接状态">
            <a-select v-model="formData.linked" :disabled="formState==='view'">
              <a-option v-for="item of linkedOptions" :key="item.value as string" :label="item.label" :value="item.value"/>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="textareaTotal = (labelCol+wrapperCol)/((formCol%2===0)?formCol/2:1)">
          <a-form-item :label-col-props="{ span: (formCol===1?6:3) }" :wrapper-col-props="{ span: (formCol===1?18:21) }"
                       field="tableComment" label="数据库注释">
            <a-textarea v-model="formData.tableComment" :auto-size="{minRows:2,maxRows:4}" :disabled="formState==='view'" :max-length="512" show-word-limit/>
          </a-form-item>
        </a-col>
        <a-col :span="textareaTotal = (labelCol+wrapperCol)/((formCol%2===0)?formCol/2:1)">
          <a-form-item :label-col-props="{ span: labelCol/formCol }" :wrapper-col-props="{ span: textareaTotal-(labelCol/formCol) }"
                       field="description" label="补充描述">
            <a-textarea v-model="formData.description" :auto-size="{minRows:2,maxRows:4}" :disabled="formState==='view'" :max-length="512" show-word-limit/>
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

.trigger-demo-translate {
  padding: 10px;
  min-width: 500px;
  min-height: 360px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>