<script lang="ts">
export default {
  name: 'GlModelTableForm'
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {type FormInstance, Modal, type SelectOptionData} from "@arco-design/web-vue";
import {modelApi, applicationApi, utils} from "@geelato/gl-ui";
import type {QueryConnectForm, QueryTableForm, QueryAppForm} from '@geelato/gl-ui';
import {enableStatusOptions, linkedOptions, packBusDataOptions, tableTypeOptions} from "./searchTable";
import {appTypeOptions} from "../application/searchTable";

type PageParams = {
  connectId?: string; // 数据库连接主键
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
  title: {type: String, default: '模型数据'},
  width: {type: String, default: ''},// 表单宽度
});

const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
const validateForm = ref<FormInstance>();
const visibleForm = ref<boolean>(false);
const appSelectOptions = ref<QueryAppForm[]>([]);
const connectSelectOptions = ref<SelectOptionData[]>([]);
const entityIsEdit = ref<boolean>(false);
const isShowPackBusData = ref<boolean>(false);
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
    packBusData: 0,
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

const getConnectSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await applicationApi.pageQueryAppConnectOf({
      ...params, current: 1, pageSize: 10000, order: 'updateAt|desc'
    });
    const options: SelectOptionData[] = [];
    if (data && data.items && data.items.length > 0) {
      for (const item of data.items) {
        options.push({
          // @ts-ignore
          label: `${item.connectTitle}[${item.connectName}]`,
          // @ts-ignore
          value: item.connectId,
          // @ts-ignore
          disabled: item.connectEnableStatus === false,
        });
      }
    }
    if (successBack && typeof successBack === 'function') successBack(options);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

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

const changePackBusData = () => {
  isShowPackBusData.value = false;
  if (formData.value.appId) {
    if (appSelectOptions.value && appSelectOptions.value.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of appSelectOptions.value) {
        if (item.id === formData.value.appId) {
          isShowPackBusData.value = item.type === 'platform';
          break;
        }
      }
    }
  }
}

const appSelectChange = () => {
  formData.value.packBusData = 0;
  changePackBusData();
}


const loadPage = async () => {
  entityIsEdit.value = props.formState === 'add';
  // 表单数据重置
  formData.value = generateFormData();
  // 应用信息
  await applicationApi.getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
    changePackBusData();
  }, () => {
    appSelectOptions.value = [];
  });
  // 数据连接信息
  getConnectSelectOptions({
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: SelectOptionData[]) => {
    connectSelectOptions.value = data || [];
  }, () => {
    connectSelectOptions.value = [];
  });
  // 重置验证
  resetValidate();
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    await getData(props.modelValue, (data: QueryTableForm) => {
      data.seqNo = Number(data.seqNo);
      entityIsEdit.value = !data.tableName;
      formData.value = data;
      changePackBusData();
    });
  }
}

const saveOrUpdate = (successBack?: any, failBack?: any) => {
  createOrUpdateData(formData.value, (data: QueryTableForm) => {
    if (successBack && typeof successBack === 'function') successBack(data);
  }, () => {
    if (failBack && typeof failBack === 'function') failBack();
  });
}

watch(() => props, () => {
  if (props.visible === true) {
    loadPage();
  }
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({saveOrUpdate, loadPage});
</script>

<template>
  <a-form ref="validateForm" :label-col-props="{ span: labelCol }" :model="formData" :wrapper-col-props="{ span: wrapperCol }">
    <a-row :gutter="wrapperCol">
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="title" label="名称(中文)">
          <a-input v-if="formState!=='view'" v-model.trim="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: formState==='add',message: '这是必填项'},{match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:'匹配：‘a-z’、‘A-Z’、‘0-9’、‘_’'},
                        {validator:validateCode}]" field="entityName" label="实体名称">
          <a-input v-if="entityIsEdit&&formState!=='view'" v-model.trim="formData.entityName" :max-length="30"/>
          <span v-else>{{ formData.entityName }}</span>
          <a-tooltip v-if="formState!=='view'" content="变更“实体名称”，更新后会同步至数据库">
            <a-button v-if="!entityIsEdit" size="medium" type="text" @click="() => {entityIsEdit=true}">
              <gl-iconfont type="gl-edit-square"/>
            </a-button>
          </a-tooltip>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item field="tableName" label="数据库表名">
          <span>{{ formData.tableName || formData.entityName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: formState==='add',message: '这是必填项'}]" field="tableType" label="表格类型">
          <a-select v-if="formState!=='view'" v-model="formData.tableType" :options="tableTypeOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.tableType, tableTypeOptions) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="所属应用">
          <a-select v-model="formData.appId" :disabled="formState==='view'" @change="appSelectChange">
            <a-option v-for="item of appSelectOptions" :key="item.id as string" :value="item.id"
                      :label="`${utils.getOptionLabel(item.type,appTypeOptions)} | ${item.name}`"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="appId" label="数据库链接">
          <a-select v-if="formState==='add'" v-model="formData.connectId" :options="connectSelectOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.connectId, connectSelectOptions) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="enableStatus" label="状态">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus" :options="enableStatusOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.enableStatus, enableStatusOptions) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="packBusData" label="打包业务数据">
          <a-select v-if="formState!=='view' && isShowPackBusData"
                    v-model="formData.packBusData" :options="packBusDataOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.packBusData, packBusDataOptions) }}</span>
          <template #extra>
            打包业务数据时，增量为：仅插入打包数据，不修改不删除表数据；全量为：先清空表再插入打包数据。
          </template>
        </a-form-item>
      </a-col>
      <a-col v-if="false" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="linked" label="连接状态">
          <a-select v-if="formState!=='view'" v-model="formData.linked" :options="linkedOptions"/>
          <span v-else>{{ utils.getOptionLabel(formData.linked, linkedOptions) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="labelCol+wrapperCol">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="tableComment" label="数据库注释">
          <a-textarea v-if="formState!=='view'" v-model="formData.tableComment" :auto-size="{minRows:2,maxRows:4}" :max-length="512" show-word-limit/>
          <span v-else :title="formData.tableComment" class="textarea-span" @click="openModal(`${formData.tableComment}`)">{{ formData.tableComment }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="labelCol+wrapperCol">
        <a-form-item :label-col-props="{ span: labelCol/formCol }"
                     :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
                     field="description" label="补充描述">
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

.trigger-demo-translate {
  padding: 10px;
  min-width: 500px;
  min-height: 360px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>