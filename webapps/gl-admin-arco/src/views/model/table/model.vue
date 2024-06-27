<script lang="ts">
export default {
  name: 'ModelTableModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {PageQueryRequest} from "@/api/base";
import {FormInstance, Modal} from "@arco-design/web-vue";
import {pageQueryAppConnectOf, QueryAppForm} from '@/api/application';
import {
  QueryTableForm as QueryForm,
  createOrUpdateTable as createOrUpdateForm,
  getTable as getForm,
  validateTableEntityName
} from "@/api/model";
import {enableStatusOptions, linkedOptions, packBusDataOptions, tableTypeOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
  connectId: string; // 连接主键
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
    connectId: props.parameter.connectId || '', // 数据库连接 id
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
    sourceType: 'creation', // 同步类型 creation:创建;update:更新
    packBusData: 0, // 数据打包策略：0 不打包，1 增量，2 全量
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const entityIsEdit = ref<boolean>(false);
const isShowPackBusData = ref<boolean>(false);

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

const getAppSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await pageQueryAppConnectOf({
      ...params, current: 1, pageSize: 10000, order: 'updateAt|desc'
    } as unknown as PageQueryRequest);
    const options: QueryAppForm[] = [];
    if (data && data.items && data.items.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data.items) {
        // @ts-ignore
        options.push({id: item.appId, name: item.appName, code: item.appCode, type: item.appType});
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
    const {data} = await validateTableEntityName(formData.value);
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

/**
 * 页面加载方法，对外提供
 */
const loadPage = async () => {
  entityIsEdit.value = props.formState === 'add';
  isShowPackBusData.value = false;
  // 应用信息
  await getAppSelectOptions({
    connectId: props.parameter?.connectId || '',
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单数据重置
  formData.value = generateFormData();
  // 重置验证
  resetValidate();
  changePackBusData();
  // 其他初始化
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    await getData(props.modelValue, (data: QueryForm) => {
      // 表格数据处理
      data.seqNo = Number(data.seqNo);
      entityIsEdit.value = !data.tableName;
      formData.value = data;
      changePackBusData();
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
            :label="$t('model.table.index.form.title')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="title">
          <a-input v-if="formState!=='view'" v-model.trim="formData.title" :max-length="32"/>
          <span v-else>{{ formData.title }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.entityName')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')},
            {match: /^[a-zA-Z][a-zA-Z0-9_]*$/,message:$t('model.form.rules.match.entityName.match')},
            {validator:validateCode}]" field="entityName">
          <a-input v-if="entityIsEdit" v-model.trim="formData.entityName" :max-length="30"/>
          <span v-else>{{ formData.entityName }}</span>
          <a-tooltip :content="$t('searchTable.columns.operations.alter.warning')">
            <a-button v-if="!entityIsEdit" size="medium" type="text" @click="ev => {entityIsEdit=true}">
              <icon-edit/>
            </a-button>
          </a-tooltip>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.table.index.form.tableName')" field="tableName">
          <span>{{ formData.tableName || formData.entityName }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.tableType')"
            :rules="[{required: formState==='add',message: $t('model.form.rules.match.required')}]"
            field="tableType">
          <a-select v-if="formState==='add'" v-model="formData.tableType">
            <a-option v-for="item of tableTypeOptions" :key="item.value as string" :disabled="item.disabled"
                      :label="$t(`${item.label}`)" :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.tableType.${formData.tableType}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.appId')"
            :rules="[{required: !!parameter.appId,message: $t('model.form.rules.match.required')}]"
            field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'" @change="appSelectChange">
            <a-option v-for="(item,index) of appSelectOptions" :key="index" :value="item.id"
                      :label="`${$t(`application.app.list.type.${item.type}`)} | ${item.name}`"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option
                v-for="item of enableStatusOptions" :key="item.value as string"
                :label="$t(`${item.label}`)"
                :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col v-if="isShowPackBusData" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.packBusData')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="linked">
          <a-select v-if="formState!=='view'" v-model="formData.packBusData">
            <a-option v-for="(item,index) of packBusDataOptions" :key="index" :label="$t(`${item.label}`)"
                      :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.packBusData.${formData.packBusData}`) }}</span>
          <template #extra>
            {{ $t("model.table.index.form.packBusData.extra") }}
          </template>
        </a-form-item>
      </a-col>
      <a-col v-if="false" :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.table.index.form.linked')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="linked">
          <a-select v-if="formState!=='view'" v-model="formData.linked">
            <a-option v-for="item of linkedOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                      :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.table.index.form.linked.${formData.linked}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item
            :label="$t('model.table.index.form.tableComment')"
            :label-col-props="{ span: labelCol/formCol }"
            :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
            field="tableComment">
          <a-textarea
              v-if="formState!=='view'" v-model="formData.tableComment" :auto-size="{minRows:2,maxRows:4}"
              :max-length="512" show-word-limit/>
          <span
              v-else :title="formData.tableComment" class="textarea-span"
              @click="openModal(`${formData.tableComment}`)">{{ formData.tableComment }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item
            :label="$t('model.table.index.form.description')"
            :label-col-props="{ span: labelCol/formCol }"
            :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
            field="description">
          <a-textarea
              v-if="formState!=='view'" v-model="formData.description" :auto-size="{minRows:2,maxRows:4}"
              :max-length="512" show-word-limit/>
          <span
              v-else :title="formData.description" class="textarea-span"
              @click="openModal(`${formData.description}`)">{{ formData.description }}</span>
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