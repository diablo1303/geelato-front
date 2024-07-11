<script lang="ts">
export default {
  name: 'ModelTableForeignModel'
};
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useI18n} from 'vue-i18n';
import {FormInstance, Modal} from "@arco-design/web-vue";
import {PageQueryRequest} from "@/api/base";
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import {
  createOrUpdateTableForeign as createOrUpdateForm,
  getTableForeign as getForm,
  QueryTableColumnForm, queryTableColumns,
  QueryTableForeignForm as QueryForm, QueryTableForm,
  queryTables
} from "@/api/model";
import {enableStatusOptions} from "./searchTable";

// 页面所需 参数
type PageParams = {
  connectId: string; // 数据库链接id
  mainTable: string; // 模型名称
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
    mainTable: props.parameter.mainTable || '', // 主表表名
    mainTableCol: '', // 主表表名字段
    foreignTable: '', // 外键关联表表名
    foreignTableCol: '', // 外键关联表字段
    updateAction: 'NO ACTION',
    deleteAction: 'NO ACTION',
    enableStatus: 1, // 状态
    description: '',
    seqNo: 999,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}
const formData = ref(generateFormData());
const appSelectOptions = ref<QueryAppForm[]>([]);
const tableOptions = ref<QueryTableForm[]>([]);
const mainTableColOptions = ref<QueryTableColumnForm[]>([]);
const foreignTableColOptions = ref<QueryTableColumnForm[]>([]);

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
 * 获取模型
 * @param params
 */
const fetchTables = async (params?: Record<string, any>) => {
  try {
    const {data} = await queryTables({
      ...params,
      enableStatus: 1, tableType: 'table', connectId: props.parameter?.connectId || '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
    tableOptions.value = data;
  } catch (err) {
    tableOptions.value = [];
  }
}
/**
 * 获取模型字段
 * @param params
 */
const fetchTableColumns = async (params?: Record<string, any>): Promise<QueryTableColumnForm[]> => {
  let columnOptions: QueryTableColumnForm[] = [];
  try {
    const {data} = await queryTableColumns({...params, enableStatus: 1} as unknown as PageQueryRequest);
    columnOptions = data;
  } catch (err) {
    columnOptions = [];
  }
  return columnOptions;
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

const mainTableChange = (value: string) => {
  const name = formData.value.mainTable;
  if (name) {
    fetchTableColumns({tableName: name}).then((data) => {
      mainTableColOptions.value = data;
    });
  } else {
    mainTableColOptions.value = [];
  }
}
const foreignTableChange = (value: any) => {
  if (value) {
    formData.value.foreignTableCol = '';
    foreignTableColOptions.value = [];
    fetchTableColumns({tableName: value}).then((data) => {
      foreignTableColOptions.value = data;
    });
  }
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
  // 应用信息
  getAppSelectOptions({
    id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }, (data: QueryAppForm[]) => {
    appSelectOptions.value = data || [];
  }, () => {
    appSelectOptions.value = [];
  });
  // 表单
  fetchTables();
  // 表单数据重置
  formData.value = generateFormData();
  if (['add'].includes(props.formState) && props.parameter.mainTable) {
    mainTableChange(formData.value.mainTable);
  }
  // 重置验证
  resetValidate();
  // 其他初始化
  // 编辑、查看 状态 查询数据
  if (['edit', 'view'].includes(props.formState) && props.modelValue) {
    getData(props.modelValue, (data: QueryForm) => {
      mainTableChange(data.mainTable);
      foreignTableChange(data.foreignTable);
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
            :label="$t('model.foreign.index.form.mainTable')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="mainTable">
          <a-select
              v-if="formState!=='view'" v-model="formData.mainTable" :disabled="parameter.mainTable" allow-search
              @change="mainTableChange(formData.mainTable)">
            <a-option v-for="item of tableOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
          </a-select>
          <span v-else>{{ formData.mainTable }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.mainTableCol')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="mainTableCol">
          <a-select v-if="formState!=='view'" v-model="formData.mainTableCol" allow-search>
            <a-option v-for="item of mainTableColOptions" :key="item.id" :label="`${item.title}[${item.name}]`" :value="item.name"/>
          </a-select>
          <span v-else>{{ formData.mainTableCol }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.foreignTable')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="foreignTable">
          <a-select v-if="formState!=='view'" v-model="formData.foreignTable" allow-search @change="foreignTableChange">
            <a-option v-for="item of tableOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.entityName"/>
          </a-select>
          <span v-else>{{ formData.foreignTable }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.foreignTableCol')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="foreignTableCol">
          <a-select v-if="formState!=='view'" v-model="formData.foreignTableCol" allow-search>
            <a-option v-for="item of foreignTableColOptions" :key="item.id" :label="`${item.title}[${item.name}]`" :value="item.name"/>
          </a-select>
          <span v-else>{{ formData.foreignTableCol }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item :label="$t('model.column.index.form.appId')"
                     :rules="[{required: !!parameter.appId,message: $t('model.form.rules.match.required')}]"
                     field="appId">
          <a-select v-model="formData.appId" :disabled="formState==='view'||!parameter.appId">
            <a-option v-for="item of appSelectOptions" :key="item.id as string" :label="item.name" :value="item.id"/>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.enableStatus')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="enableStatus">
          <a-select v-if="formState!=='view'" v-model="formData.enableStatus">
            <a-option
                v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                :value="item.value"/>
          </a-select>
          <span v-else>{{ $t(`model.foreign.index.form.enableStatus.${formData.enableStatus}`) }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)/formCol">
        <a-form-item
            :label="$t('model.foreign.index.form.seqNo')"
            :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
            field="seqNo">
          <a-input-number
              v-if="formState!=='view'"
              v-model="formData.seqNo"
              :max="999999999"
              :min="1"
              :placeholder="$t('model.form.rules.match.length.title')+'[0,999999999]'"
              :precision="0"/>
          <span v-else>{{ formData.seqNo }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="(labelCol+wrapperCol)">
        <a-form-item
            :label="$t('model.foreign.index.form.description')"
            :label-col-props="{ span: labelCol/formCol }"
            :wrapper-col-props="{ span: (labelCol+wrapperCol-labelCol/formCol) }"
            field="description">
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